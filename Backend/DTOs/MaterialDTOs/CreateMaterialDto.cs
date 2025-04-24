namespace Backend.DTOs.MaterialDTOs;

public class CreateMaterialDto
{
    public string? Title { get; set; }
    public string? Content { get; set; }
    public int LessonId { get; set; }
    public IFormFile? Data { get; set; }
    public MaterialTypeId? Type { get; set; }
}