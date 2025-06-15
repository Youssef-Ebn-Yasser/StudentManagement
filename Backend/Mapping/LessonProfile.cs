using Backend.DTOs.LessonDTOs;

namespace Backend.Mapping
{
    public class LessonProfile : Profile
    {
        public LessonProfile()
        {
            CreateMap<CreateLessonDto, Lesson>()
                .ForMember(dest => dest.CourseId, opt => opt.MapFrom(src => src.CourseId))
                .ForMember(dest => GeneralLocalizableEntity.Localized(dest.TitleAr, dest.TitleEn), opt => opt.MapFrom(src => src.Title))
                .ForMember(dest => GeneralLocalizableEntity.Localized(dest.DescriptionAr, dest.DescriptionEn), opt => opt.MapFrom(src => src.Description));

            CreateMap<ShowLessonDetailsPage, Lesson>().ReverseMap();
        }


    }
}
