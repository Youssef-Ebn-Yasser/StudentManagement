using Backend.DTOs.CategoryDTOOS;

namespace Backend.DTOs.CourseDTO
{
    public class ShowCoursesByCategory
    {
        public CategoryDto Category { get; set; } = new CategoryDto();
        public List<ShowCourseDto> Courses { get; set; } = new List<ShowCourseDto>();

    }
}
