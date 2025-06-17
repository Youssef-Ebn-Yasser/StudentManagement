namespace Backend.DTOs.ReportDTOS
{
    public class DashboardSummaryDto
    {
        public int TotalUsers { get; set; }
        public int TotalStudents { get; set; }
        public int TotalTeachers { get; set; }
        public int NewUsersLast7Days { get; set; }

        public int TotalCourses { get; set; }
        public decimal RevenueThisMonth { get; set; }
        public int TotalPayments { get; set; }
    }
}
