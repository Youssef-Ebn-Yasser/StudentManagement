using Backend.DTOs.AuthDTOs;
using Microsoft.AspNetCore.WebUtilities;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Cryptography;
namespace Backend.Services.Implementation;

public class AuthenticationService : IAuthenticationService
{
    #region Fields
    private readonly UserManager<User> _userManager;
    private readonly RoleManager<IdentityRole<int>> _roleManager;
    private readonly JwtSettings _jwtSettings;
    private readonly ILogger<AuthenticationService> _logger;
    private readonly Context.ApplicationDbContext _context;
    private readonly IEmailSender _emailSender;
    private readonly string _baseUrl;
    private readonly ResponseHandler _responseHandler;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IStructuredLogger _Logger;
    #endregion

    #region Constructor
    public AuthenticationService(
        UserManager<User> userManager,
        RoleManager<IdentityRole<int>> roleManager,
        IOptions<JwtSettings> jwtSettings,
        ILogger<AuthenticationService> logger,
        Context.ApplicationDbContext context,
        IEmailSender emailSender,
        IConfiguration configuration,
        ResponseHandler responseHandler,
        IUnitOfWork unitOfWork,
        IStructuredLogger Logger)
    {
        _userManager = userManager;
        _roleManager = roleManager;
        _jwtSettings = jwtSettings.Value;
        _logger = logger;
        _context = context;
        _emailSender = emailSender;
        _baseUrl = configuration["ApplicationSettings:BaseUrl"] ?? "https://localhost:5175";
        _responseHandler = responseHandler;
        _unitOfWork = unitOfWork;
        _Logger = Logger;
    }
    #endregion

    #region Method
    public async Task<Response<TokenDto>> LoginAsync(LoginDto model)
    {
        // var user = await _userManager.FindByEmailAsync(model.Email);
        var user = await _unitOfWork.Repository<User>().GetTableNoTracking().FirstOrDefaultAsync(u => u.Email == model.Email && u.IsDeleted == false);
        if (user == null)
        {
            await _Logger.LogInfo($"this email {model.Email} and pasword {model.Password}", model.Email, "Login", EnLevel.Error, EnLogType.Logs);

            return _responseHandler.BadRequest<TokenDto>("Invalid credentials this student not exist");
        }

        var isPasswordValid = await _userManager.CheckPasswordAsync(user, model.Password);

        if (!isPasswordValid)
        {
            return _responseHandler.BadRequest<TokenDto>("Invalid credentials");
        }

        // Check if email is confirmed
        //if (!await _userManager.IsEmailConfirmedAsync(user))
        //{
        //    return _responseHandler.BadRequest<TokenDto>("Email not confirmed");
        //}

        var jwtToken = await GenerateJwtToken(user);
        var refreshToken = await GenerateRefreshToken(user);

        jwtToken.RefreshToken = refreshToken.Token;
        jwtToken.UserId = user.Id;

        await _Logger.LogInfo($"this email {model.Email} and pasword {model.Password}", "Login", model.Email, EnLevel.Information, EnLogType.Logs);

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
        var result = await RegisterUserAsync(model, "Teacher");
        bool response = false;
        // send email to teacher he can login now 
        if (result.Succeeded)
        {
            string mailTo = model.Email;
            string subject = "Congratulation you added";
            string message = $"welcome in our sit you can now login to your account update your data or upload courses with email := {model.Email} and password := {model.Password} keep your password secret";

            response = await _emailSender.SendEmailAsync(mailTo, subject, message);
        }

        if (result.Succeeded && !response)
        {
            result.Succeeded = false;
            result.Massage = "can not send email but user added";
        }

        return result;
    }

    public async Task<Response<TokenDto>> RegisterAdminAsync(RegisterDto model)
    {
        return await RegisterUserAsync(model, "Admin");
    }

    private async Task<Response<TokenDto>> RegisterUserAsync(RegisterDto model, string role)
    {
        //var userExists = await _userManager.FindByEmailAsync(model.Email);

        var userExists = await _unitOfWork.Repository<User>().GetTableNoTracking().FirstOrDefaultAsync(u => u.Email == model.Email);
        if (userExists != null && userExists.UserType == role)
        {
            return _responseHandler.BadRequest<TokenDto>("User already exists");
        }

        var user = UserCreate.CreateUser(
            Enum.Parse<UserType>(role, true),
            model);

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
        // await _userManager.ConfirmEmailAsync(user, confirmationToken);

        var encodedToken = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(confirmationToken));

        var callbackUrl = $"{_baseUrl}/Auth/confirm-email?userId={user.Id}&token={encodedToken}";
        Console.WriteLine(callbackUrl);
        if (user.Email != null)
        {
            await _emailSender.SendEmailAsync(
                user.Email,
                "Confirm your email",
                $"Please confirm your account by <a href='{callbackUrl}'>clicking here</a>.");
        }

        // Generate token
        // var token = await GenerateJwtToken(user);
        // var refreshToken = await GenerateRefreshToken(user);
        // token.RefreshToken = refreshToken.Token;


        var token = new TokenDto();

        token.Token = encodedToken;
        var refreshToken = await GenerateRefreshToken(user);
        token.RefreshToken = refreshToken.Token;
        token.UserId = user.Id;

        return _responseHandler.Success(token);
    }

    public async Task<Response<string>> ConfirmEmailAsync(int userId, string token)
    {
        var user = await _userManager.FindByIdAsync(userId.ToString());
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
        //if (user == null || !(await _userManager.IsEmailConfirmedAsync(user)) || user.Email == null)
        //{
        //    return _responseHandler.Success("Password reset link has been sent if the email exists");
        //}

        var token = await _userManager.GeneratePasswordResetTokenAsync(user);
        var encodedToken = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(token));

        var callbackUrl = $"{_baseUrl}/reset-password?email={user.Email}&token={encodedToken}";
        _logger.LogInformation($"[ForgotPassword] Reset URL: {callbackUrl}");

        await _emailSender.SendEmailAsync(
            user.Email,
            "Reset Password",
            $"Please reset your password by <a href='{callbackUrl}'>clicking here</a>.");

        return _responseHandler.Success("Password reset link has been sent");
    }
    public class ApplicationSettings
    {
        public string BaseUrl { get; set; }
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


    private async Task<List<Claim>> GetClaims(User user)
    {
        var roles = await _userManager.GetRolesAsync(user);
        var claims = new List<Claim>()
        {
            new Claim(ClaimTypes.Name,user.UserName!),
            new Claim(ClaimTypes.NameIdentifier,user.UserName!),
            new Claim(ClaimTypes.Email,user.Email!),
        };
        foreach (var role in roles)
        {
            claims.Add(new Claim(ClaimTypes.Role, role));
        }
        var userClaims = await _userManager.GetClaimsAsync(user);
        claims.AddRange(userClaims);
        return claims;
    }
    private async Task<TokenDto> GenerateJwtToken(User user)
    {
        var claims = await GetClaims(user);

        var authSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtSettings.Key));

        var token = new JwtSecurityToken(
            issuer: _jwtSettings.Issuer,
            audience: _jwtSettings.Audience,
            expires: DateTime.Now.AddMinutes(_jwtSettings.DurationInMinutes),
            claims: claims,
            signingCredentials: new SigningCredentials(authSigningKey, SecurityAlgorithms.HmacSha256)
        );

        var refreshToken = await GenerateRefreshToken(user);
        return new TokenDto
        {
            Token = new JwtSecurityTokenHandler().WriteToken(token),
            Expiration = token.ValidTo,
            RefreshToken = refreshToken.Token,
            Type = user.UserType,
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
            CreatedAt = DateTime.Now,
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
            Name = GeneralLocalizableEntity.Localized(user.NameAr, user.NameEn),
            Email = user.Email,
            Phone = user.PhoneNumber,
            CreatedAt = user.CreatedAt,
            // ProfileImagePath = user.ProfileImagePath,
            Roles = await _userManager.GetRolesAsync(user)
        };

        return _responseHandler.Success(userDto);
    }
    #endregion
}