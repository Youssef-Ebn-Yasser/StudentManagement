namespace Backend.Mapping;

public class CourseProfile : Profile
{
    public CourseProfile()
    {
        CreateMap<CreateCourseDto, Course>();


        CreateMap<CreateCourseDto, Course>()
            .ForMember(dest => dest.Title, opt => opt.MapFrom(src => src.Title ?? ""))
            .ForMember(dest => dest.Description, opt => opt.MapFrom(src => src.Description ?? ""))
            .ForMember(dest => dest.Price, opt => opt.MapFrom(src => src.Price ?? 0));


        CreateMap<UpdateCourseDto, Course>()
            .IncludeBase<CreateCourseDto, Course>();


        CreateMap<Course, ShowAllCoursesDto>()
            .ForMember(dest => dest.ImagePath, opt => opt.Ignore());
    }
}