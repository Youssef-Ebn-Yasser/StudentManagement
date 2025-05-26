using Backend.DTOs.MaterialDTOs;
using AutoMapper;
namespace Backend.Mapping
{
    public class MaterialProfile : Profile
    {
        public MaterialProfile()
        {
            CreateMap<Material, ShowMaterialDto>()
                .ForMember(m => m.Data, ma => ma.MapFrom(opt => opt.Path));


        }
    
    }
}
