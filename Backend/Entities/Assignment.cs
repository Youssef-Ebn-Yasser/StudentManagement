namespace Backend.Entities;

public class Assignment : BaseEntity
{
    public string Description { get; set; } = string.Empty;
    public DateTime Deadline { get; set; }


    [ForeignKey(nameof(Course))]
    public int CourseId { get; set; }
    public Course Course { get; set; }
}