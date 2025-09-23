using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;
using Colors = QuestPDF.Helpers.Colors;
using Document = QuestPDF.Fluent.Document;
using IContainer = QuestPDF.Infrastructure.IContainer;






namespace Backend.Services.Implementation;

public class AttendanceSevice : ResponseHandler, IAttendanceSevice
{
    #region    Fields
    private readonly IUnitOfWork _unitOfWork;
    #endregion

    #region    Constructor
    public AttendanceSevice(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }
    #endregion

    #region    Methods
    public async Task<Response<GetAttendencePage>> GetAttendancePage(int courseId, int lessionId)
    {
        var result = await ValidateLessionAndCourseExist(lessionId, courseId);
        if (result != "success") return BadRequest<GetAttendencePage>(result);

        var AttendanceList = _unitOfWork.Repository<Student>().GetTableNoTracking()
                                                        .Where(s => s.StudentCourses.Any(sc => sc.CourseId == courseId))
                                                        .Include(l => l.MeetingAttendance)
                                                        .AsEnumerable() // Move from EF to LINQ-to-Objects
                                                        .Select(s =>
                                                        {
                                                            var attendance = s.MeetingAttendance?.FirstOrDefault(a => a.LessionId == lessionId);

                                                            return new AttendenceDto
                                                            {
                                                                AttendType = attendance?.enAttendType ?? enAttendType.Absent,
                                                                Email = s.Email ?? "Error",
                                                                Id = s.Id,
                                                                IsTaken = attendance?.IsTaken ?? false,
                                                                NationalId = s.NationalId,
                                                                Note = attendance?.Note ?? "",
                                                                StudentName = s.NameEn ?? "Error",
                                                            };
                                                        }).ToList();

        var response = new GetAttendencePage
        {
            AttendenceDtos = AttendanceList,
            courseId = courseId,
            lessionId = lessionId
        };

        return Success(response);
    }
    public async Task<Response<string>> SubmitAttendancePage(AttendanceSubmition submition)
    {
        var attendanceList = new List<MeetingAttendance>();

        var result = await ValidateLessionAndCourseExist(submition.LessionId, submition.CourseId);
        if (result != "success") return BadRequest<string>(result);


        // check if student in this lession is already taken => update  not add it
        foreach (var studentAttendance in submition.StudentsAttendanceDto)
        {
            var isUpdate = await UpdateAttendanceAreadyExist(studentAttendance, submition.LessionId);

            if (!isUpdate)
            {
                var Dto = SaveNewAttendance(studentAttendance, submition.LessionId, submition.CourseId);
                attendanceList.Add(Dto);
            }
        }

        if (attendanceList.Count > 0)
            await _unitOfWork.Repository<MeetingAttendance>().AddRangeAsync(attendanceList);

        var response = _unitOfWork.Complete();

        return response < 0 ? BadRequest<string>("Error Happend try again") :
                              Created<string>("Saved Success");
    }
    public async Task<Response<List<FilterAtt>>> FilterAttendance()
    {
        var FilterForAttendance = await _unitOfWork.Repository<Course>()
                                          .GetTableNoTracking()
                                          .Include(c => c.lessons)
                                          .Where(c => c.IsDeleted == false)
                                          .Select(c => new FilterAtt
                                          {
                                              CourseId = c.Id,
                                              CourseName = c.TitleEn,
                                              showLessionInfos = c.lessons.Select(l => new showLessionInfo
                                              {
                                                  LessionName = l.TitleEn,
                                                  LessionId = l.Id
                                              }).ToList()
                                          }).ToListAsync();

        return Success(FilterForAttendance);
    }

    public async Task<Response<GetStudentRecoredAttendanceDto>> GetStudentAttendancePerCourse(int studentId, int courseId)
    {
        var isUserExist = await ValidateStudentExist(studentId);
        var isCourseExist = await ValidateCourseExist(courseId);

        if (!isUserExist || !isCourseExist)
        {
            // log can not get attendance error
            return BadRequest<GetStudentRecoredAttendanceDto>("this student or course not exist");
        }

        var lessionAttendanceRecoreds = await _unitOfWork.Repository<MeetingAttendance>()
                                                .GetTableNoTracking()
                                                .Include(m => m.Lesson)
                                                .Where(m => m.CourseId == courseId && m.StudentId == studentId)
                                                .Select(m => new LessionAttendanceRecored
                                                {
                                                    LessionId = m.LessionId,
                                                    AttendType = m.enAttendType,
                                                    LessionName = m.Lesson.TitleEn,
                                                    Note = m.Note,
                                                    TakenAt = m.AttendanceDate,
                                                }).OrderBy(m => m.LessionId)
                                                .ToListAsync();


        var response = await _unitOfWork.Repository<StudentCourse>()
                                        .GetTableNoTracking()
                                        .Include(c => c.Course)
                                        .ThenInclude(c => c.lessons)
                                        .Include(sc => sc.Student)!
                                        .Where(c => c.CourseId == courseId && c.StudentId == studentId)
                                        .Select(sc => new GetStudentRecoredAttendanceDto
                                        {
                                            CoursetName = sc.Course.TitleEn,
                                            NumberOfLession = sc.Course.lessons!.Count(),
                                            StudentName = sc.Student.NameEn ?? "no name",
                                            StudentId = sc.Student.Id,
                                        }).FirstOrDefaultAsync();
        if (response == null)
        {
            // log no student in this course
            return BadRequest<GetStudentRecoredAttendanceDto>("no student in this course");
        }
        var numberOfAllTakenAttendance = lessionAttendanceRecoreds.Count();
        var numberOfAttendedSession = lessionAttendanceRecoreds.Count(c => c.AttendType == enAttendType.Attend);

        var percentageOfAttandance = ((decimal)numberOfAttendedSession / (decimal)numberOfAllTakenAttendance) * 100;

        var numberOfAllSession = response.NumberOfLession;

        var numberOfResumeSession = numberOfAllSession - numberOfAllTakenAttendance;

        var muximumNumberOfAttendedSession = numberOfAttendedSession + numberOfResumeSession;

        var mxPredictedPrecentageOfAttendance = ((decimal)muximumNumberOfAttendedSession / numberOfAllSession) * 100;



        response.lessionAttendanceRecoreds = lessionAttendanceRecoreds;
        response.NumberOfTakenSession = numberOfAllTakenAttendance;
        response.PercentageOfAttendance = percentageOfAttandance;
        response.MuximumNumberOfAttendedSession = muximumNumberOfAttendedSession;
        response.MaxPredictedPrecentageOfAttendance = mxPredictedPrecentageOfAttendance;
        response.NumberOfResumeSession = numberOfResumeSession;

        // log get student attendance profile

        return Success(response);
    }

    public async Task<Response<GetCourseRecoredAttendanceDto>> GetAttendancePerCourse(int courseId)
    {
        var attPerCourse = await _unitOfWork.Repository<Course>()
                                                .GetTableNoTracking()
                                                .Where(sc => sc.Id == courseId)
                                                .Include(c => c.StudentCourses)
                                                .Select(c => new GetCourseRecoredAttendanceDto
                                                {
                                                    CourseLevel = c.LevelEn,
                                                    Description = c.DescriptionEn,
                                                    EndDate = c.EndDate,
                                                    StartDate = c.StartDate,
                                                    Price = c.Price,
                                                    StudentsIds = c.StudentCourses.Select(sc => sc.StudentId).ToList(),
                                                }).FirstOrDefaultAsync();

        decimal allpercentageStudents = 0;

        foreach (var istudentId in attPerCourse.StudentsIds)
        {
            var result = await GetStudentAttendancePerCourse(istudentId, courseId);

            if (result.Data != null)
            {
                attPerCourse.StudentsAttendance.Add(result.Data);

                allpercentageStudents += result.Data.PercentageOfAttendance;
            }
        }

        attPerCourse.NumberOfStudents = attPerCourse.StudentsIds.Count;
        attPerCourse.TotalPercentageOfAttendance = (allpercentageStudents / (attPerCourse.NumberOfStudents * 100)) * 100;

        return Success(attPerCourse);
    }

    private async Task<string> ValidateLessionAndCourseExist(int lessionId, int courseId)
    {
        var isLessionExist = await _unitOfWork.Repository<Lesson>()
                                    .GetTableNoTracking()
                                    .AnyAsync(l => l.Id == lessionId);

        if (!isLessionExist) return "Error this Lession not Exist";

        var isCourseExist = await _unitOfWork.Repository<Course>()
                                              .GetTableNoTracking()
                                              .AnyAsync(c => c.Id == courseId);

        if (!isLessionExist) return "Error this Course not Exist";

        return "success";
    }
    private async Task<bool> UpdateAttendanceAreadyExist(StudentAttendanceDto studentAttendance, int lessionId)
    {
        var attendExist = await _unitOfWork.Repository<MeetingAttendance>()
                                                          .GetTableAsTracking()
                                                          .FirstOrDefaultAsync(ma => ma.StudentId == studentAttendance.StudentId
                                                                                     && ma.LessionId == lessionId);

        if (attendExist is not null)
        {
            attendExist.Note = studentAttendance.Note;
            attendExist.enAttendType = studentAttendance.AttendType;

            if (studentAttendance?.AttendType == enAttendType.Attend) attendExist.Attended = true;
            else attendExist.Attended = false;

            return true;
        }

        return false;
    }
    private MeetingAttendance SaveNewAttendance(StudentAttendanceDto studentAttendance, int lessionId, int courseId)
    {
        var Dto = new MeetingAttendance
        {
            StudentId = studentAttendance.StudentId,
            CourseId = courseId,
            LessionId = lessionId,
            enAttendType = studentAttendance.AttendType,
            Note = studentAttendance?.Note,
            IsTaken = true,
        };

        if (studentAttendance?.AttendType == enAttendType.Attend) Dto.Attended = true;
        else Dto.Attended = false;


        return Dto;
    }

    private async Task<bool> ValidateStudentExist(int studentId)
    {
        return await _unitOfWork.Repository<Student>().GetTableNoTracking().AnyAsync(s => s.Id == studentId && s.IsDeleted == false);
    }
    private async Task<bool> ValidateCourseExist(int courseId)
    {
        return await _unitOfWork.Repository<Course>().GetTableNoTracking().AnyAsync(s => s.Id == courseId && s.IsDeleted == false);
    }

    public async Task<byte[]> GenerateAttendanceExcelReportAsync(int studentId, int courseId)
    {
        var response = await GetStudentAttendancePerCourse(studentId, courseId);

        var result = await GenerateAttendanceExcelReportAsync(response.Data);

        return result;
    }
    private async Task<byte[]> GenerateAttendanceExcelReportAsync(GetStudentRecoredAttendanceDto dto)
    {
        using var workbook = new XLWorkbook();
        var worksheet = workbook.Worksheets.Add("Attendance Report");

        int row = 1;

        // --- Report Title ---
        worksheet.Cell(row, 1).Value = "Student Attendance Report";
        worksheet.Range(row, 1, row, 5).Merge().Style
            .Font.SetBold().Font.SetFontSize(16)
            .Alignment.SetHorizontal(XLAlignmentHorizontalValues.Center)
            .Fill.SetBackgroundColor(XLColor.LightBlue);
        row += 2;

        // --- Header Info ---
        worksheet.Cell(row, 1).Value = "Student Name";
        worksheet.Cell(row, 2).Value = dto.StudentName;
        row++;

        worksheet.Cell(row, 1).Value = "Student Id";
        worksheet.Cell(row, 2).Value = dto.StudentId;
        row++;

        worksheet.Cell(row, 1).Value = "Course Name";
        worksheet.Cell(row, 2).Value = dto.CoursetName;
        row++;

        worksheet.Cell(row, 1).Value = "Number Of Lessons";
        worksheet.Cell(row, 2).Value = dto.NumberOfLession;
        row++;

        worksheet.Cell(row, 1).Value = "Taken Sessions";
        worksheet.Cell(row, 2).Value = dto.NumberOfTakenSession;
        row++;

        worksheet.Cell(row, 1).Value = "Resume Sessions";
        worksheet.Cell(row, 2).Value = dto.NumberOfResumeSession;
        row++;

        worksheet.Cell(row, 1).Value = "Max Attended Sessions";
        worksheet.Cell(row, 2).Value = dto.MuximumNumberOfAttendedSession;
        row++;

        worksheet.Cell(row, 1).Value = "Attendance %";
        worksheet.Cell(row, 2).Value = dto.PercentageOfAttendance;
        row++;

        worksheet.Cell(row, 1).Value = "Max Predicted %";
        worksheet.Cell(row, 2).Value = dto.MaxPredictedPrecentageOfAttendance;

        // Style header info section
        worksheet.Range(1, 1, row, 2).Style
            .Alignment.SetHorizontal(XLAlignmentHorizontalValues.Center)
            .Border.SetOutsideBorder(XLBorderStyleValues.Thin);

        row += 2;

        // --- Lessons Attendance Table ---
        worksheet.Cell(row, 1).Value = "Lesson Id";
        worksheet.Cell(row, 2).Value = "Lesson Name";
        worksheet.Cell(row, 3).Value = "Attend Type";
        worksheet.Cell(row, 4).Value = "Note";
        worksheet.Cell(row, 5).Value = "Taken At";

        worksheet.Range(row, 1, row, 5).Style
            .Font.SetBold()
            .Fill.SetBackgroundColor(XLColor.LightGray)
            .Alignment.SetHorizontal(XLAlignmentHorizontalValues.Center)
            .Border.SetOutsideBorder(XLBorderStyleValues.Thin);

        row++;

        // --- Lesson Attendance Records ---
        int lessonIndex = 0;
        foreach (var record in dto.lessionAttendanceRecoreds)
        {
            worksheet.Cell(row, 1).Value = record.LessionId;
            worksheet.Cell(row, 2).Value = record.LessionName;
            worksheet.Cell(row, 3).Value = record.AttendType?.ToString() ?? "N/A";
            worksheet.Cell(row, 4).Value = record.Note ?? "";
            worksheet.Cell(row, 5).Value = record.TakenAt.ToString("yyyy-MM-dd HH:mm");

            // Style each row
            worksheet.Range(row, 1, row, 5).Style
                .Alignment.SetHorizontal(XLAlignmentHorizontalValues.Center)
                .Border.SetOutsideBorder(XLBorderStyleValues.Thin);

            // Zebra striping for readability
            if (lessonIndex % 2 == 0)
                worksheet.Range(row, 1, row, 5).Style.Fill.SetBackgroundColor(XLColor.AliceBlue);

            lessonIndex++;
            row++;
        }

        // Auto adjust column widths
        worksheet.Columns().AdjustToContents();

        // Save to memory stream
        using var stream = new MemoryStream();
        workbook.SaveAs(stream);
        return stream.ToArray();

    }

    public async Task<byte[]> GenerateCourseAttendanceExcelReportAsync(int courseId)
    {
        var response = await GetAttendancePerCourse(courseId);

        var result = await GenerateCourseAttendanceExcelReportAsync(response.Data);

        return result;
    }
    private async Task<byte[]> GenerateCourseAttendanceExcelReportAsync(GetCourseRecoredAttendanceDto dto)
    {
        using var workbook = new XLWorkbook();
        var worksheet = workbook.Worksheets.Add("Course Attendance");

        int row = 1;

        // Title
        worksheet.Cell(row, 1).Value = "Course Attendance Report";
        worksheet.Range(row, 1, row, 9).Merge().Style
            .Font.SetBold().Font.SetFontSize(16)
            .Alignment.SetHorizontal(XLAlignmentHorizontalValues.Center)
            .Fill.SetBackgroundColor(XLColor.LightBlue);
        row += 2;

        // --- Course Info ---
        worksheet.Cell(row, 1).Value = "Course Description";
        worksheet.Cell(row, 2).Value = dto.Description;
        row++;

        worksheet.Cell(row, 1).Value = "Course Level";
        worksheet.Cell(row, 2).Value = dto.CourseLevel;
        row++;

        worksheet.Cell(row, 1).Value = "Start Date";
        worksheet.Cell(row, 2).Value = dto.StartDate?.ToString("yyyy-MM-dd") ?? "N/A";
        row++;

        worksheet.Cell(row, 1).Value = "End Date";
        worksheet.Cell(row, 2).Value = dto.EndDate?.ToString("yyyy-MM-dd") ?? "N/A";
        row++;

        worksheet.Cell(row, 1).Value = "Price";
        worksheet.Cell(row, 2).Value = dto.Price?.ToString("C") ?? "N/A"; // currency
        row++;

        worksheet.Cell(row, 1).Value = "Number of Students";
        worksheet.Cell(row, 2).Value = dto.NumberOfStudents;
        row++;

        worksheet.Cell(row, 1).Value = "Total Attendance %";
        worksheet.Cell(row, 2).Value = dto.TotalPercentageOfAttendance;
        row += 2;

        // --- Students Attendance ---
        worksheet.Cell(row, 1).Value = "Student Id";
        worksheet.Cell(row, 2).Value = "Student Name";
        worksheet.Cell(row, 3).Value = "Course Name";
        worksheet.Cell(row, 4).Value = "Number of Lessons";
        worksheet.Cell(row, 5).Value = "Taken Sessions";
        worksheet.Cell(row, 6).Value = "Resume Sessions";
        worksheet.Cell(row, 7).Value = "Max Attended";
        worksheet.Cell(row, 8).Value = "Attendance %";
        worksheet.Cell(row, 9).Value = "Max Predicted %";

        worksheet.Range(row, 1, row, 9).Style
            .Font.SetBold()
            .Fill.SetBackgroundColor(XLColor.LightGray)
            .Alignment.SetHorizontal(XLAlignmentHorizontalValues.Center)
            .Border.SetOutsideBorder(XLBorderStyleValues.Thin);

        row++;

        foreach (var student in dto.StudentsAttendance.Where(s => s != null))
        {
            worksheet.Cell(row, 1).Value = student!.StudentId;
            worksheet.Cell(row, 2).Value = student.StudentName;
            worksheet.Cell(row, 3).Value = student.CoursetName;
            worksheet.Cell(row, 4).Value = student.NumberOfLession;
            worksheet.Cell(row, 5).Value = student.NumberOfTakenSession;
            worksheet.Cell(row, 6).Value = student.NumberOfResumeSession;
            worksheet.Cell(row, 7).Value = student.MuximumNumberOfAttendedSession;
            worksheet.Cell(row, 8).Value = student.PercentageOfAttendance;
            worksheet.Cell(row, 9).Value = student.MaxPredictedPrecentageOfAttendance;

            // Style student row
            worksheet.Range(row, 1, row, 9).Style
                .Alignment.SetHorizontal(XLAlignmentHorizontalValues.Center)
                .Border.SetOutsideBorder(XLBorderStyleValues.Thin);

            row++;

            // Nested Lesson Records Table per Student
            worksheet.Cell(row, 2).Value = "Lesson Id";
            worksheet.Cell(row, 3).Value = "Lesson Name";
            worksheet.Cell(row, 4).Value = "Attend Type";
            worksheet.Cell(row, 5).Value = "Note";
            worksheet.Cell(row, 6).Value = "Taken At";

            worksheet.Range(row, 2, row, 6).Style
                .Font.SetBold().Font.SetItalic()
                .Fill.SetBackgroundColor(XLColor.LightYellow)
                .Alignment.SetHorizontal(XLAlignmentHorizontalValues.Center)
                .Border.SetOutsideBorder(XLBorderStyleValues.Thin);

            row++;

            foreach (var lesson in student.lessionAttendanceRecoreds)
            {
                worksheet.Cell(row, 2).Value = lesson.LessionId;
                worksheet.Cell(row, 3).Value = lesson.LessionName;
                worksheet.Cell(row, 4).Value = lesson.AttendType?.ToString() ?? "N/A";
                worksheet.Cell(row, 5).Value = lesson.Note ?? "";
                worksheet.Cell(row, 6).Value = lesson.TakenAt.ToString("yyyy-MM-dd HH:mm");

                worksheet.Range(row, 2, row, 6).Style
                    .Alignment.SetHorizontal(XLAlignmentHorizontalValues.Center)
                    .Border.SetOutsideBorder(XLBorderStyleValues.Thin);

                row++;
            }

            row++; // spacing after each student
        }

        worksheet.Columns().AdjustToContents();

        // Save
        using var stream = new MemoryStream();
        workbook.SaveAs(stream);
        return stream.ToArray();

    }

    #endregion
}

public class GetCourseRecoredAttendanceDto
{
    public int NumberOfStudents { get; set; }
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public string? CourseLevel { get; set; }
    public string? Description { get; set; }
    public double? Price { get; set; }
    public decimal TotalPercentageOfAttendance { get; set; }
    public List<GetStudentRecoredAttendanceDto?> StudentsAttendance { get; set; } = new List<GetStudentRecoredAttendanceDto?>();
    public List<int> StudentsIds { get; set; }
}

public class GetStudentRecoredAttendanceDto
{
    public int NumberOfLession { get; set; }
    public string StudentName { get; set; }
    public int StudentId { get; set; }

    public string CoursetName { get; set; }
    public int NumberOfTakenSession { get; set; }
    public int NumberOfResumeSession { get; set; }
    public int MuximumNumberOfAttendedSession { get; set; }
    public decimal PercentageOfAttendance { get; set; }
    public decimal MaxPredictedPrecentageOfAttendance { get; set; }
    public List<LessionAttendanceRecored> lessionAttendanceRecoreds { get; set; }
}

public class LessionAttendanceRecored
{
    public int LessionId { get; set; }
    public string LessionName { get; set; }
    public enAttendType? AttendType { get; set; }
    public string? Note { get; set; }
    public DateTime TakenAt { get; set; }
}

//public class AttendancePdfGenerator
//{
//    public static byte[] Generate(GetStudentRecoredAttendanceDto dto)
//    {
//        var document = Document.Create(container =>
//        {
//            container.Page(page =>
//            {
//                page.Margin(30);
//                page.Size(PageSizes.A4);

//                page.Header()
//                    .Text("Student Attendance Report")
//                    .FontSize(18)
//                    .SemiBold()
//                    .AlignCenter()
//                    .FontColor(Colors.Blue.Medium);

//                page.Content().PaddingVertical(10).Column(col =>
//                {
//                    // --- Student Info Section ---
//                    col.Item().Table(table =>
//                    {
//                        table.ColumnsDefinition(c =>
//                        {
//                            c.ConstantColumn(150);
//                            c.RelativeColumn();
//                        });

//                        void AddRow(string label, string value)
//                        {
//                            table.Cell().Element(CellStyle).Text(label).SemiBold();
//                            table.Cell().Element(CellStyle).Text(value ?? "N/A");
//                        }

//                        AddRow("Student Name", dto.StudentName);
//                        AddRow("Student Id", dto.StudentId.ToString());
//                        AddRow("Course Name", dto.CoursetName);
//                        AddRow("Number Of Lessons", dto.NumberOfLession.ToString());
//                        AddRow("Taken Sessions", dto.NumberOfTakenSession.ToString());
//                        AddRow("Resume Sessions", dto.NumberOfResumeSession.ToString());
//                        AddRow("Max Attended Sessions", dto.MuximumNumberOfAttendedSession.ToString());
//                        AddRow("Attendance %", dto.PercentageOfAttendance.ToString("0.##") + " %");
//                        AddRow("Max Predicted %", dto.MaxPredictedPrecentageOfAttendance.ToString("0.##") + " %");
//                    });

//                    col.Item().PaddingVertical(10).Text("Lesson Attendance Records")
//                        .FontSize(14).Bold().FontColor(Colors.Black);

//                    // --- Lessons Table ---
//                    col.Item().Table(table =>
//                    {
//                        table.ColumnsDefinition(c =>
//                        {
//                            c.ConstantColumn(70);   // Lesson Id
//                            c.RelativeColumn(2);    // Lesson Name
//                            c.RelativeColumn();     // Attend Type
//                            c.RelativeColumn(2);    // Note
//                            c.RelativeColumn(2);    // Taken At
//                        });

//                        // Table Header
//                        table.Header(header =>
//                        {
//                            header.Cell().Element(HeaderCellStyle).Text("Lesson Id");
//                            header.Cell().Element(HeaderCellStyle).Text("Lesson Name");
//                            header.Cell().Element(HeaderCellStyle).Text("Attend Type");
//                            header.Cell().Element(HeaderCellStyle).Text("Note");
//                            header.Cell().Element(HeaderCellStyle).Text("Taken At");
//                        });

//                        foreach (var lesson in dto.lessionAttendanceRecoreds)
//                        {
//                            table.Cell().Element(CellStyle).Text(lesson.LessionId.ToString());
//                            table.Cell().Element(CellStyle).Text(lesson.LessionName);
//                            table.Cell().Element(CellStyle).Text(lesson.AttendType?.ToString() ?? "N/A");
//                            table.Cell().Element(CellStyle).Text(lesson.Note ?? "");
//                            table.Cell().Element(CellStyle).Text(lesson.TakenAt.ToString("yyyy-MM-dd HH:mm"));
//                        }
//                    });
//                });

//                page.Footer()
//                    .AlignCenter()
//                    .Text(text =>
//                    {
//                        text.Span("Generated on ").FontSize(9);
//                        text.Span(DateTime.Now.ToString("yyyy-MM-dd HH:mm")).FontSize(9).SemiBold();
//                    });
//            });
//        });

//        return document.GeneratePdf();
//    }

//    private static IContainer CellStyle(IContainer container)
//    {
//        return container
//            .Border(1)
//            .BorderColor(Colors.Grey.Lighten2)
//            .PaddingVertical(5)
//            .PaddingHorizontal(10);
//    }

//    private static IContainer HeaderCellStyle(IContainer container)
//    {
//        return container.Padding(5).Background(Colors.Grey.Lighten3).BorderBottom(1).BorderColor(Colors.Black);
//    }
//}


public class AttendancePdfGeneratorPerCourse
{
    public static byte[] Generate(GetCourseRecoredAttendanceDto dto)
    {
        QuestPDF.Settings.License = LicenseType.Community;

        var document = Document.Create(container =>
        {
            container.Page(page =>
            {
                page.Margin(30);
                page.Size(PageSizes.A4);
                page.DefaultTextStyle(x => x.FontSize(11).FontFamily("Arial"));

                // ---- Header ----
                page.Header().Element(ComposeHeader);

                page.Content().Column(col =>
                {
                    col.Spacing(15);

                    // --- Course Summary ---
                    col.Item().Element(c => ComposeCourseSummary(c, dto));

                    // --- Overall Statistics ---
                    col.Item().Element(c => ComposeOverallStats(c, dto));

                    // --- Students Attendance ---
                    col.Item().Element(c => ComposeStudentsAttendance(c, dto));
                });

                // ---- Footer ----
                page.Footer().AlignCenter().Text(text =>
                {
                    text.Span("Page ").FontSize(10);
                    text.CurrentPageNumber().FontSize(10);
                    text.Span(" of ").FontSize(10);
                    text.TotalPages().FontSize(10);
                    text.Span($" | Generated on {DateTime.Now:yyyy-MM-dd HH:mm}").FontSize(10);
                });
            });
        });

        return document.GeneratePdf();
    }

    private static void ComposeHeader(IContainer container)
    {
        container.Column(col =>
        {
            col.Item().AlignCenter().Text("Course Attendance Report")
                .Bold().FontSize(24).FontColor(Colors.Blue.Darken3);

            col.Item().AlignCenter().Text("Detailed Attendance Summary")
                .SemiBold().FontSize(14).FontColor(Colors.Grey.Medium);

            col.Item().PaddingTop(5).LineHorizontal(1).LineColor(Colors.Blue.Lighten1);
        });
    }

    private static void ComposeCourseSummary(IContainer container, GetCourseRecoredAttendanceDto dto)
    {
        container.Background(Colors.Grey.Lighten5)
            .Padding(15)
            .Border(1)
            .BorderColor(Colors.Grey.Lighten2)
            .Column(col =>
            {
                col.Item().Text("Course Information").Bold().FontSize(16).FontColor(Colors.Blue.Darken2);
                col.Item().PaddingVertical(5);

                col.Item().Grid(grid =>
                {
                    grid.Columns(3);
                    grid.Spacing(10);

                    ComposeInfoCard(grid, "Description", dto.Description ?? "N/A", Colors.Blue.Lighten5);
                    ComposeInfoCard(grid, "Level", dto.CourseLevel ?? "N/A", Colors.Green.Lighten5);
                    ComposeInfoCard(grid, "Students", dto.NumberOfStudents.ToString(), Colors.Orange.Lighten5);
                    ComposeInfoCard(grid, "Start Date", dto.StartDate?.ToString("MMM dd, yyyy") ?? "N/A", Colors.Purple.Lighten5);
                    ComposeInfoCard(grid, "End Date", dto.EndDate?.ToString("MMM dd, yyyy") ?? "N/A", Colors.Purple.Lighten5);
                    ComposeInfoCard(grid, "Price", dto.Price?.ToString("C") ?? "N/A", Colors.Teal.Lighten5);
                });
            });
    }

    private static void ComposeOverallStats(IContainer container, GetCourseRecoredAttendanceDto dto)
    {
        container.Background(Colors.Grey.Lighten5)
            .Padding(15)
            .Border(1)
            .BorderColor(Colors.Grey.Lighten2)
            .Column(col =>
            {
                col.Item().Text("Overall Attendance Statistics").Bold().FontSize(16).FontColor(Colors.Green.Darken2);
                col.Item().PaddingVertical(5);

                col.Item().Grid(grid =>
                {
                    grid.Columns(2);
                    grid.Spacing(10);

                    // Total Attendance Card
                    grid.Item().Background(GetPercentageColor(dto.TotalPercentageOfAttendance))
                        .Padding(15)
                        .Border(1)
                        .BorderColor(Colors.Grey.Lighten1)
                        .Column(card =>
                        {
                            card.Item().AlignCenter().Text("Total Attendance").SemiBold().FontSize(12);
                            card.Item().AlignCenter().Text($"{dto.TotalPercentageOfAttendance:F1}%")
                                .Bold().FontSize(24).FontColor(Colors.White);
                        });

                    // Students Summary Card
                    grid.Item().Background(Colors.Blue.Lighten3)
                        .Padding(15)
                        .Border(1)
                        .BorderColor(Colors.Grey.Lighten1)
                        .Column(card =>
                        {
                            card.Item().AlignCenter().Text("Active Students").SemiBold().FontSize(12).FontColor(Colors.White);
                            card.Item().AlignCenter().Text(dto.NumberOfStudents.ToString())
                                .Bold().FontSize(24).FontColor(Colors.White);
                        });
                });
            });
    }

    private static void ComposeStudentsAttendance(IContainer container, GetCourseRecoredAttendanceDto dto)
    {
        container.Column(col =>
        {
            col.Item().Text("Students Attendance Details").Bold().FontSize(16).FontColor(Colors.Red.Darken2);
            col.Item().PaddingBottom(10);

            int studentIndex = 0;
            foreach (var student in dto.StudentsAttendance.Where(s => s != null))
            {
                var studentDto = student!;
                var backgroundColor = studentIndex % 2 == 0 ? Colors.White : Colors.Grey.Lighten5;

                col.Item().Element(c => ComposeStudentCard(c, studentDto, backgroundColor, studentIndex));
                col.Item().PaddingBottom(10);

                studentIndex++;
            }
        });
    }

    private static void ComposeStudentCard(IContainer container, GetStudentRecoredAttendanceDto student,
        Color backgroundColor, int index)
    {
        container.Background(backgroundColor)
            .Padding(15)
            .Border(1)
            .BorderColor(Colors.Grey.Lighten2)
            .Column(col =>
            {
                // Student Header
                col.Item().Row(row =>
                {
                    row.RelativeItem().Column(studentCol =>
                    {
                        studentCol.Item().Text($"{student.StudentName} (ID: {student.StudentId})")
                            .Bold().FontSize(14).FontColor(Colors.Blue.Darken3);
                        studentCol.Item().Text($"Course: {student.CoursetName}")
                            .SemiBold().FontSize(12).FontColor(Colors.Grey.Darken1);
                    });

                    row.ConstantItem(150).AlignRight().Background(GetPercentageColor(student.PercentageOfAttendance))
                        .Padding(5)
                        .Column(statsCol =>
                        {
                            statsCol.Item().AlignCenter().Text("Attendance").SemiBold().FontSize(10).FontColor(Colors.White);
                            statsCol.Item().AlignCenter().Text($"{student.PercentageOfAttendance:F1}%")
                                .Bold().FontSize(16).FontColor(Colors.White);
                        });
                });

                col.Item().PaddingVertical(5);

                // Student Statistics
                col.Item().Grid(grid =>
                {
                    grid.Columns(4);
                    grid.Spacing(5);

                    ComposeStatCard(grid, "Lessons", student.NumberOfLession.ToString(), Colors.Blue.Lighten4);
                    ComposeStatCard(grid, "Taken", student.NumberOfTakenSession.ToString(), Colors.Green.Lighten4);
                    ComposeStatCard(grid, "Resumed", student.NumberOfResumeSession.ToString(), Colors.Orange.Lighten4);
                    ComposeStatCard(grid, "Max Attended", student.MuximumNumberOfAttendedSession.ToString(), Colors.Purple.Lighten4);
                });

                col.Item().PaddingVertical(5);

                // Lessons Details (if any)
                if (student.lessionAttendanceRecoreds?.Any() == true)
                {
                    col.Item().Text("Lesson Attendance").Bold().FontSize(12).FontColor(Colors.Grey.Darken2);
                    col.Item().PaddingTop(5).Table(table =>
                    {
                        table.ColumnsDefinition(columns =>
                        {
                            columns.RelativeColumn(1); // Lesson ID
                            columns.RelativeColumn(3); // Lesson Name
                            columns.RelativeColumn(2); // Attend Type
                            columns.RelativeColumn(2); // Date
                            columns.RelativeColumn(3); // Note
                        });

                        // Table Header
                        table.Header(header =>
                        {
                            header.Cell().Background(Colors.Grey.Lighten3).Padding(5).Text("ID").Bold().FontSize(9);
                            header.Cell().Background(Colors.Grey.Lighten3).Padding(5).Text("Lesson Name").Bold().FontSize(9);
                            header.Cell().Background(Colors.Grey.Lighten3).Padding(5).Text("Type").Bold().FontSize(9);
                            header.Cell().Background(Colors.Grey.Lighten3).Padding(5).Text("Date").Bold().FontSize(9);
                            header.Cell().Background(Colors.Grey.Lighten3).Padding(5).Text("Note").Bold().FontSize(9);
                        });

                        // Table Rows
                        int lessonIndex = 0;
                        foreach (var lesson in student.lessionAttendanceRecoreds)
                        {
                            var lessonBgColor = lessonIndex % 2 == 0 ? Colors.White : Colors.Grey.Lighten5;

                            table.Cell().Background(lessonBgColor).Padding(5).Text(lesson.LessionId.ToString()).FontSize(9);
                            table.Cell().Background(lessonBgColor).Padding(5).Text(lesson.LessionName).FontSize(9);
                            table.Cell().Background(lessonBgColor).Padding(5).Text(GetAttendTypeDisplay(lesson.AttendType)).FontSize(9);
                            table.Cell().Background(lessonBgColor).Padding(5).Text(lesson.TakenAt.ToString("MMM dd, yyyy")).FontSize(9);
                            table.Cell().Background(lessonBgColor).Padding(5).Text(lesson.Note ?? "-").FontSize(9);

                            lessonIndex++;
                        }
                    });
                }
                else
                {
                    col.Item().AlignCenter().Padding(10).Text("No lesson attendance records available")
                        .Italic().FontSize(10).FontColor(Colors.Grey.Medium);
                }
            });
    }

    private static void ComposeInfoCard(GridDescriptor grid, string title, string value, Color color)
    {
        grid.Item().Background(color).Padding(10).Border(1).Column(col =>
        {
            col.Item().Text(title).Bold().FontSize(10).FontColor(Colors.Grey.Darken3);
            col.Item().Text(value).SemiBold().FontSize(12);
        });
    }

    private static void ComposeStatCard(GridDescriptor grid, string title, string value, Color color)
    {
        grid.Item().Background(color).Padding(8).Border(1).Column(col =>
        {
            col.Item().AlignCenter().Text(title).Bold().FontSize(9);
            col.Item().AlignCenter().Text(value).SemiBold().FontSize(11);
        });
    }

    private static Color GetPercentageColor(decimal percentage)
    {
        return percentage switch
        {
            >= 90 => Colors.Green.Darken1,    // Excellent - Dark Green
            >= 80 => Colors.Green.Lighten1,   // Good - Green
            >= 70 => Colors.Orange.Lighten1,  // Average - Orange
            >= 60 => Colors.Orange.Darken1,   // Below Average - Dark Orange
            _ => Colors.Red.Lighten1          // Poor - Red
        };
    }

    private static string GetAttendTypeDisplay(enAttendType? attendType)
    {
        return attendType?.ToString()?.Replace("_", " ") ?? "Not Recorded";
    }
}

public class AttendancePdfGenerator
{
    public static byte[] Generate(GetStudentRecoredAttendanceDto dto)
    {
        QuestPDF.Settings.License = LicenseType.Community;
        // Enable debugging to get more detailed error information
        QuestPDF.Settings.EnableDebugging = true;

        var document = Document.Create(container =>
        {
            container.Page(page =>
            {
                page.Margin(20); // Reduced margin for more space
                page.Size(PageSizes.A4);
                page.DefaultTextStyle(x => x.FontSize(10).FontFamily("Arial")); // Smaller base font

                // ---- Header ----
                page.Header().Element(ComposeHeader);

                page.Content().Column(col =>
                {
                    col.Spacing(10); // Reduced spacing

                    // --- Student Overview Card ---
                    col.Item().Element(c => ComposeStudentOverview(c, dto));

                    // --- Attendance Statistics ---
                    col.Item().Element(c => ComposeAttendanceStats(c, dto));

                    // --- Lesson Details ---
                    col.Item().Element(c => ComposeLessonDetails(c, dto));
                });

                // ---- Footer ----
                page.Footer().AlignCenter().Text(text =>
                {
                    text.Span("Page ").FontSize(8);
                    text.CurrentPageNumber().FontSize(8);
                    text.Span(" of ").FontSize(8);
                    text.TotalPages().FontSize(8);
                    text.Span($" | Generated on {DateTime.Now:yyyy-MM-dd HH:mm}").FontSize(8);
                });
            });
        });

        return document.GeneratePdf();
    }

    private static void ComposeHeader(IContainer container)
    {
        container.Column(col =>
        {
            col.Item().AlignCenter().Text("Student Attendance Report")
                .Bold().FontSize(18).FontColor(Colors.Blue.Darken3); // Smaller font

            col.Item().AlignCenter().Text("Individual Student Performance Summary")
                .SemiBold().FontSize(10).FontColor(Colors.Grey.Medium); // Smaller font

            col.Item().PaddingTop(3).LineHorizontal(0.5f).LineColor(Colors.Blue.Lighten1);
        });
    }

    private static void ComposeStudentOverview(IContainer container, GetStudentRecoredAttendanceDto dto)
    {
        container.Background(Colors.Grey.Lighten5)
            .Padding(10) // Reduced padding
            .Border(1)
            .BorderColor(Colors.Grey.Lighten2)
            .Column(col =>
            {
                col.Item().Text("Student Overview").Bold().FontSize(14).FontColor(Colors.Blue.Darken2);
                col.Item().PaddingVertical(5);

                col.Item().Grid(grid =>
                {
                    grid.Columns(3);
                    grid.Spacing(5); // Reduced spacing
                    grid.VerticalSpacing(5);

                    ComposeInfoCard(grid, "Student Name", dto.StudentName, Colors.Blue.Lighten5);
                    ComposeInfoCard(grid, "Student ID", dto.StudentId.ToString(), Colors.Green.Lighten5);
                    ComposeInfoCard(grid, "Course", dto.CoursetName, Colors.Orange.Lighten5);
                });
            });
    }

    private static void ComposeAttendanceStats(IContainer container, GetStudentRecoredAttendanceDto dto)
    {
        container.Column(col =>
        {
            col.Item().Text("Attendance Statistics").Bold().FontSize(14).FontColor(Colors.Green.Darken2);
            col.Item().PaddingVertical(3);

            // Main Statistics Grid - Simplified layout
            col.Item().Grid(grid =>
            {
                grid.Columns(2); // Changed from 4 to 2 columns for better spacing
                grid.Spacing(5);
                grid.VerticalSpacing(5);

                ComposeStatCard(grid, "Total Lessons", dto.NumberOfLession.ToString(), Colors.Blue.Lighten4);
                ComposeStatCard(grid, "Taken Sessions", dto.NumberOfTakenSession.ToString(), Colors.Green.Lighten4);
                ComposeStatCard(grid, "Resumed Sessions", dto.NumberOfResumeSession.ToString(), Colors.Orange.Lighten4);
                ComposeStatCard(grid, "Max Attended", dto.MuximumNumberOfAttendedSession.ToString(), Colors.Purple.Lighten4);
            });

            col.Item().PaddingVertical(5);

            // Percentage Cards - Simplified
            col.Item().Grid(grid =>
            {
                grid.Columns(2);
                grid.Spacing(5);

                // Current Attendance Percentage
                grid.Item().Background(GetPercentageColor(dto.PercentageOfAttendance))
                    .Padding(8) // Reduced padding
                    .Border(1)
                    .BorderColor(Colors.Grey.Lighten1)
                    .Column(card =>
                    {
                        card.Item().AlignCenter().Text("Current Attendance").SemiBold().FontSize(10).FontColor(Colors.White);
                        card.Item().AlignCenter().Text($"{dto.PercentageOfAttendance:F1}%")
                            .Bold().FontSize(16).FontColor(Colors.White); // Smaller font
                    });

                // Predicted Maximum Percentage
                grid.Item().Background(GetPredictedPercentageColor(dto.MaxPredictedPrecentageOfAttendance))
                    .Padding(8) // Reduced padding
                    .Border(1)
                    .BorderColor(Colors.Grey.Lighten1)
                    .Column(card =>
                    {
                        card.Item().AlignCenter().Text("Max Predicted").SemiBold().FontSize(10).FontColor(Colors.White);
                        card.Item().AlignCenter().Text($"{dto.MaxPredictedPrecentageOfAttendance:F1}%")
                            .Bold().FontSize(16).FontColor(Colors.White); // Smaller font
                    });
            });

            // Simplified Progress Comparison - Removed complex visualization
            col.Item().PaddingVertical(3).Element(c => ComposeSimpleProgress(c, dto));
        });
    }

    private static void ComposeSimpleProgress(IContainer container, GetStudentRecoredAttendanceDto dto)
    {
        container.Background(Colors.Grey.Lighten5)
            .Padding(5) // Reduced padding
            .Border(1)
            .BorderColor(Colors.Grey.Lighten2)
            .Column(col =>
            {
                col.Item().Text("Progress Summary").SemiBold().FontSize(10);

                col.Item().PaddingVertical(2).Row(row =>
                {
                    row.RelativeItem().Text($"Current Attendance: {dto.PercentageOfAttendance:F1}%")
                        .FontSize(9).FontColor(Colors.Green.Darken2).SemiBold();
                });

                col.Item().Row(row =>
                {
                    row.RelativeItem().Text($"Potential Maximum: {dto.MaxPredictedPrecentageOfAttendance:F1}%")
                        .FontSize(9).FontColor(Colors.Blue.Darken2).SemiBold();
                });

                col.Item().Row(row =>
                {
                    var improvement = dto.MaxPredictedPrecentageOfAttendance - dto.PercentageOfAttendance;
                    row.RelativeItem().Text($"Potential Improvement: {improvement:F1}%")
                        .FontSize(9).FontColor(improvement > 0 ? Colors.Orange.Darken2 : Colors.Grey.Darken2);
                });
            });
    }

    private static void ComposeLessonDetails(IContainer container, GetStudentRecoredAttendanceDto dto)
    {
        container.Column(col =>
        {
            col.Item().Text("Lesson Attendance Details").Bold().FontSize(14).FontColor(Colors.Red.Darken2);
            col.Item().PaddingBottom(3).Text($"{dto.lessionAttendanceRecoreds?.Count ?? 0} lessons recorded")
                .FontSize(9).FontColor(Colors.Grey.Darken1);

            if (dto.lessionAttendanceRecoreds?.Any() == true)
            {
                // Use minimal table styling to avoid constraints
                col.Item().Table(table =>
                {
                    // Simplified column definitions
                    table.ColumnsDefinition(columns =>
                    {
                        columns.ConstantColumn(50);  // Lesson ID - Smaller
                        columns.RelativeColumn(2);   // Lesson Name
                        columns.ConstantColumn(70);  // Attend Type - Smaller
                        columns.ConstantColumn(80);  // Date - Smaller
                        columns.RelativeColumn(2);   // Note
                    });

                    // Table Header - Minimal styling
                    table.Header(header =>
                    {
                        header.Cell().Padding(3).Background(Colors.Grey.Darken3).Text("ID").Bold().FontSize(8).FontColor(Colors.White);
                        header.Cell().Padding(3).Background(Colors.Grey.Darken3).Text("Lesson Name").Bold().FontSize(8).FontColor(Colors.White);
                        header.Cell().Padding(3).Background(Colors.Grey.Darken3).Text("Status").Bold().FontSize(8).FontColor(Colors.White);
                        header.Cell().Padding(3).Background(Colors.Grey.Darken3).Text("Date").Bold().FontSize(8).FontColor(Colors.White);
                        header.Cell().Padding(3).Background(Colors.Grey.Darken3).Text("Notes").Bold().FontSize(8).FontColor(Colors.White);
                    });

                    // Table Rows - Minimal styling
                    int index = 0;
                    foreach (var lesson in dto.lessionAttendanceRecoreds)
                    {
                        var backgroundColor = index % 2 == 0 ? Colors.White : Colors.Grey.Lighten5;
                        var statusColor = GetStatusColor(lesson.AttendType);

                        table.Cell().Padding(3).Background(backgroundColor).Text(lesson.LessionId.ToString()).FontSize(8);
                        table.Cell().Padding(3).Background(backgroundColor).Text(lesson.LessionName).FontSize(8);
                        table.Cell().Padding(3).Background(backgroundColor).Text(GetAttendTypeDisplay(lesson.AttendType)).FontSize(8).FontColor(statusColor);
                        table.Cell().Padding(3).Background(backgroundColor).Text(lesson.TakenAt.ToString("MM/dd/yy\nHH:mm")).FontSize(7); // Smaller date format
                        table.Cell().Padding(3).Background(backgroundColor).Text(lesson.Note ?? "-").FontSize(8);

                        index++;
                    }
                });
            }
            else
            {
                col.Item().AlignCenter().Padding(10).Text("No lesson attendance records available")
                    .Italic().FontSize(10).FontColor(Colors.Grey.Medium);
            }
        });
    }

    private static void ComposeInfoCard(GridDescriptor grid, string title, string value, Color color)
    {
        grid.Item().Background(color).Padding(15).Border(1).Column(col => // Reduced padding
        {
            col.Item().Text(title).Bold().FontSize(8).FontColor(Colors.Grey.Darken3); // Smaller font
            col.Item().Padding(10).Text(value).SemiBold().FontSize(10); // Smaller font
        });
    }

    private static void ComposeStatCard(GridDescriptor grid, string title, string value, Color color)
    {
        grid.Item().Background(color).Padding(15).Border(1).Column(col => // Reduced padding
        {
            col.Item().Text(title).Bold().FontSize(8); // Smaller font
            col.Item().AlignCenter().Text(value).SemiBold().FontSize(12); // Smaller font
        });
    }

    private static Color GetPercentageColor(decimal percentage)
    {
        return percentage switch
        {
            >= 90 => Colors.Green.Darken1,
            >= 80 => Colors.Green.Lighten1,
            >= 70 => Colors.Orange.Lighten1,
            >= 60 => Colors.Orange.Darken1,
            _ => Colors.Red.Lighten1
        };
    }

    private static Color GetPredictedPercentageColor(decimal percentage)
    {
        return Colors.Blue.Darken1;
    }

    private static Color GetStatusColor(enAttendType? attendType)
    {
        return attendType?.ToString()?.ToLower() switch
        {
            "present" or "attended" => Colors.Green.Darken2,
            "absent" or "missed" => Colors.Red.Darken2,
            "late" => Colors.Orange.Darken2,
            "excused" => Colors.Purple.Darken2,
            _ => Colors.Grey.Darken1
        };
    }

    private static string GetAttendTypeDisplay(enAttendType? attendType)
    {
        if (attendType == null) return "Not Recorded";

        return attendType switch
        {
            enAttendType.Attend => "Present",
            enAttendType.Absent => "Absent",
            enAttendType.HalfDay => "Late",
            enAttendType.Sorry => "Excused",
            _ => attendType.ToString()?.Replace("_", " ") ?? "Unknown"
        };
    }
}