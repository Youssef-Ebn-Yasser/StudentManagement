namespace Backend.DTOs.ReportDTOS
{
    public class CourseRevenueReportDto
    {
        public int CourseId { get; set; }
        public string CourseName { get; set; }
        public decimal TotalRevenue { get; set; }
        public int PaymentsCount { get; set; }
    }
}
