using System.Text.RegularExpressions;

namespace Backend.Mapping;

public class StudentMapping : Profile
{
    public StudentMapping()
    {
        CreateMap<CreateStudentDto, Student>()
        .AfterMap((src, dest) =>
        {
            if (IsArabic(src.Name))
            {
                dest.NameAr = src.Name;
            }
            else
            {
                dest.NameEn = src.Name;
            }
        });
        CreateMap<UpdateStudentDto, Student>()
          .AfterMap((src, dest) =>
          {
              if (IsArabic(src.Name))
              {
                  dest.NameAr = src.Name;
              }
              else
              {
                  dest.NameEn = src.Name;
              }
          });
        CreateMap<Student, ShowStudentDto>()
        .ForMember(dest => dest.Name, opt => opt.MapFrom(src => GeneralLocalizableEntity.Localized(src.NameAr, src.NameEn)));

        CreateMap<Student, ShowStudentWithCoursesDto>()
            .ForMember(dest => dest.Name, opt => opt.MapFrom(src => GeneralLocalizableEntity.Localized(src.NameAr, src.NameEn)))
            .ForMember(dest => dest.CourseTitles,
                opt => opt.MapFrom(src => src.StudentCourses != null
                    ? src.StudentCourses.Select(sc => sc.Course != null ? GeneralLocalizableEntity.Localized(sc.Course.TitleAr, sc.Course.TitleEn) : string.Empty).ToList()
                    : new List<string>()));
    }
    private static bool IsArabic(string text)
    {
        return !string.IsNullOrWhiteSpace(text) && Regex.IsMatch(text, @"\p{IsArabic}");
    }
}