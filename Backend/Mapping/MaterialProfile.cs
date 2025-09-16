using Backend.DTOs.MaterialDTOs;
using System.Text.RegularExpressions;
namespace Backend.Mapping;

public class MaterialProfile : Profile
{

    public MaterialProfile()
    {
        CreateMap<Material, ShowMaterialDto>()
        .ForMember(m => m.Title, ma => ma.MapFrom(src => GeneralLocalizableEntity.Localized(src.TitleAr, src.TitleEn)))
        .ForMember(m => m.Content, ma => ma.MapFrom(src => GeneralLocalizableEntity.Localized(src.ContentAr, src.ContentEn)))

            .ForMember(m => m.Data, ma => ma.MapFrom(opt => opt.Path));

        CreateMap<CreateMaterialDto, Material>()
                     .AfterMap((src, dest) =>
                     {
                         if (IsArabic(src.Title))
                         {
                             dest.TitleAr = src.Title;
                             dest.ContentAr = src.Content;
                         }
                         else
                         {
                             dest.TitleEn = src.Title;
                             dest.ContentEn = src.Content;
                         }
                     });
        CreateMap<UpdateMaterialDto, Material>()
                             .AfterMap((src, dest) =>
                             {
                                 if (IsArabic(src.Title))
                                 {
                                     dest.TitleAr = src.Title;
                                     dest.ContentAr = src.Content;
                                 }
                                 else
                                 {
                                     dest.TitleEn = src.Title;
                                     dest.ContentEn = src.Content;
                                 }
                             });

    }
    private static bool IsArabic(string text)
    {
        return !string.IsNullOrWhiteSpace(text) && Regex.IsMatch(text, @"\p{IsArabic}");
    }
}