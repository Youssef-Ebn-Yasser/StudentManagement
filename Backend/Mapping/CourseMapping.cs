using System.Text.RegularExpressions;

namespace Backend.Mapping;

public class CourseMapping : Profile
{
    public CourseMapping()
    {
        // CreateCourseDto → Course
        CreateMap<CreateCourseDto, Course>()
            .ForMember(dest => dest.TecherId, opt => opt.MapFrom(src => src.TeacherId))
             .AfterMap((src, dest) =>
             {
                 if (IsArabic(src.Title))
                 {
                     dest.TitleAr = src.Title;
                     dest.LevelAr = src.Level;
                     dest.DescriptionAr = src.Description;
                 }
                 else
                 {
                     dest.TitleEn = src.Title;
                     dest.LevelEn = src.Level;
                     dest.DescriptionEn = src.Description;
                 }
             });


        // UpdateCourseDto → Course
        CreateMap<UpdateCourseDto, Course>()
            .ForMember(dest => dest.TecherId, opt => opt.MapFrom(src => src.TeacherId))
             .AfterMap((src, dest) =>
             {
                 if (IsArabic(src.Title))
                 {
                     dest.TitleAr = src.Title;
                     dest.LevelAr = src.Level;
                     dest.DescriptionAr = src.Description;
                 }
                 else
                 {
                     dest.TitleEn = src.Title;
                     dest.LevelEn = src.Level;
                     dest.DescriptionEn = src.Description;
                 }
             });

        // Course → ShowAllCoursesDto
        CreateMap<Course, ShowAllCoursesDto>()
            .ForMember(dest => dest.Price, opt => opt.MapFrom(src => (int?)src.Price))
            .ForMember(dest => dest.Description, opt => opt.MapFrom(src => GeneralLocalizableEntity.Localized(src.DescriptionAr, src.DescriptionEn)))
            .ForMember(dest => dest.Title, opt => opt.MapFrom(src => GeneralLocalizableEntity.Localized(src.TitleAr, src.TitleEn)))
            .ForMember(dest => dest.Level, opt => opt.MapFrom(src => GeneralLocalizableEntity.Localized(src.LevelAr, src.LevelEn)))

            .ForMember(dest => dest.CategoryName,
                       opt => opt.MapFrom(src =>
                           src.Category != null
                           ? GeneralLocalizableEntity.Localized(src.Category.CategoryNameAr, src.Category.CategoryNameEn)
                           : null))
            .ForMember(dest => dest.TeacherName,
                       opt => opt.MapFrom(src =>
                           GeneralLocalizableEntity.Localized(src.Teacher.NameAr, src.Teacher.NameEn)));

        // Course → ShowCourseDto
        CreateMap<Course, ShowCourseDto>()
            .ForMember(dest => dest.TeacherName,
                       opt => opt.MapFrom(src =>
                           src.Teacher != null
                           ? GeneralLocalizableEntity.Localized(src.Teacher.NameAr, src.Teacher.NameEn)
                           : null))
            .ForMember(dest => dest.LessonCount,
                       opt => opt.MapFrom(src => src.lessons != null ? src.lessons.Count : 0))
            .ForMember(dest => dest.Title, opt => opt.MapFrom(src => GeneralLocalizableEntity.Localized(src.TitleAr, src.TitleEn)))
             .ForMember(dest => dest.Description, opt => opt.MapFrom(src => GeneralLocalizableEntity.Localized(src.DescriptionAr, src.DescriptionEn)))

            .ForMember(dest => dest.LessonInfo,
                       opt => opt.MapFrom(src => src.lessons))
            .ForMember(dest => dest.CategoryName,
                       opt => opt.MapFrom(src =>
                           src.Category != null
                           ? GeneralLocalizableEntity.Localized(src.Category.CategoryNameAr, src.Category.CategoryNameEn)
                           : null))
            .ForMember(dest => dest.TeacherName,
                       opt => opt.MapFrom(src =>
                           GeneralLocalizableEntity.Localized(src.Teacher.NameAr, src.Teacher.NameEn)));

        // Lesson → LessonInfo
        CreateMap<Lesson, LessonInfo>()
         .ForMember(dest => dest.Title, opt => opt.MapFrom(src => GeneralLocalizableEntity.Localized(src.TitleAr, src.TitleEn)))
        ;

        // Comment → CommentInfo
        CreateMap<Comment, CommentInfo>()
            .ForMember(dest => dest.StudentName,
                       opt => opt.MapFrom(src =>
                           src.Student != null
                           ? GeneralLocalizableEntity.Localized(src.Student.NameAr, src.Student.NameEn)
                           : "Unknown"));

        // Course → CoursesProfile
        CreateMap<Course, CoursesProfile>()
           .ForMember(dest => dest.Title, opt => opt.MapFrom(src => GeneralLocalizableEntity.Localized(src.TitleAr, src.TitleEn)))
           ;

        // Course → HomeCourses
        CreateMap<Course, HomeCourses>()
                   .ForMember(dest => dest.Title, opt => opt.MapFrom(src => GeneralLocalizableEntity.Localized(src.TitleAr, src.TitleEn)))
           .ForMember(dest => dest.Description, opt => opt.MapFrom(src => GeneralLocalizableEntity.Localized(src.DescriptionAr, src.DescriptionEn)))
                      .ForMember(dest => dest.Level, opt => opt.MapFrom(src => GeneralLocalizableEntity.Localized(src.LevelAr, src.LevelEn)));
    }

    private static bool IsArabic(string text)
    {
        return !string.IsNullOrWhiteSpace(text) && Regex.IsMatch(text, @"\p{IsArabic}");
    }
}