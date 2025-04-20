namespace Backend.Mapping
{
    public class CourseMapping : Profile
    {
        public CourseMapping()
        {
            CreateMap<Course, ShowAllCoursesDto>();
            CreateMap<CreateCourseDto, Course>();
            CreateMap<Course, CoursesProfile>();


        }
    }
}
