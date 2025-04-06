namespace Backend.Entities;

public class Assignment
{
    [Key] public string Id { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public DateTime Deadline { get; set; }


    [ForeignKey(nameof(Course))]
    public string CourseId { get; set; } = string.Empty;
    public Course Course { get; set; } = new Course();
}