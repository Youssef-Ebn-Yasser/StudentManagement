using Backend.DTOs.ReportDTOS;

namespace Backend.Services.Implementation
{
    public class ReportServices : IReportServices
    {
        private readonly ApplicationDbContext _context;

        public ReportServices(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<AverageAssignmentScoreDto>> GetAverageStudentScoresAsync()
        {
            var data = await _context.StudentAssignments
                                     .GroupBy(s => new { s.StudentId,s.Name})
                                     .Select(g => new AverageAssignmentScoreDto
                                     {
                                         StudentId = g.Key.StudentId,
                                         StudentName = $"{g.Key.Name}",
                                         AverageScore = g.Average(x => x.DegreePercentage)
                                     })
        .ToListAsync();

            return data;
        }

        public async Task<List<CourseEnrollmentReportDto>> GetCourseEnrollmentStatsAsync()
        {
            var report = await _context.Courses
                       .Select(c => new CourseEnrollmentReportDto
        {
            CourseId = c.Id,
            CourseName = c.Title,
            StudentsCount = c.StudentCourses.Count(sc => !sc.IsDeleted)
        })
        .ToListAsync();

            return report;
        }

        public async Task<List<CourseRevenueReportDto>> GetCourseRevenuesAsync()
        {
            var data = await _context.Payments
          .Where(p => p.Status == "Paid") // عدل حسب حالتك
          .GroupBy(p => new { p.CourseId, p.Course.Title })
          .Select(g => new CourseRevenueReportDto
          {
              CourseId = g.Key.CourseId ?? 0,
              CourseName = g.Key.Title,
              TotalRevenue = g.Sum(x => (decimal)x.Amount),
              PaymentsCount = g.Count()
          })
          .ToListAsync();

            return data;
        }

        public async Task<DashboardSummaryDto> GetSummaryAsync()
        {
            var now = DateTime.Now;
            var last7Days = now.AddDays(-7);
            var firstDayOfMonth = new DateTime(now.Year, now.Month, 1);

            var totalUsers = await _context.Users.CountAsync();
            var totalStudents = await _context.Students.CountAsync();
            var totalTeachers = await _context.Teachers.CountAsync();
            var newUsersLast7Days = await _context.Users.CountAsync(u => u.CreatedAt >= last7Days);

            var totalCourses = await _context.Courses.CountAsync();
            var totalPayments = await _context.Payments.CountAsync();

            var revenueThisMonth = await _context.Payments
                .Where(p => p.PaymentDate >= firstDayOfMonth && p.Status == "Success")
                .SumAsync(p => (decimal?)p.Amount) ?? 0;

            return new DashboardSummaryDto
            {
                TotalUsers = totalUsers,
                TotalStudents = totalStudents,
                TotalTeachers = totalTeachers,
                NewUsersLast7Days = newUsersLast7Days,
                TotalCourses = totalCourses,
                TotalPayments = totalPayments,
                RevenueThisMonth = revenueThisMonth
            };
        }

        public async Task<List<WeeklyStudentEnrollmentDto>> GetWeeklyNewStudentsAsync()
        {
            var startDate = DateTime.Today.AddDays(-28);

            var students = await _context.Users
                .Where(u => u is Student && u.CreatedAt >= startDate)
                .ToListAsync();

            var grouped = students
                .GroupBy(u =>
                {
                    var weekStart = u.CreatedAt.Date.AddDays(-(int)u.CreatedAt.DayOfWeek);
                    return weekStart;
                })
                .OrderBy(g => g.Key)
                .Select(g => new WeeklyStudentEnrollmentDto
                {
                    Week = $"{g.Key:dd MMM} - {g.Key.AddDays(6):dd MMM}",
                    StudentCount = g.Count()
                })
                .ToList();

            return grouped;
        }
    }
}
