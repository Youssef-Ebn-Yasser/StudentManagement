namespace Backend.DTOs.LessonDTOs;

public class ShowLessonDetailsPage
{
    public int Id { get; set; }
    public string? Title { get; set; }
    public string? Description { get; set; }
    public List<ShowMaterialsLesson>? showMaterialsLessons { get; set; }
}

public class ShowMaterialsLesson
{
    public string? Title { get; set; }
    public string? Content { get; set; }
    public IFormFile? Data { get; set; }
    public MaterialTypeId? Type { get; set; }
}