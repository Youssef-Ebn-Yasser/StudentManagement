namespace Backend.DTOs.MaterialDTOs;

public class CreateMaterialDto
{
    [Required]
    public string Title { get; set; } = string.Empty;
    [Required]
    public string Content { get; set; } = string.Empty;
    [Required]
    public int LessonId { get; set; }
    public IFormFile Data { get; set; }
    public MaterialTypeId? Type { get; set; }
}