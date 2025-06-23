using Backend.DTOs.AdminDTOs;
using Backend.DTOs.AuthorizeDTO;

namespace Backend.Controllers;

[Route("api/[controller]")]
[ApiController]
public class AuthorizeController : AppControllerBase
{
    #region    Fields
    private readonly IAuthorizeService _authorizeService;
    #endregion

    #region     Constructor
    public AuthorizeController(IAuthorizeService authorizeService)
    {
        _authorizeService = authorizeService;
    }
    #endregion

    #region    Methods
    [HttpGet("")]
    public async Task<IActionResult> ManageUserClaims(int userId)
    {
        var response = await _authorizeService.ManageUserClaimData(userId);
        return NewResult(response);
    }

    [HttpPut("")]
    public async Task<IActionResult> UpdateUserClaims(EditUserClaimsDto model)
    {
        var response = await _authorizeService.UpdateUserClaims(model);
        return NewResult(response);
    }

    [HttpGet("admins")]
    public async Task<IActionResult> GetAllAdmins()
    {
        var response = await _authorizeService.GetAllAdminsAsync();
        return NewResult(response);
    }

    [HttpPut("admin")]
    public async Task<IActionResult> UpdateAdmin([FromBody] UpdateAdminDto dto)
    {
        var response = await _authorizeService.UpdateAdminAsync(dto);
        return NewResult(response);
    }
    #endregion
}