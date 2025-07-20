
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
                                          .Where(c => c.IsDeleted != false)
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
    #endregion
}