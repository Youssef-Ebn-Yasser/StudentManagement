namespace Backend.Mapping
{
    public class CourseMapping : Profile
    {
        public CourseMapping()
        {
            // CreateCourseDto → Course
            CreateMap<CreateCourseDto, Course>()
                .ForMember(dest => dest.TecherId, opt => opt.MapFrom(src => src.TeacherId));

            // UpdateCourseDto → Course
            CreateMap<UpdateCourseDto, Course>()
                .ForMember(dest => dest.TecherId, opt => opt.MapFrom(src => src.TeacherId));

            // Course → ShowAllCoursesDto
            CreateMap<Course, ShowAllCoursesDto>()
                .ForMember(dest => dest.Price, opt => opt.MapFrom(src => (int?)src.Price))
                .ForMember(dest => dest.CategoryName, opt => opt.MapFrom(src => src.Category.CategoryName)); 

            // Course → ShowCourseDto
            CreateMap<Course, ShowCourseDto>()
                .ForMember(dest => dest.TeacherName, opt => opt.MapFrom(src => src.Teacher != null ? src.Teacher.Name : null))
                .ForMember(dest => dest.lessonInfo, opt => opt.MapFrom(src => src.lessons))
                .ForMember(dest => dest.CategoryName, opt => opt.MapFrom(src => src.Category.CategoryName));

            // Lesson → LessonInfo
            CreateMap<Lesson, LessonInfo>();

            // Course → CoursesProfile (assuming CoursesProfile is defined elsewhere)
            CreateMap<Course, CoursesProfile>();
        }
    }
}
