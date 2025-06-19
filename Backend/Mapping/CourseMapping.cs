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
                .ForMember(dest => dest.CategoryName,
                           opt => opt.MapFrom(src =>
                               src.Category != null
                               ? GeneralLocalizableEntity.Localized(src.Category.CategoryNameAr, src.Category.CategoryNameEn)
                               : null));

            // Course → ShowCourseDto
            CreateMap<Course, ShowCourseDto>()
                .ForMember(dest => dest.TeacherName,
                           opt => opt.MapFrom(src =>
                               src.Teacher != null
                               ? GeneralLocalizableEntity.Localized(src.Teacher.NameAr, src.Teacher.NameEn)
                               : null))
                .ForMember(dest => dest.LessonCount,
                           opt => opt.MapFrom(src => src.lessons != null ? src.lessons.Count : 0))
                .ForMember(dest => dest.LessonInfo,
                           opt => opt.MapFrom(src => src.lessons))
                //.ForMember(dest => dest.CommentInfo,
                //           opt => opt.MapFrom(src =>
                //               src.StudentCourses?
                //                  .SelectMany(sc => sc.Student.Comments
                //                      .Where(c => c.Lesson.CourseId == src.Id))
                //                  .ToList() ?? new List<Comment>()))
                .ForMember(dest => dest.CategoryName,
                           opt => opt.MapFrom(src =>
                               src.Category != null
                               ? GeneralLocalizableEntity.Localized(src.Category.CategoryNameAr, src.Category.CategoryNameEn)
                               : null));

            // Lesson → LessonInfo
            CreateMap<Lesson, LessonInfo>();

            // Comment → CommentInfo
            CreateMap<Comment, CommentInfo>()
                .ForMember(dest => dest.StudentName,
                           opt => opt.MapFrom(src =>
                               src.Student != null
                               ? GeneralLocalizableEntity.Localized(src.Student.NameAr, src.Student.NameEn)
                               : "Unknown"));

            // Course → CoursesProfile
            CreateMap<Course, CoursesProfile>();

            // Course → HomeCourses
            CreateMap<Course, HomeCourses>();
        }
    }
}
