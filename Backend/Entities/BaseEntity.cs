namespace Backend.Entities;

public class BaseEntity
{
    [Key] public int Id { get; set; }
    public string TitleEn { get; set; } = string.Empty;
    public string TitleAr { get; set; } = string.Empty;
}