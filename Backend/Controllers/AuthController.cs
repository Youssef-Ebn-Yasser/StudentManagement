using Backend.DTOs.AuthDTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;

namespace Backend.Controllers;

[EnableCors("_cors")]
[Route("api/[controller]")]
[ApiController]
public class AuthController : AppControllerBase
{
    private readonly IAuthenticationService _authService;
    private readonly IAuthGoogleService _authGoogleService;

    public AuthController(IAuthenticationService authService, IAuthGoogleService authGoogleService)
    {
        _authService = authService;
        _authGoogleService = authGoogleService;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto model)
    {
        var result = await _authService.LoginAsync(model);
        return NewResult(result);
    }

    [HttpPost("Googlelogin")]
    public async Task<IActionResult> Googlelogin([FromBody] GoogleLoginDto googleLogin)
    {
        var result = await _authGoogleService.AuthenticationWithGoogle(googleLogin.IdToken);
        return NewResult(result);
    }

    [HttpPost("register/student")]
    public async Task<IActionResult> RegisterStudent([FromBody] RegisterDto model)
    {
        var result = await _authService.RegisterStudentAsync(model);
        return NewResult(result);
    }


    [Authorize(Roles = "Admin")]
    [HttpPost("register/teacher")]
    public async Task<IActionResult> RegisterTeacher([FromBody] RegisterDto model)
    {
        var result = await _authService.RegisterTeacherAsync(model);
        return NewResult(result);
    }


    [HttpPost("confirm-email")]
    public async Task<IActionResult> Verify([FromQuery] int userId, [FromQuery] string token)
    {
        var result = await _authService.ConfirmEmailAsync(userId, token);
        return NewResult(result);
    }


    [Authorize(Roles = "Admin")]
    [HttpPost("register/admin")]
    public async Task<IActionResult> RegisterAdmin([FromBody] RegisterDto model)
    {
        var result = await _authService.RegisterAdminAsync(model);
        return NewResult(result);
    }

    [HttpGet("GetUserByToken")]
    public async Task<IActionResult> GetUserByToken([FromHeader] string refreshToken)
    {

        if (string.IsNullOrEmpty(refreshToken))
        {
            return BadRequest("Refresh token is required.");
        }

        var result = await _authService.GetUserByToken(refreshToken);

        if (result == null)
        {
            return Unauthorized("Invalid refresh token.");
        }

        return NewResult(result);
    }



    [HttpGet("GetJWTToken")]

    public async Task<IActionResult> GetJWTToken([FromQuery] string userId)
    {
        var result = await _authService.GetJWTToken(userId);
        return NewResult(result);
    }

    [HttpGet("GetRefreshToken")]
    public async Task<IActionResult> GetRefreshToken([FromQuery] string refreshToken)
    {
        var result = await _authService.GetRefreshToken(refreshToken);
        return NewResult(result);
    }

    [HttpPost("forgot-password")]
    public async Task<IActionResult> ForgotPassword(string email)
    {
        var result = await _authService.ForgotPasswordAsync(email);
        return NewResult(result);
    }

    [HttpPost("reset-password")]
    public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDto model)
    {
        var result = await _authService.ResetPasswordAsync(model.Email, model.Token, model.NewPassword);
        return NewResult(result);
    }
}
