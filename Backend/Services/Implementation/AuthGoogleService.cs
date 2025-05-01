using Backend.DTOs.AuthDTOs;
using Google.Apis.Auth;

namespace Backend.Services.Implementation;

public class AuthGoogleService : ResponseHandler, IAuthGoogleService
{
    #region   Fields
    private readonly UserManager<User> _userManager;
    private readonly IAuthenticationService _authenticationService;
    private readonly IConfiguration _configuration;
    private readonly string _googleClientID;
    #endregion

    #region   Constructor
    public AuthGoogleService(UserManager<User> userManager,
                             IAuthenticationService authenticationService,
                             IConfiguration configuration)
    {
        _userManager = userManager;
        _authenticationService = authenticationService;
        _configuration = configuration;
        _googleClientID = _configuration["Authorization:google:clientId"] ??
                    throw new ArgumentNullException("no config for google");
    }
    #endregion

    #region   Handle Methods
    public async Task<Response<TokenDto>> AuthenticationWithGoogle(string idToken)
    {
        try
        {
            var payload = await ValidateGoogleTokenAsync(idToken);
            var user = await _userManager.Users
                                             .FirstOrDefaultAsync(user => user.Email == payload.Email);

            if (user == null || user.Id == null) return BadRequest<TokenDto>("this user not register yest");


            var result = await _authenticationService.GetJWTToken(user.Id.ToString());
            return result;
        }
        catch (Exception e)
        {
            return BadRequest<TokenDto>("Google Authentication Faild");

        }
    }

    public async Task<GoogleJsonWebSignature.Payload> ValidateGoogleTokenAsync(string idToken)
    {
        var setting = new GoogleJsonWebSignature.ValidationSettings()
        {
            Audience = new[] { _googleClientID }
        };

        var payload = await GoogleJsonWebSignature.ValidateAsync(idToken, setting);

        if (payload is null || string.IsNullOrEmpty(payload.Email))
            throw new UnauthorizedAccessException("have no authorized access");
        return payload;
    }
    #endregion
}