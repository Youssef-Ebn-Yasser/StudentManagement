using Backend.DTOs.AuthDTOs;

namespace Backend.Controllers;

[Route("api/[controller]")]
[ApiController]
public class AuthController : AppControllerBase
{
    private readonly IAuthenticationService _authService;

    public AuthController(IAuthenticationService authService)
    {
        _authService = authService;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto model)
    {
        var result = await _authService.LoginAsync(model);
        return NewResult(result);
    }

    [HttpPost("register/student")]
    public async Task<IActionResult> RegisterStudent([FromBody] RegisterDto model)
    {
        var result = await _authService.RegisterStudentAsync(model);
        return NewResult(result);
    }

    [HttpPost("register/teacher")]
    public async Task<IActionResult> RegisterTeacher([FromBody] RegisterDto model)
    {
        var result = await _authService.RegisterTeacherAsync(model);
        return NewResult(result);
    }

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
}

