namespace Backend.DTOs.AssignmentDTOs
{
    public class UploadAssignmentDto
    {
        public int LessonId { get; set; }

        /// <summary>
        /// The ID of the student who is submitting this assignment.
        /// </summary>
        public int StudentId { get; set; }

        /// <summary>
        /// The uploaded file (e.g. PDF, DOCX, image, etc.).
        /// </summary>
        public IFormFile File { get; set; } = null!;
    }
}
