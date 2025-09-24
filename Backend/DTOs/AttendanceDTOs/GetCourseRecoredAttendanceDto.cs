namespace Backend.DTOs.AttendanceDTOs;

public class GetCourseRecoredAttendanceDto
{
    public GetCourseRecoredAttendanceDto()
    {
        StudentsAttendance = new List<GetStudentRecoredAttendanceDto?>();
        StudentsIds = new List<int>();
    }
    public int NumberOfStudents { get; set; }
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public string? CourseLevel { get; set; }
    public string? Description { get; set; }
    public double? Price { get; set; }
    public decimal TotalPercentageOfAttendance { get; set; }
    public List<GetStudentRecoredAttendanceDto?> StudentsAttendance { get; set; }
    public List<int> StudentsIds { get; set; }
}

public class GetStudentRecoredAttendanceDto
{
    public GetStudentRecoredAttendanceDto()
    {
        lessionAttendanceRecoreds = new List<LessionAttendanceRecored>();
    }
    public int NumberOfLession { get; set; }
    public string StudentName { get; set; } = string.Empty;
    public int StudentId { get; set; }

    public string CoursetName { get; set; } = string.Empty;
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
    public string LessionName { get; set; } = string.Empty;
    public enAttendType? AttendType { get; set; }
    public string? Note { get; set; }
    public DateTime TakenAt { get; set; }
}