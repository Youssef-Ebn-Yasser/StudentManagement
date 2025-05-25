using Backend.DTOs.MaterialDTOs;
using AutoMapper;
namespace Backend.Mapping
{
    public class MaterialProfile : Profile
    {
        public MaterialProfile()
        {
            CreateMap<Material, ShowMaterialDto>();


        }
    
    }
}
