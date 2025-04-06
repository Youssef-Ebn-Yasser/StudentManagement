namespace Backend.Entities;

public class Material
{
    [Key] public string Id { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;


    public Course Course { get; set; } = new Course();
    [ForeignKey(nameof(Course))]
    public string CourseId { get; set; } = string.Empty;
}