namespace Backend.Entities;

public class Material : BaseEntity
{
    public string? Content { get; set; }
    public bool IsDeleted { get; set; }
    public string? Path { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.Now;
    public MaterialTypeId? Type { get; set; }

    [ForeignKey("LessonId")]
    public Lesson? Lesson { get; set; }
    public int LessonId { get; set; }
}