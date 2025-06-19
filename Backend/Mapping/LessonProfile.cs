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
                    }
                    else
                    {
                        dest.TitleEn = src.Title;
                        dest.TitleAr = string.Empty;
                    }

                    if (IsArabic(src.Description))
                    {
                        dest.DescriptionAr = src.Description;
                        dest.DescriptionEn = string.Empty;
                    }
                    else
                    {
                        dest.DescriptionEn = src.Description;
                        dest.DescriptionAr = string.Empty;
                    }
                });

            // ShowLessonDetailsPage ↔ Lesson
            CreateMap<ShowLessonDetailsPage, Lesson>().ReverseMap();
        }

        private static bool IsArabic(string text)
        {
            return !string.IsNullOrWhiteSpace(text) && Regex.IsMatch(text, @"\p{IsArabic}");
        }
    }
}
