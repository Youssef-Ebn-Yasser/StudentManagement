using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Entities;

public class RefreshToken
{
    [Key]
    public int Id { get; set; }
    
    public string Token { get; set; } = string.Empty;
    
    public DateTime ExpiryDate { get; set; }
    
    public bool IsUsed { get; set; }
    
    public bool IsRevoked { get; set; }
    
    public int UserId { get; set; }
    
    [ForeignKey(nameof(UserId))]
    public User User { get; set; }
    
    public DateTime CreatedAt { get; set; } = DateTime.Now;
}
