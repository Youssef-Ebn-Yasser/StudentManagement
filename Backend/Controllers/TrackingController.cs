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
    #endregion
}