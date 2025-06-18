using Backend.DTOs.ReportDTOS;

namespace Backend.Services.Interfaces
{
    public interface IReportServices
    {
        Task<DashboardSummaryDto> GetSummaryAsync();
        Task<List<CourseEnrollmentReportDto>> GetCourseEnrollmentStatsAsync();
        Task<List<CourseRevenueReportDto>> GetCourseRevenuesAsync();
        Task<List<WeeklyStudentEnrollmentDto>> GetWeeklyNewStudentsAsync();
        Task<List<AverageAssignmentScoreDto>> GetAverageStudentScoresAsync();
    }
}
