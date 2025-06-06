namespace Backend.DTOs.AssignmentDTOs
{
    public class AssignmentDetailDto
    {
        public int StudentAssignmentId { get; set; }
        public string StudentName { get; set; } = null!;
        public string LessonName { get; set; } = null!;
        public string CourseName { get; set; } = null!;
        public int Degree { get; set; } = 0;
        public string FilePath { get; set; } = null!;
    }
}
