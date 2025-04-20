namespace Backend.Mapping;

public class TeacherMapping : Profile
{
    public TeacherMapping()
    {
        // Teacher to ShowAllTeacherDto mapping with Courses
        CreateMap<Teacher, ShowAllTeacherDto>()
            .ForMember(dest => dest.coursesProfiles,
                      opt => opt.MapFrom(src => src.Courses));

        CreateMap<Teacher, ShowAllTeacherWithDetailsDto>()
            .ForMember(dest => dest.coursesProfiles,
                            opt => opt.MapFrom(src => src.Courses));
        // Course to CoursesProfile mapping
        CreateMap<Course, CoursesProfile>()
            .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id))
            .ForMember(dest => dest.Title, opt => opt.MapFrom(src => src.Title));

        // Other mappings
        CreateMap<Teacher, TeacherProfileDto>();
        CreateMap<Teacher, GetTeacherDto>();
        CreateMap<CreateTeacherDto, Teacher>();
        CreateMap<UpdateTeacherDto, Teacher>();

    }
}