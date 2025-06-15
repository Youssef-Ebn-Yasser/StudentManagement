namespace Backend.DTOs.StudentProfileDto
{
    public class StudentAssignmentDto
    {
        public int Id { get; set; }
        public string CourseName { get; set; }
        public string LessonName { get; set; }
        public string Path { get; set; }
        public byte DegreePercentage { get; set; }
        
    }
}
