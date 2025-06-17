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
    }
}
