namespace Backend.DTOs.TeacherDTOs;

public class TeacherProfileDto : UpdateTeacherDto
{
    public List<CoursesProfile>? coursesProfiles { get; set; }
}

public class CoursesProfile
{
    public int Id { get; set; }
    public string? Title { get; set; }
    public string? CourseImagePath { get; set; }
}