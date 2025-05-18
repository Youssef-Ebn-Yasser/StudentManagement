namespace Backend.DTOs.CourseDTO;

public class ShowCourseDto
{
    public int Id { get; set; }
    public string? Title { get; set; }
    public string? Description { get; set; }
    public string? Price { get; set; }
    public string? ImagePath { get; set; }
    public string? TeacherName { get; set; }
    public int LessonCount { get; set; }
    //public string? Hours { get; set; } 
    public List<LessonInfo>? LessonInfo { get; set; }
    public List<CommentInfo>? CommentInfo { get; set; }

    public string? CategoryName { get; set; }
}
public class LessonInfo
{
    public int Id { get; set; }
    public string? Title { get; set; }
}

public class CommentInfo
{
    public int Id { get; set; }
    public string? Content { get; set; }
    public string? StudentName { get; set; }
    public DateTime CreatedAt { get; set; }
}