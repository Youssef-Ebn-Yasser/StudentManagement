namespace Backend.DTOs.TeacherDTOs;

public class ShowAllTeacherDto
{
    public int Id { get; set; }
    public string? Name { get; set; }
    public List<CoursesProfile>? coursesProfiles { get; set; }
}