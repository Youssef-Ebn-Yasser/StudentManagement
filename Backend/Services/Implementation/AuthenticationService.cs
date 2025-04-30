using Backend.BaseResponse;
using Backend.Constraints;
using Backend.DTOs.AuthDTOs;
using Backend.Entities;
using Backend.Services.Interfaces;
using Backend.Settings;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace Backend.Services.Implementation;

public class AuthenticationService : IAuthenticationService
{
    private readonly UserManager<User> _userManager;
    private readonly RoleManager<IdentityRole<int>> _roleManager;
    private readonly JwtSettings _jwtSettings;
    private readonly ILogger<AuthenticationService> _logger;
    private readonly Context.ApplicationDbContext _context;
    private readonly IEmailSender _emailSender;
    private readonly string _baseUrl;
    private readonly ResponseHandler _responseHandler;

    public AuthenticationService(
        UserManager<User> userManager,
        RoleManager<IdentityRole<int>> roleManager,
        IOptions<JwtSettings> jwtSettings,
        ILogger<AuthenticationService> logger,
        Context.ApplicationDbContext context,
        IEmailSender emailSender,
        IConfiguration configuration,
        ResponseHandler responseHandler)
    {
        _userManager = userManager;
        _roleManager = roleManager;
        _jwtSettings = jwtSettings.Value;
        _logger = logger;
        _context = context;
        _emailSender = emailSender;
        _baseUrl = configuration["ApplicationSettings:BaseUrl"] ?? "https://localhost:7099";
        _responseHandler = responseHandler;
    }

    public async Task<Response<TokenDto>> LoginAsync(LoginDto model)
    {
        var user = await _userManager.FindByEmailAsync(model.Email);

        if (user == null)
        {
            return _responseHandler.BadRequest<TokenDto>("Invalid credentials");
        }

        var isPasswordValid = await _userManager.CheckPasswordAsync(user, model.Password);

        if (!isPasswordValid)
        {
            return _responseHandler.BadRequest<TokenDto>("Invalid credentials");
        }

        // Check if email is confirmed
        if (!await _userManager.IsEmailConfirmedAsync(user))
        {
            return _responseHandler.BadRequest<TokenDto>("Email not confirmed");
        }

        var jwtToken = await GenerateJwtToken(user);
        var refreshToken = await GenerateRefreshToken(user);

        jwtToken.RefreshToken = refreshToken.Token;

        return _responseHandler.Success(jwtToken);
    }

    public async Task<Response<TokenDto>> GetJWTToken(string userId)
    {
        var user = await _userManager.FindByIdAsync(userId);

        if (user == null)
        {
            return _responseHandler.BadRequest<TokenDto>("User not found");
        }

        var jwtToken = await GenerateJwtToken(user);

        return _responseHandler.Success(jwtToken);
    }

    public async Task<Response<TokenDto>> GetRefreshToken(string refreshToken)
    {
        var storedToken = _context.RefreshTokens.FirstOrDefault(x => x.Token == refreshToken);

        if (storedToken == null)
        {
            return _responseHandler.BadRequest<TokenDto>("Invalid refresh token");
        }

        // Check if token is used or revoked
        if (storedToken.IsUsed || storedToken.IsRevoked)
        {
            return _responseHandler.BadRequest<TokenDto>("Token has been used or revoked");
        }

        // Check if token is expired
        if (storedToken.ExpiryDate < DateTime.Now)
        {
            return _responseHandler.BadRequest<TokenDto>("Token has expired");
        }

        // Mark token as used
        storedToken.IsUsed = true;
        _context.RefreshTokens.Update(storedToken);
        await _context.SaveChangesAsync();

        // Get user and generate new tokens
        var user = await _userManager.FindByIdAsync(storedToken.UserId.ToString());
        
        if (user == null)
        {
            return _responseHandler.BadRequest<TokenDto>("User not found");
        }
        
        var jwtToken = await GenerateJwtToken(user);
        var newRefreshToken = await GenerateRefreshToken(user);

        jwtToken.RefreshToken = newRefreshToken.Token;

        return _responseHandler.Success(jwtToken);
    }

    public async Task<Response<TokenDto>> RegisterStudentAsync(RegisterDto model)
    {
        return await RegisterUserAsync(model, "Student");
    }

    public async Task<Response<TokenDto>> RegisterTeacherAsync(RegisterDto model)
    {
        return await RegisterUserAsync(model, "Teacher");
    }

    public async Task<Response<TokenDto>> RegisterAdminAsync(RegisterDto model)
    {
        return await RegisterUserAsync(model, "Admin");
    }

    private async Task<Response<TokenDto>> RegisterUserAsync(RegisterDto model, string role)
    {
        var userExists = await _userManager.FindByEmailAsync(model.Email);

        if (userExists != null)
        {
            return _responseHandler.BadRequest<TokenDto>("User already exists");
        }

        var user = new User
        {
            Email = model.Email,
            UserName = model.Email,
            SecurityStamp = Guid.NewGuid().ToString(),
            Name = model.Name
        };

        var result = await _userManager.CreateAsync(user, model.Password);

        if (!result.Succeeded)
        {
            var errors = result.Errors.Select(e => e.Description).ToList();
            return _responseHandler.BadRequest<TokenDto>(string.Join(", ", errors));
        }

        // Ensure role exists (If we added it Manually, Remove this)
        if (!await _roleManager.RoleExistsAsync(role))
        {
            await _roleManager.CreateAsync(new IdentityRole<int>(role));
        }

        // Add user to role
        await _userManager.AddToRoleAsync(user, role);

        // Generate email confirmation token and send email
        var confirmationToken = await _userManager.GenerateEmailConfirmationTokenAsync(user);
        var encodedToken = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(confirmationToken));

        var callbackUrl = $"{_baseUrl}/confirm-email?userId={user.Id}&token={encodedToken}";

        if (user.Email != null)
        {
            await _emailSender.SendEmailAsync(
                user.Email,
                "Confirm your email",
                $"Please confirm your account by <a href='{callbackUrl}'>clicking here</a>.");
        }

        // Generate token
        var token = await GenerateJwtToken(user);
        var refreshToken = await GenerateRefreshToken(user);
        token.RefreshToken = refreshToken.Token;

        return _responseHandler.Success(token);
    }

    public async Task<Response<string>> ConfirmEmailAsync(string userId, string token)
    {
        var user = await _userManager.FindByIdAsync(userId);
        if (user == null)
        {
            return _responseHandler.BadRequest<string>("User not found");
        }

        var decodedToken = Encoding.UTF8.GetString(WebEncoders.Base64UrlDecode(token));
        var result = await _userManager.ConfirmEmailAsync(user, decodedToken);

        if (!result.Succeeded)
        {
            return _responseHandler.BadRequest<string>("Email confirmation failed");
        }

        return _responseHandler.Success("Email confirmed successfully");
    }

    public async Task<Response<string>> ForgotPasswordAsync(string email)
    {
        var user = await _userManager.FindByEmailAsync(email);
        if (user == null || !(await _userManager.IsEmailConfirmedAsync(user)) || user.Email == null)
        {
            return _responseHandler.Success("Password reset link has been sent if the email exists");
        }

        var token = await _userManager.GeneratePasswordResetTokenAsync(user);
        var encodedToken = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(token));

        var callbackUrl = $"{_baseUrl}/reset-password?email={user.Email}&token={encodedToken}";

        await _emailSender.SendEmailAsync(
            user.Email,
            "Reset Password",
            $"Please reset your password by <a href='{callbackUrl}'>clicking here</a>.");

        return _responseHandler.Success("Password reset link has been sent");
    }

    public async Task<Response<string>> ResetPasswordAsync(string email, string token, string newPassword)
    {
        var user = await _userManager.FindByEmailAsync(email);
        if (user == null)
        {
            return _responseHandler.BadRequest<string>("User not found");
        }

        var decodedToken = Encoding.UTF8.GetString(WebEncoders.Base64UrlDecode(token));
        var result = await _userManager.ResetPasswordAsync(user, decodedToken, newPassword);

        if (!result.Succeeded)
        {
            var errors = result.Errors.Select(e => e.Description).ToList();
            return _responseHandler.BadRequest<string>(string.Join(", ", errors));
        }

        return _responseHandler.Success("Password has been reset successfully");
    }

    private async Task<TokenDto> GenerateJwtToken(User user)
    {
        var userRoles = await _userManager.GetRolesAsync(user);

        var authClaims = new List<Claim>
        {
            new Claim(ClaimTypes.Name, user.UserName ?? string.Empty),
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            new Claim(JwtRegisteredClaimNames.Sub, user.Email ?? string.Empty),
            new Claim(JwtRegisteredClaimNames.Email, user.Email ?? string.Empty)
        };

        foreach (var userRole in userRoles)
        {
            authClaims.Add(new Claim(ClaimTypes.Role, userRole));
        }

        var authSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtSettings.Key));

        var token = new JwtSecurityToken(
            issuer: _jwtSettings.Issuer,
            audience: _jwtSettings.Audience,
            expires: DateTime.Now.AddMinutes(_jwtSettings.DurationInMinutes),
            claims: authClaims,
            signingCredentials: new SigningCredentials(authSigningKey, SecurityAlgorithms.HmacSha256)
        );

        return new TokenDto
        {
            Token = new JwtSecurityTokenHandler().WriteToken(token),
            Expiration = token.ValidTo
        };
    }

    private async Task<RefreshToken> GenerateRefreshToken(User user)
    {
        // Generate random token
        var randomNumber = new byte[32];
        using var rng = RandomNumberGenerator.Create();
        rng.GetBytes(randomNumber);
        var refreshToken = Convert.ToBase64String(randomNumber);

        // Create refresh token entity
        var refreshTokenEntity = new RefreshToken
        {
            Token = refreshToken,
            UserId = user.Id,
            ExpiryDate = DateTime.Now.AddDays(7), // Refresh token valid for 7 days
            IsUsed = false,
            IsRevoked = false,
            CreatedAt = DateTime.Now
        };

        // Save to database
        await _context.RefreshTokens.AddAsync(refreshTokenEntity);
        await _context.SaveChangesAsync();

        return refreshTokenEntity;
    }

    public async Task<Response<UserDto>> GetUserByToken(string refreshToken)
    {
        var storedToken = _context.RefreshTokens.FirstOrDefault(x => x.Token == refreshToken);
        if (storedToken == null)
        {
            return _responseHandler.BadRequest<UserDto>("Invalid refresh token");
        }
        
        // Check if token is used or revoked
        if (storedToken.IsUsed || storedToken.IsRevoked)
        {
            return _responseHandler.BadRequest<UserDto>("Token has been used or revoked");
        }
        // Check if token is expired
        if (storedToken.ExpiryDate < DateTime.Now)
        {
            return _responseHandler.BadRequest<UserDto>("Token has expired");
        }

        var user = await _userManager.FindByIdAsync(storedToken.UserId.ToString());

        if (user == null)
        {
            return _responseHandler.BadRequest<UserDto>("User not found");
        }

        var userDto = new UserDto
        {
            Id = user.Id,
            Name = user.Name,
            Email = user.Email,
            Phone = user.PhoneNumber,
            CreatedAt = user.CreatedAt,
            // ProfileImagePath = user.ProfileImagePath,
            Roles = await _userManager.GetRolesAsync(user)
        };

        return _responseHandler.Success(userDto);
    }
}
