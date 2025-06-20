using Backend.DTOs.CategoryDTOOS;
using System.Text.RegularExpressions;

namespace Backend.Mapping;

public class CategoryProfile : Profile
{
    public CategoryProfile()
    {
        // Entity to DTO (Reading)
        CreateMap<Category, CategoryDto>()
            .ForMember(dest => dest.Name,
                       opt => opt.MapFrom(src => GeneralLocalizableEntity.Localized(src.CategoryNameAr, src.CategoryNameEn)));

        // Create DTO to Entity (Writing)
        CreateMap<CreateCategoryDto, Category>()
            .ForMember(dest => dest.IsDeleted, opt => opt.MapFrom(src => false))
            .AfterMap((src, dest) =>
            {
                if (IsArabic(src.Name))
                {
                    dest.CategoryNameAr = src.Name;
                    dest.CategoryNameEn = string.Empty;
                }
                else
                {
                    dest.CategoryNameEn = src.Name;
                    dest.CategoryNameAr = string.Empty;
                }
            });

        // Update DTO to Entity (Writing)
        CreateMap<UpdateCategoryDto, Category>()
            .ForMember(dest => dest.IsDeleted, opt => opt.MapFrom(src => src.IsDeleted))
            .AfterMap((src, dest) =>
            {
                if (IsArabic(src.Name))
                {
                    dest.CategoryNameAr = src.Name;
                    dest.CategoryNameEn = string.Empty;
                }
                else
                {
                    dest.CategoryNameEn = src.Name;
                    dest.CategoryNameAr = string.Empty;
                }
            });
    }

    private static bool IsArabic(string text)
    {
        return !string.IsNullOrWhiteSpace(text) && Regex.IsMatch(text, @"\p{IsArabic}");
    }
}