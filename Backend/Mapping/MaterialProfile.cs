
namespace Backend.Mapping;

public class MaterialProfile : Profile
{
    public MaterialProfile()
    {
        // CreateMap<CreateMaterialDto, Material>()
        //.ForMember(dest => dest.Title, opt => opt.MapFrom(src => src.Title))
        //.ForMember(dest => dest.Content, opt => opt.MapFrom(src => src.Content))
        //.ForMember(dest => dest.CourseId, opt => opt.MapFrom(src => src.LessonId)) 
        //.ForMember(dest => dest.Id, opt => opt.Ignore()); // لأنه بيكون generated


        // CreateMap<UpdateMaterialDto, Material>()
        //     .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id ?? 0))
        //     .ForMember(dest => dest.Title, opt => opt.MapFrom(src => src.Title))
        //     .ForMember(dest => dest.Content, opt => opt.MapFrom(src => src.Content))
        //     .ForMember(dest => dest.CourseId, opt => opt.MapFrom(src => src.LessonId));

        //CreateMap<Material, ShowMaterialDto>()
        //    .ForMember(dest => dest.Title, opt => opt.MapFrom(src => src.Title))
        //    .ForMember(dest => dest.Content, opt => opt.MapFrom(src => src.Content))
        //    .ForMember(dest => dest.LessonId, opt => opt.MapFrom(src => src.CourseId))
        //    .ForMember(dest => dest.Type, opt => opt.Ignore()) 
        //    .ForMember(dest => dest.Data, opt => opt.Ignore()) // دا ملف مش بيتجاب من الكيان غالبًا
        //    .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id));



        //        CreateMap<CreateMaterialDto, Material>()
        //.ForMember(dest => dest.Title, opt => opt.MapFrom(src => src.Title))
        //.ForMember(dest => dest.Content, opt => opt.MapFrom(src => src.Content))
        //.ForMember(dest => dest.CourseId, opt => opt.MapFrom(src => src.LessonId))
        //.ForMember(dest => dest.Id, opt => opt.Ignore()); // لأنه بيكون generated


        //        CreateMap<UpdateMaterialDto, Material>()
        //            .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id ?? 0))
        //            .ForMember(dest => dest.Title, opt => opt.MapFrom(src => src.Title))
        //            .ForMember(dest => dest.Content, opt => opt.MapFrom(src => src.Content))
        //            .ForMember(dest => dest.CourseId, opt => opt.MapFrom(src => src.LessonId));

        //        CreateMap<Material, ShowMaterialDto>()
        //            .ForMember(dest => dest.Title, opt => opt.MapFrom(src => src.Title))
        //            .ForMember(dest => dest.Content, opt => opt.MapFrom(src => src.Content))
        //            .ForMember(dest => dest.LessonId, opt => opt.MapFrom(src => src.CourseId))
        //            .ForMember(dest => dest.Type, opt => opt.Ignore())
        //            .ForMember(dest => dest.Data, opt => opt.Ignore()) // دا ملف مش بيتجاب من الكيان غالبًا
        //            .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id));
    }

}