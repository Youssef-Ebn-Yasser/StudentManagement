using Backend.DTOs.StudentDOs;

namespace Backend.Mapping
{
    public class StudentMapping : Profile
    {
        public StudentMapping()
        {
            CreateMap<CreateStudentDto, Student>();
            CreateMap<UpdateStudentDto, Student>().ReverseMap();
            CreateMap<Student, ShowStudentDto>();

            CreateMap<Student, ShowStudentWithCoursesDto>()
                .ForMember(dest => dest.CourseTitles,
                    opt => opt.MapFrom(src => src.StudentCourses != null
                        ? src.StudentCourses.Select(sc => sc.Course != null ? GeneralLocalizableEntity.Localized(sc.Course.TitleAr, sc.Course.TitleEn) : string.Empty).ToList()
                        : new List<string>()));
        }
    }

}