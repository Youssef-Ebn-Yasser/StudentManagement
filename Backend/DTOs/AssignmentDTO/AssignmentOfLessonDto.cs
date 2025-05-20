namespace Backend.DTOs.AssignmentDTO
{
    public class AssignmentOfLessonDto
    {
        [Required]
        public string LessonName { get; set; }
        [Required]
        public string Title { get; set; }
        public string Content { get; set; }
        public string Path { get; set; }
        public MaterialTypeId materialTypeId { get; set; }

    }
}
