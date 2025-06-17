namespace Backend.Entities;

public class ChatGroup
{
    public int Id { get; set; }
    public string NameEn { get; set; } = string.Empty;
    public string NameAr { get; set; } = string.Empty;
    public int CourseId { get; set; }


    [ForeignKey("CourseId")]
    public Course? Course { get; set; }
}