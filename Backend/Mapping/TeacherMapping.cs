using System.Text.RegularExpressions;

namespace Backend.Mapping;

public class TeacherMapping : Profile
{
    public TeacherMapping()
    {
        // Teacher to ShowAllTeacherDto mapping with Courses
        CreateMap<Teacher, ShowAllTeacherDto>()
           .ForMember(dest => dest.Name,
                      opt => opt.MapFrom(src => GeneralLocalizableEntity.Localized(src.NameAr, src.NameEn)))
            .ForMember(dest => dest.coursesProfiles,
                      opt => opt.MapFrom(src => src.Courses));

        CreateMap<Teacher, ShowAllTeacherWithDetailsDto>()
            .ForMember(dest => dest.coursesProfiles,
                            opt => opt.MapFrom(src => src.Courses));
        // Course to CoursesProfile mapping
        CreateMap<Course, CoursesProfile>()
            .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id))
            .ForMember(dest => dest.Title, opt => opt.MapFrom(src => GeneralLocalizableEntity.Localized(src.TitleAr, src.TitleEn)));

        // Other mappings
        CreateMap<Teacher, TeacherProfileDto>()
            .ForMember(dest => dest.Name, opt => opt.MapFrom(src => GeneralLocalizableEntity.Localized(src.NameAr, src.NameEn)))
            .ForMember(dest => dest.AdditionalInfo, opt => opt.MapFrom(src => GeneralLocalizableEntity.Localized(src.AdditionalInfoAr, src.AdditionalInfoEn)))
            .ForMember(dest => dest.Specialization, opt => opt.MapFrom(src => GeneralLocalizableEntity.Localized(src.SpecializationAr, src.SpecializationEn)))
            .ForMember(dest => dest.coursesProfiles, opt => opt.MapFrom(src => src.Courses));
        CreateMap<Teacher, GetTeacherDto>()
                            .ForMember(dest => dest.Name, opt => opt.MapFrom(src => GeneralLocalizableEntity.Localized(src.NameAr, src.NameEn)))
                            .ForMember(dest => dest.AdditionalInfo, opt => opt.MapFrom(src => GeneralLocalizableEntity.Localized(src.AdditionalInfoAr, src.AdditionalInfoEn)))
                            .ForMember(dest => dest.Specialization, opt => opt.MapFrom(src => GeneralLocalizableEntity.Localized(src.SpecializationAr, src.SpecializationEn)));

        CreateMap<UpdateTeacherDto, Teacher>()
        .AfterMap((src, dest) =>
        {
            if (IsArabic(src.Name))
            {
                dest.AdditionalInfoAr = src.AdditionalInfo;
                dest.NameAr = src.Name;
                dest.SpecializationAr = src.Specialization;
            }
            else
            {
                dest.NameEn = src.Name;
                dest.AdditionalInfoEn = string.Empty;
                dest.SpecializationEn = src.Specialization;
            }
        });
    }
    private static bool IsArabic(string text)
    {
        return !string.IsNullOrWhiteSpace(text) && Regex.IsMatch(text, @"\p{IsArabic}");
    }
}