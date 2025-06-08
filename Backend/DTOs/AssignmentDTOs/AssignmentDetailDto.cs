namespace Backend.DTOs.AssignmentDTOs
{
    public class AssignmentDetailDto
    {
        public int StudentAssignmentId { get; set; }
        public string StudentName { get; set; }
        public string LessonName { get; set; }
        public string CourseName { get; set; }
        public string AssignmentFilePath { get; set; }
        public int? Degree { get; set; }
    }
}
