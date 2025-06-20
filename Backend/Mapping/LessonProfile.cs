using Backend.DTOs.LessonDTOs;
using System.Text.RegularExpressions;

namespace Backend.Mapping
{
    public class LessonProfile : Profile
    {
        public LessonProfile()
        {
            // CreateLessonDto → Lesson
            CreateMap<CreateLessonDto, Lesson>()
                .ForMember(dest => dest.CourseId, opt => opt.MapFrom(src => src.CourseId))
                .AfterMap((src, dest) =>
                {
                    if (IsArabic(src.Title))
                    {
                        dest.TitleAr = src.Title;
                        dest.TitleEn = string.Empty;
                        dest.DescriptionAr = src.Description;
                        dest.DescriptionEn = string.Empty;
                    }
                    else
                    {
                        dest.TitleEn = src.Title;
                        dest.TitleAr = string.Empty;
                        dest.DescriptionEn = src.Description;
                        dest.DescriptionAr = string.Empty;
                    }
                });

            // ShowLessonDetailsPage ↔ Lesson
            CreateMap<Lesson, ShowLessonDetailsPage>()
            .ForMember(dest => dest.showMaterialsLessons, opt => opt.MapFrom(src => src.materials))
            .ForMember(dest => dest.Title, opt => opt.MapFrom(src => GeneralLocalizableEntity.Localized(src.TitleAr, src.TitleEn)))
            .ForMember(dest => dest.Description, opt => opt.MapFrom(src => GeneralLocalizableEntity.Localized(src.DescriptionAr, src.DescriptionEn)))
            ;

            CreateMap<Material, ShowMaterialsLesson>()
.ForMember(m => m.Title, ma => ma.MapFrom(src => GeneralLocalizableEntity.Localized(src.TitleAr, src.TitleEn)))
.ForMember(m => m.Content, ma => ma.MapFrom(src => GeneralLocalizableEntity.Localized(src.ContentAr, src.ContentEn)))

            .ForMember(m => m.Data, ma => ma.MapFrom(opt => opt.Path));
        }

        private static bool IsArabic(string text)
        {
            return !string.IsNullOrWhiteSpace(text) && Regex.IsMatch(text, @"\p{IsArabic}");
        }
    }
}
