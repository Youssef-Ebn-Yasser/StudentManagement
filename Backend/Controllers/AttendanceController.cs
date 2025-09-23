using Microsoft.AspNetCore.Authorization;

namespace Backend.Controllers;

[Route("api/[controller]")]
[Authorize(Roles = "Admin,Teacher")]
[ApiController]
public class AttendanceController : AppControllerBase
{
    #region   Fiels   
    private readonly IAttendanceSevice _attendanceSevice;
    private readonly IStructuredLogger _logger;
    #endregion

    #region   Constructor
    public AttendanceController(IAttendanceSevice attendanceSevice, IStructuredLogger logger)
    {
        _attendanceSevice = attendanceSevice;
        _logger = logger;
    }
    #endregion

    #region    Methods
    [HttpGet("filter")]
    public async Task<ActionResult> FilterPage()
    {
        try
        {
            var serve = await _attendanceSevice.FilterAttendance();
            return NewResult(serve);
        }
        catch
        {
            await _logger.LogInfo(new LogInfoData
            {


            });
            _logger.LogInfo("Error happen when mapping or by network in GetAll Teacher");
            return NewResult(ErrorHappen.ErrorInServer());
        }
    }

    [HttpGet("page")]
    public async Task<ActionResult> GetAttendancePage(int courseId, int lessionId)
    {
        try
        {
            var serve = await _attendanceSevice.GetAttendancePage(courseId, lessionId);
            return Ok(serve);
        }
        catch
        {
            _logger.LogInfo("Error happen when mapping or by network in GetAll Teacher");
            return NewResult(ErrorHappen.ErrorInServer());
        }
    }
    [HttpGet("studentAttendancePerCourse")]
    public async Task<ActionResult> GetStudentAttendancePerCourse(int studetnId, int courseId)
    {
        try
        {
            var serve = await _attendanceSevice.GetStudentAttendancePerCourse(studetnId, courseId);
            return Ok(serve);
        }
        catch
        {
            _logger.LogInfo("Error happen when mapping or by network in GetAll Teacher");
            return NewResult(ErrorHappen.ErrorInServer());
        }
    }
    [HttpGet("PerCourse")]
    public async Task<ActionResult> GetAttendancePerCourse(int courseId)
    {
        try
        {
            var serve = await _attendanceSevice.GetAttendancePerCourse(courseId);
            return Ok(serve);
        }
        catch
        {
            _logger.LogInfo("Error happen when mapping or by network in GetAll Teacher");
            return NewResult(ErrorHappen.ErrorInServer());
        }
    }
    [AllowAnonymous]
    [HttpGet("xl-attendance-perStudent")]
    public async Task<IActionResult> ExportAttendanceReport(int studentId, int courseId)
    {
        var fileBytes = await _attendanceSevice.GenerateAttendanceExcelReportAsync(studentId, courseId);

        return File(fileBytes,
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                    $"AttendanceReport_{studentId}.xlsx");
    }
    [AllowAnonymous]
    [HttpGet("xl--attendance-perCourse")]
    public async Task<IActionResult> ExportCourseAttendanceReport(int courseId)
    {
        var fileBytes = await _attendanceSevice.GenerateCourseAttendanceExcelReportAsync(courseId);

        return File(fileBytes,
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                    $"CourseAttendanceReport_{courseId}.xlsx");
    }

    [HttpPost("page")]
    public async Task<ActionResult> PostAttendancePage(AttendanceSubmition dto)
    {
        try
        {
            var serve = await _attendanceSevice.SubmitAttendancePage(dto);
            return NewResult(serve);
        }
        catch
        {
            _logger.LogInfo("Error happen when mapping or by network in GetAll Teacher");
            return NewResult(ErrorHappen.ErrorInServer());
        }
    }
    [AllowAnonymous]
    [HttpGet("student-attendance-pdf")]
    public async Task<IActionResult> GetStudentAttendancePdf(int studentId, int courseId)
    {
        // Normally you’d fetch dto from DB/service
        var dto = await _attendanceSevice.GetStudentAttendancePerCourse(studentId, courseId);

        var pdfBytes = AttendancePdfGenerator.Generate(dto.Data);

        return File(pdfBytes, "application/pdf", $"StudentAttendance_{studentId}.pdf");
    }

    [AllowAnonymous]
    [HttpGet("course-attendance-pdf")]
    public async Task<IActionResult> GetStudentAttendancePdf(int courseId)
    {
        // Normally you’d fetch dto from DB/service
        var dto = await _attendanceSevice.GetAttendancePerCourse(courseId);

        var pdfBytes = AttendancePdfGeneratorPerCourse.Generate(dto.Data);

        return File(pdfBytes, "application/pdf", $"StudentAttendance_{courseId}.pdf");
    }



    #endregion
}