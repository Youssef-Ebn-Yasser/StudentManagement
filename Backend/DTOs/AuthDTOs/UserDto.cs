using System.Collections.Generic;

namespace Backend.DTOs.AuthDTOs;

public class UserDto
{
    public int Id { get; set; }
    public string? Name { get; set; } = string.Empty;
    public byte Age { get; set; } 
    public string? Email { get; set; } = string.Empty;
    public string? Phone { get; set; } = string.Empty;

    public string? ProfileImagePath { get; set; } = string.Empty;
    public DateTime? CreatedAt { get; set; } = DateTime.Now;
    public IList<string>? Roles { get; set; } = new List<string>();
}
