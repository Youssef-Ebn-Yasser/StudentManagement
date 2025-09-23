namespace Backend.Controllers;

[Route("api/[controller]")]
[ApiController]
public class BrochuresController : AppControllerBase
{
    #region    Fields
    private readonly IBrochuresService _brochuresService;
    #endregion

    #region    Constructor
    public BrochuresController(IBrochuresService brochuresService)
    {
        _brochuresService = brochuresService;
    }
    #endregion

    #region    Handle Methods
    [HttpGet("all")]
    public async Task<IActionResult> GetAllBrouchures()
    {
        try
        {
            var result = await _brochuresService.GetAllCourseBrouchers();
            return NewResult(result);
        }
        catch (Exception ex)
        {
            return BadRequest(ex);
        }
    }
    [HttpGet("getByCourseId")]
    public async Task<IActionResult> GetBrouchureById(int courseId)
    {
        try
        {
            var result = await _brochuresService.GetAllCourseBrouchers(courseId);
            return NewResult(result);
        }
        catch (Exception ex)
        {
            return BadRequest(ex);
        }
    }

    [HttpPost()]
    public async Task<IActionResult> CreateBrouchures(CreateCourseBrochuresDto dto)
    {
        try
        {
            var result = await _brochuresService.CreateCourseBrouchers(dto);
            return NewResult(result);
        }
        catch (Exception ex)
        {
            return BadRequest(ex);
        }
    }

    [HttpPut()]
    public async Task<IActionResult> EditBrouchure(UpdateCourseBrochuresDto dto)
    {
        try
        {
            var result = await _brochuresService.UpdateCourseBrouchers(dto);
            return NewResult(result);
        }
        catch (Exception ex)
        {
            return BadRequest(ex);
        }
    }
    [HttpDelete()]
    public async Task<IActionResult> DeleteBrouchure(int id)
    {
        try
        {
            var result = await _brochuresService.DeleteCourseBrouchers(id);
            return NewResult(result);
        }
        catch (Exception ex)
        {
            return BadRequest(ex);
        }
    }

    #endregion
}