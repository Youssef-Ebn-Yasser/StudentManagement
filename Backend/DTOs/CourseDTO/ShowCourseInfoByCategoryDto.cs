namespace Backend.DTOs.CourseDTO
{
    public class ShowCourseInfoByCategoryDto
    {
        public string? Description { get; set; }
        public double? Price { get; set; }
        public DateTime? CreatedAt { get; set; } = DateTime.Now;
        public string? ImagePath { get; set; }
        [Required]
        public string? Level { get; set; }
        public string? Hours { get; set; }

    }
}
