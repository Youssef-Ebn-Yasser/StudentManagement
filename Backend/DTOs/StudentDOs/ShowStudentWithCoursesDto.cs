namespace Backend.DTOs.StudentDOs
{
    public class ShowStudentWithCoursesDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public List<string> CourseTitles { get; set; } = new();
    }
}
