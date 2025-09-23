namespace Backend.Controllers;

[Route("api/[controller]")]
[ApiController]
public class TrackingController : AppControllerBase
{
    #region    Fields
    private readonly ITrackingService _trackingService;
    #endregion

    #region    Constructor
    public TrackingController(ITrackingService trackingService)
    {
        _trackingService = trackingService;
    }
    #endregion

    #region     Handle Mthods
    [HttpGet("UsersStatistics")]
    public async Task<IActionResult> GetUsersStatistics()
    {

        try
        {
            var result = await _trackingService.GetUserLoginStatistic();
            return NewResult(result);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpGet("AllUsersLoginLastDay")]
    public async Task<IActionResult> AllUsersLoginLastDay(int pageNumber, int pageSize, EnUsersType? usersType, EnLastDateType lastDateType)
    {

        try
        {
            var result = await _trackingService.AllUsersLoginLastPeriod(pageNumber, pageSize, usersType, lastDateType);
            return NewResult(result);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpGet("AllUsersLoginBetween")]
    public async Task<IActionResult> AllUsersLoginBetween(int pageNumber, int pageSize, EnUsersType? usersType, DateTime startDate, DateTime endDate)
    {

        try
        {
            var result = await _trackingService.AllUsersLoginBetween(pageNumber, pageSize, usersType, startDate, endDate);
            return NewResult(result);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpGet("GetLoginPerUser")]
    public async Task<IActionResult> GetLoginPerUser(int studentUser, DateTime? startDate, DateTime? endDate)
    {
        try
        {
            var result = await _trackingService.GetLogsPerUser(studentUser, startDate, endDate);
            return NewResult(result);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }
    #endregion
}