namespace Backend.DTOs.TeacherDTOs;

public class TeacherProfileDto : GetTeacherDto
{
    public List<CoursesProfile>? coursesProfiles { get; set; }
}

public class CoursesProfile
{
    public int Id { get; set; }
    public string? Title { get; set; }
}