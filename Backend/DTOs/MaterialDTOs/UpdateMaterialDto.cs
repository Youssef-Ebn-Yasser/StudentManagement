using Microsoft.AspNetCore.Http;

namespace Backend.DTOs.MaterialDTOs;

public class UpdateMaterialDto
{
    public int Id { get; set; }
    public string? Title { get; set; }
    public string? Content { get; set; }
    public int LessonId { get; set; }
    public IFormFile? Data { get; set; }
    public MaterialTypeId? Type { get; set; }
    public string? Path { get; set; }
} 