using Backend.DTOs.CategoryDTOOS;

namespace Backend.Mapping
{
    public class CategoryProfile:Profile
    {
        public CategoryProfile()
        {
            CreateMap<Category, CategoryDto>()
            .ForMember(dest => dest.Name, opt => opt.MapFrom(src => GeneralLocalizableEntity.Localized(src.CategoryNameAr, src.CategoryNameEn)));

            CreateMap<CreateCategoryDto, Category>()
                .ForMember(dest => GeneralLocalizableEntity.Localized(dest.CategoryNameAr, dest.CategoryNameEn), opt => opt.MapFrom(src => src.Name))
                .ForMember(dest => dest.IsDeleted, opt => opt.MapFrom(src => false)); // Default false

            CreateMap<UpdateCategoryDto, Category>()
                .ForMember(dest => GeneralLocalizableEntity.Localized(dest.CategoryNameAr, dest.CategoryNameEn), opt => opt.MapFrom(src => src.Name))
                .ForMember(dest => dest.IsDeleted, opt => opt.MapFrom(src => src.IsDeleted));
        }
    }
}
