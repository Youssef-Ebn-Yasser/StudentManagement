namespace Backend.Controllers;

[Route("api/[controller]")]
[ApiController]
public class VoucherController : AppControllerBase
{
    #region   Fields
    private readonly IVoucherService _voucherService;
    #endregion

    #region   Methods
    public VoucherController(IVoucherService voucherService)
    {
        _voucherService = voucherService;
    }
    #endregion

    #region   Handle Methods
    [HttpGet("GetVoucherCreateDependencies")]
    public async Task<IActionResult> GetVoucherCreateDependencies(EnVoucherCourseType voucherCourseType)
    {
        try
        {
            var result = await _voucherService.GetCreateVoucherDependenciesDto(voucherCourseType);

            return NewResult(result);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }

    }
    [HttpPost]
    public async Task<IActionResult> CreateVoucher(CreateVaoucherDto dto)
    {
        try
        {
            var result = await _voucherService.CreateVoucher(dto);

            return NewResult(result);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }

    }
    #endregion
}