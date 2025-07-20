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
    #endregion
}