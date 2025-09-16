using Backend.DTOs.MaterialDTOs;

namespace Backend.Services.Implementation;

public class MaterialService : ResponseHandler, IMaterialService
{
    #region Fields
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly IPhysicalFileUpload _physicalFileUpload;
    private readonly IStructuredLogger _logger;
    static CultureInfo cultureInfo = Thread.CurrentThread.CurrentCulture;
    #endregion

    #region Constructor
    public MaterialService(IUnitOfWork unitOfWork,
                           IMapper mapper,
                           IPhysicalFileUpload physicalFileUpload,
                           IStructuredLogger logger)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _physicalFileUpload = physicalFileUpload;
        _logger = logger;
    }
    #endregion

    #region Method
    public async Task<Response<List<ShowMaterialDto>>> GetAllMaterialByLessonIdAsync(int lessonId)
    {
        var materials = await _unitOfWork.Repository<Material>()
                                                     .GetTableNoTracking()
                                                     .Where(m => m.LessonId == lessonId && m.IsDeleted == false)
                                                     .ToListAsync();

        if (materials == null)
        {
            _logger.LogInfo($"No material in lesson with id {lessonId}");
            return BadRequest<List<ShowMaterialDto>>($"No material in lesson with id {lessonId}");
        }
        var mappedMaterials = _mapper.Map<List<ShowMaterialDto>>(materials);
        return Success(mappedMaterials);
    }

    public async Task<Response<string>> UploadLink(UploadLinkDto uploadLinkDto)
    {
        var material = new Material()
        {
            LessonId = uploadLinkDto.LessionId,
            Path = uploadLinkDto.UrlLink,
            Type = MaterialTypeId.Link,
            TitleEn = "",
            ContentAr = "",
            ContentEn = "",
            CreatedAt = DateTime.UtcNow,
            IsDeleted = false,
        };

        await _unitOfWork.Repository<Material>().AddAsync(material);
        var result = _unitOfWork.Complete();
        return result > 0 ? Success("Material Created Successfully") :
                         BadRequest<string>("make link shorter to save it");

    }

    public async Task<Response<string>> CreateAsync(CreateMaterialDto createMaterialDto)
    {
        var path = await _physicalFileUpload.UploadFileAsync("Material", createMaterialDto.Data);


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

        }
        ;


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


        _mapper.Map(updateMaterialDto, existingMaterial);
        _unitOfWork.Repository<Material>().Update(existingMaterial);
        _unitOfWork.Complete();
        return Success("Material Updated Successfully");
    }

    public async Task<Response<string>> DeleteAsync(int materialId)
    {
        var material = await _unitOfWork.Repository<Material>().GetByIdAsync(materialId);
        if (material == null)
        {
            _logger.LogInfo($"Material Not Found when try delete with id {materialId}");
            return NotFound<string>("Material Not Found");
        }

        material.IsDeleted = true;
        var isSuccess = _unitOfWork.Complete();

        if (isSuccess > 0)
        {
            _logger.LogInfo($"Material  deleted success with id {materialId}");
            return Success("Material Deleted Successfully");
        }
        else
        {
            _logger.LogInfo($"Material with id {materialId} can not deleted try later");
            return Success("Material Deleted Faild");
        }
    }
    #endregion
}