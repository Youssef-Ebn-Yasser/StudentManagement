namespace Backend.Entities;

public class Course : BaseEntity
{

    public string? DescriptionEn { get; set; }
    public string? DescriptionAr { get; set; }
    public double Price { get; set; }
    public string? ImagePath { get; set; }
    public string? LevelEn { get; set; }
    public string? LevelAr { get; set; }
    public string? Hours { get; set; }
    public List<Lesson>? lessons { get; set; }
    [ForeignKey("TecherId")]
    public Teacher? Teacher { get; set; }
    public int? TecherId { get; set; }
    public List<StudentCourse>? StudentCourses { get; set; }
    [ForeignKey("CategoryId")]
    public int? CategoryId { get; set; }
    public Category Category { get; set; }
    public bool? IsDeleted { get; set; } = false;
    public DateTime? CreatedAt { get; set; } = DateTime.Now;
    public List<MeetingAttendance> MeetingAttendance { get; set; }
    public List<Meeting> Meetings { get; set; }
}