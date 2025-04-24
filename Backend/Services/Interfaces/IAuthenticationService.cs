using Backend.DTOs.AuthDTOs;

namespace Backend.Services.Interfaces;

public interface IAuthenticationService
{
    Task<Response<TokenDto>> LoginAsync(LoginDto model);
    Task<Response<TokenDto>> RegisterStudentAsync(RegisterDto model);
    Task<Response<TokenDto>> RegisterTeacherAsync(RegisterDto model);
    Task<Response<TokenDto>> RegisterAdminAsync(RegisterDto model);
    Task<Response<TokenDto>> GetJWTToken(string userId);
    Task<Response<TokenDto>> GetRefreshToken(string refreshToken);
    Task<Response<string>> ConfirmEmailAsync(string userId, string token);
    Task<Response<string>> ForgotPasswordAsync(string email);
    Task<Response<string>> ResetPasswordAsync(string email, string token, string newPassword);
    

    Task<Response<UserDto>> GetUserByToken(string token);
}
