namespace Backend.DTOs.AuthorizeDTO;

public class ManageUserClaimsDto
{
    public int UserId { get; set; }
    public List<UserClaims>? userClaims { get; set; }
}
public class UserClaims
{
    public string Type { get; set; } = string.Empty;
    public bool Value { get; set; }
}