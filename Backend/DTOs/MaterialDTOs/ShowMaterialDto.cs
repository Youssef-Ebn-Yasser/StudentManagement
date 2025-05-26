namespace Backend.DTOs.MaterialDTOs;

public class ShowMaterialDto 
{
    public int? Id { get; set; }
    public string? Title { get; set; }
    public string? Content { get; set; }
    public int LessonId { get; set; }
    public string? Data { get; set; }
    public string? Type { get; set; }
}