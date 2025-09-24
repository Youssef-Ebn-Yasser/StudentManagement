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
                                                        .Where(s => s.StudentCourses!.Any(sc => sc.CourseId == courseId))
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
                                              showLessionInfos = c.lessons!.Select(l => new showLessionInfo
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
                                                    StudentsIds = c.StudentCourses!.Select(sc => sc.StudentId).ToList(),
                                                }).FirstOrDefaultAsync();

        if (attPerCourse == null)
        {
            return BadRequest<GetCourseRecoredAttendanceDto>("no data exist");
        }

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

    public async Task<byte[]?> GenerateAttendanceExcelReportAsync(int studentId, int courseId)
    {
        var response = await GetStudentAttendancePerCourse(studentId, courseId);
        if (response.Data != null)
        {
            var result = GenerateAttendanceExcelReportAsync(response.Data);
            return result;

        }
        else
        {
            return null;
        }
    }
    public async Task<byte[]?> GenerateCourseAttendanceExcelReportAsync(int courseId)
    {
        var response = await GetAttendancePerCourse(courseId);
        if (response.Data != null)
        {
            var result = GenerateCourseAttendanceExcelReportAsync(response.Data);

            return result;
        }
        else
        {
            return null;
        }
    }
    private byte[] GenerateAttendanceExcelReportAsync(GetStudentRecoredAttendanceDto dto)
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
    private byte[] GenerateCourseAttendanceExcelReportAsync(GetCourseRecoredAttendanceDto dto)
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
        byte[] result = stream.ToArray();
        return result;
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
    #endregion
}