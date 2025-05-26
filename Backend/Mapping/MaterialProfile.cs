using Backend.DTOs.MaterialDTOs;
namespace Backend.Mapping;

public class MaterialProfile : Profile
{
    public MaterialProfile()
    {
<<<<<<< HEAD
        public MaterialProfile()
        {
            CreateMap<Material, ShowMaterialDto>()
                .ForMember(m => m.Data, ma => ma.MapFrom(opt => opt.Path));
=======
        CreateMap<Material, ShowMaterialDto>();
        CreateMap<CreateMaterialDto, Material>();
        CreateMap<UpdateMaterialDto, Material>();
>>>>>>> 6f6a458e4c59219f3008cf5ed765a016fb6b85fb

    }
}