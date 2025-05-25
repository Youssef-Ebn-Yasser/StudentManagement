using Backend.DTOs.MaterialDTOs;
namespace Backend.Mapping;

public class MaterialProfile : Profile
{
    public MaterialProfile()
    {
        CreateMap<Material, ShowMaterialDto>();
        CreateMap<CreateMaterialDto, Material>();
        CreateMap<UpdateMaterialDto, Material>();

    }
}