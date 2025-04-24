namespace Backend.DTOs.CourseDTO;

public class ShowCourseDto
{
    public int Id { get; set; }
    public int Description { get; set; }
    public string? ImagePath { get; set; }
    public string? TeacherName { get; set; }
    public List<LessonInfo>? lessonInfo { get; set; }
}
public class LessonInfo
{
    public int Id { get; set; }
    public string? Title { get; set; }
}