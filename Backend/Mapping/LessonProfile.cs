using Backend.DTOs.LessonDTOs;

namespace Backend.Mapping
{
    public class LessonProfile:Profile
    {
        public LessonProfile()
        {
            //CreateMap<CreateLessonDto, Lesson>()
            //    .ForMember(dest => dest.CourseId, opt => opt.MapFrom(src => src.CourseId))
            //    .ForMember(dest => dest.Title, opt => opt.MapFrom(src => src.Title))
            //    .ForMember(dest => dest.Description, opt => opt.MapFrom(src => src.Description))
            //    .ForMember(dest => dest.Id, opt => opt.Ignore()); // لأنه Generated

            //CreateMap<UpdateLessonDto, Lesson>()
            //    .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id))
            //    .ForMember(dest => dest.CourseId, opt => opt.MapFrom(src => src.CourseId))
            //    .ForMember(dest => dest.Title, opt => opt.MapFrom(src => src.Title))
            //    .ForMember(dest => dest.Description, opt => opt.MapFrom(src => src.Description));

            //CreateMap<Lesson, ShowLessonDetailsPage>()
            //    .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id))
            //    .ForMember(dest => dest.Title, opt => opt.MapFrom(src => src.Title))
            //    .ForMember(dest => dest.Description, opt => opt.MapFrom(src => src.Description))
            //    .ForMember(dest => dest.showMaterialsLessons, opt => opt.MapFrom(src => src.Materials));

           
            //CreateMap<Material, ShowMaterialsLesson>()
            //    .ForMember(dest => dest.Title, opt => opt.MapFrom(src => src.Title))
            //    .ForMember(dest => dest.Content, opt => opt.MapFrom(src => src.Content))
            //    .ForMember(dest => dest.Type, opt => opt.Ignore()) 
            //    .ForMember(dest => dest.Data, opt => opt.Ignore()); 
        }
    }
}
