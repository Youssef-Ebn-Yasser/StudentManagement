using Backend.DTOs.MaterialDTOs;
using AutoMapper;
using Backend.Entities;

namespace Backend.Mapping
{
    public class MaterialProfile : Profile
    {
        public MaterialProfile()
        {
            // CreateMaterialDto -> Material
            CreateMap<CreateMaterialDto, Material>()
                .ForMember(dest => dest.Title, opt => opt.MapFrom(src => src.Title))
                .ForMember(dest => dest.Content, opt => opt.MapFrom(src => src.Content))
                .ForMember(dest => dest.LessonId, opt => opt.MapFrom(src => src.LessonId))
                .ForMember(dest => dest.Type, opt => opt.MapFrom(src => src.Type))
                .ForMember(dest => dest.Path, opt => opt.MapFrom(src => src.Path));

            // UpdateMaterialDto -> Material
            CreateMap<UpdateMaterialDto, Material>()
                .ForMember(dest => dest.Title, opt => opt.MapFrom(src => src.Title))
                .ForMember(dest => dest.Content, opt => opt.MapFrom(src => src.Content))
                .ForMember(dest => dest.LessonId, opt => opt.MapFrom(src => src.LessonId))
                .ForMember(dest => dest.Type, opt => opt.MapFrom(src => src.Type))
                .ForMember(dest => dest.Path, opt => opt.MapFrom(src => src.Path));

            // Material -> ShowMaterialDto
            CreateMap<Material, ShowMaterialDto>();
        }
    }
}
