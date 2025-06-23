using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace Backend.Controllers;

[Route("api/[controller]")]
[ApiController]
public class VideoSDKController : ControllerBase
{
    #region Fields
    private readonly IConfiguration _configuration;
    private readonly IStructuredLogger _logger;
    #endregion

    #region Constructor
    public VideoSDKController(IConfiguration configuration, IStructuredLogger logger)
    {
        _configuration = configuration;
        _logger = logger;
    }
    #endregion

    /// <summary>
    /// Endpoint for the frontend to securely request a VideoSDK authentication token.
    /// </summary>
    /// <returns>A JSON object containing the VideoSDK token.</returns>

    #region Method
    [HttpPost("generateVideoSDKToken")] // The specific route for this action
    public IActionResult GenerateVideoSDKToken()
    {
        try
        {
            // 1. Retrieve API Key and Secret Key securely from configuration
            string? videoSdkApiKey = _configuration["VideoSDK:ApiKey"];
            string? videoSdkSecretKey = _configuration["VideoSDK:SecretKey"];

            if (string.IsNullOrEmpty(videoSdkApiKey) || string.IsNullOrEmpty(videoSdkSecretKey))
            {
                return StatusCode(500, new { message = "VideoSDK API keys are not configured correctly on the backend." });
            }

            // 2. Define JWT claims (payload) as required by VideoSDK
            // These claims define the token's permissions and validity
            var claims = new[]
            {
                new Claim("apikey", videoSdkApiKey),
                // Permissions for the token: allow joining, creating rooms, streaming, recording
                new Claim("permissions", "allow_join,allow_create_room,allow_streaming,allow_recording"),
                new Claim("iat", DateTimeOffset.UtcNow.ToUnixTimeSeconds().ToString()), // Issued At (Unix timestamp)
                new Claim("exp", DateTimeOffset.UtcNow.AddMinutes(10000).ToUnixTimeSeconds().ToString()), // Expiration (Unix timestamp)
            };

            // 3. Create a JWT token handler
            var tokenHandler = new JwtSecurityTokenHandler();

            // 4. Create signing credentials using the Secret Key and HS256 algorithm
            var key = Encoding.UTF8.GetBytes(videoSdkSecretKey);
            var signingCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256);

            // 5. Create the JWT Security Token
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddMinutes(10000), // Standard JWT expiration (matches ttl)
                SigningCredentials = signingCredentials
            };

            // 6. Generate the token string
            var securityToken = tokenHandler.CreateToken(tokenDescriptor);
            string token = tokenHandler.WriteToken(securityToken);

            // 7. Return the generated token to the frontend
            return Ok(new { token = token });
        }
        catch (Exception ex)
        {
            // Log the error for debugging
            Console.WriteLine($"Error generating VideoSDK token: {ex.Message}");
            return StatusCode(StatusCodes.Status500InternalServerError, new { message = "Failed to generate VideoSDK token due to a server error." });
        }
    }
    #endregion
}