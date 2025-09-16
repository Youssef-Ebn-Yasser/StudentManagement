namespace Backend.DTOs.AuthDTOs;

public class TokenDto
{
    public string Token { get; set; } = string.Empty;
    public string RefreshToken { get; set; } = string.Empty;
    public int UserId { get; set; }
    public DateTime Expiration { get; set; }
    public string Type { get; set; }
}