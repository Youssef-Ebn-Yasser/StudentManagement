using Backend.DTOs.MaterialDTOs;
using static System.Net.Mime.MediaTypeNames;
using System.Globalization;
using MimeKit;

namespace Backend.Services.Implementation
{
    public class MaterialService : ResponseHandler, IMaterialService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly IPhysicalFileUpload _physicalFileUpload;
        public MaterialService(IUnitOfWork unitOfWork, IMapper mapper, IPhysicalFileUpload physicalFileUpload)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _physicalFileUpload = physicalFileUpload;
        }

        public async Task<Response<List<ShowMaterialDto>>> GetAllMaterialByLessonIdAsync(int lessonId)
        {
            var materials = await _unitOfWork.Repository<Material>()
                .GetTableNoTracking()
                .Where(m => m.LessonId == lessonId && m.IsDeleted == false)
                .ToListAsync();

            var mappedMaterials = _mapper.Map<List<ShowMaterialDto>>(materials);
            return Success(mappedMaterials);
        }

        public async Task<Response<string>> CreateAsync(CreateMaterialDto createMaterialDto)
        {
            var path = await _physicalFileUpload.UploadFileAsync("Material", createMaterialDto.Data);

            //var material = new Material
            //{
            //    if (cultureInfo.TwoLetterISOLanguageName.ToLower().Equals("ar"))
            //      { TitleAr = createMaterialDto.Title; }
            //    else
            //      { TitleEn = createMaterialDto.Title; }
            //Title = createMaterialDto.Title,
            //    Content = createMaterialDto.Content,
            //    Type = createMaterialDto.Type,
            //    LessonId = createMaterialDto.LessonId,
            //    Path = path,
            //    CreatedAt = DateTime.UtcNow,
            //    IsDeleted = false,
            //};
            CultureInfo cultureInfo = Thread.CurrentThread.CurrentCulture;

            var material = new Material { };
            
            if (cultureInfo.TwoLetterISOLanguageName.ToLower().Equals("ar"))

            {
                material.TitleAr = createMaterialDto.Title;
                material.ContentAr = createMaterialDto.Content;
                material.Type = createMaterialDto.Type;
                material.LessonId = createMaterialDto.LessonId;
                material.Path = path;
                material.CreatedAt = DateTime.UtcNow;
                material.IsDeleted = false;
            }


            else
            {

                material.TitleEn = createMaterialDto.Title;
                material.ContentEn = createMaterialDto.Content;
                material.Type = createMaterialDto.Type;
                material.LessonId = createMaterialDto.LessonId;
                material.Path = path;
                material.CreatedAt = DateTime.UtcNow;
                material.IsDeleted = false;

            };


            // var material = _mapper.Map<Material>(createMaterialDto);
            await _unitOfWork.Repository<Material>().AddAsync(material);
            _unitOfWork.Complete();
            return Success("Material Created Successfully"); 
        }

        public async Task<Response<string>> UpdateAsync(UpdateMaterialDto updateMaterialDto)
        {
            var existingMaterial = await _unitOfWork.Repository<Material>().GetByIdAsync(updateMaterialDto.Id);
            if (existingMaterial == null)
                return NotFound<string>("Material Not Found");

            var path = await _physicalFileUpload.UploadFileAsync("Material", updateMaterialDto.Data);

            //existingMaterial.Title = updateMaterialDto.Title;
            //existingMaterial.Content = updateMaterialDto.Content;
            //existingMaterial.Type = updateMaterialDto.Type;
            //existingMaterial.LessonId = updateMaterialDto.LessonId;
            //existingMaterial.Path = path;
            //existingMaterial.CreatedAt = DateTime.UtcNow;
            //existingMaterial.IsDeleted = false;
            CultureInfo cultureInfo = Thread.CurrentThread.CurrentCulture;
            if (cultureInfo.TwoLetterISOLanguageName.ToLower().Equals("ar"))
            {
                existingMaterial.TitleAr = updateMaterialDto.Title;
                existingMaterial.ContentAr = updateMaterialDto.Content;
                existingMaterial.Type = updateMaterialDto.Type;
                existingMaterial.LessonId = updateMaterialDto.LessonId;
                existingMaterial.Path = path;
                existingMaterial.CreatedAt = DateTime.UtcNow;
                existingMaterial.IsDeleted = false;
            }
            else
            {
                existingMaterial.TitleEn = updateMaterialDto.Title;
                existingMaterial.ContentEn = updateMaterialDto.Content;
                existingMaterial.Type = updateMaterialDto.Type;
                existingMaterial.LessonId = updateMaterialDto.LessonId;
                existingMaterial.Path = path;
                existingMaterial.CreatedAt = DateTime.UtcNow;
                existingMaterial.IsDeleted = false;
            }


            // _mapper.Map(updateMaterialDto, existingMaterial);
            _unitOfWork.Repository<Material>().Update(existingMaterial);
            _unitOfWork.Complete();
            return Success("Material Updated Successfully");
        }

        public async Task<Response<string>> DeleteAsync(int materialId)
        {
            var material = await _unitOfWork.Repository<Material>().GetByIdAsync(materialId);
            if (material == null)
                return NotFound<string>("Material Not Found");

            _unitOfWork.Repository<Material>().Delete(material);
            _unitOfWork.Complete();
            return Success("Material Deleted Successfully");
        }
    }
}