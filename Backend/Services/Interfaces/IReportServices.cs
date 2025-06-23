using Backend.DTOs.ReportDTOS;

namespace Backend.Services.Interfaces
{
    public interface IReportServices
    {
        Task<DashboardSummaryDto> GetSummaryAsync();
        Task<List<CourseEnrollmentReportDto>> GetCourseEnrollmentStatsAsync(bool isArabic = false);
        Task<List<CourseRevenueReportDto>> GetCourseRevenuesAsync(bool isArabic = false);
        Task<List<WeeklyStudentEnrollmentDto>> GetWeeklyNewStudentsAsync();
        Task<List<AverageAssignmentScoreDto>> GetAverageStudentScoresAsync();
        Task<StudentComprehensiveReportDto> GetStudentComprehensiveReportAsync(int studentId);
    }
}
