using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReportController : AppControllerBase
    {
        private readonly IReportServices _reportServices;

        public ReportController(IReportServices reportServices)
        {
            _reportServices = reportServices;
        }

        [HttpGet("course-revenues")]
        public async Task<IActionResult> GetCourseRevenues()
        {
            var report = await _reportServices.GetCourseRevenuesAsync();
            return Ok(report);
        }


        [HttpGet("summary")]
        public async Task<IActionResult> GetDashboardSummary()
        {
            var summary = await _reportServices.GetSummaryAsync();
            return Ok(summary);
        }

        [HttpGet("average-student-scores")]
        public async Task<IActionResult> GetAverageStudentScores()
        {
            var report = await _reportServices.GetAverageStudentScoresAsync();
            return Ok(report);
        }


        [HttpGet("course-enrollments")]
        public async Task<IActionResult> GetCourseEnrollments()
        {
            var report = await _reportServices.GetCourseEnrollmentStatsAsync();
            return Ok(report);
        }


        [HttpGet("weekly-new-students")]
        public async Task<IActionResult> GetWeeklyNewStudents()
        {
            var report = await _reportServices.GetWeeklyNewStudentsAsync();
            return Ok(report);
        }

        [HttpGet("student-comprehensive/{studentId}")]
        public async Task<IActionResult> GetStudentComprehensiveReport(int studentId)
        {
            try
            {
                var report = await _reportServices.GetStudentComprehensiveReportAsync(studentId);
                return Ok(report);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    StatusCode = 500,
                    Message = "Failed to generate student report",
                    Error = ex.Message
                });
            }
        }
    }
}
