using Backend.DTOs.MaterialDTOs;
using Microsoft.AspNetCore.Authorization;
using static Backend.Routing;

namespace Backend.Controllers;

[ApiController]
public class MaterialController : AppControllerBase
{
    #region Fields
    private readonly IMaterialService _materialService;
    private readonly IStructuredLogger _logger;
    #endregion

    #region Constructor
    public MaterialController(IMaterialService materialService, IStructuredLogger logger)
    {
        _materialService = materialService;
        _logger = logger;
    }
    #endregion

    #region Method
    [HttpGet(MaterialRouting.Prefix)]
    public async Task<IActionResult> GetMaterialsByLessonId(int lessonId)
    {
        try
        {
            var result = await _materialService.GetAllMaterialByLessonIdAsync(lessonId);
            return NewResult(result);
        }
        catch
        {
            _logger.LogInfo("Error happen when mapping or by network in GetAll Teacher");
            return NewResult(ErrorHappen.ErrorInServer());
        }
    }
    [Authorize(Roles = "Admin,Teacher")]
    [HttpPost(MaterialRouting.Prefix)]
    public async Task<IActionResult> CreateMaterial([FromForm] CreateMaterialDto createMaterialDto)
    {
        try
        {
            var result = await _materialService.CreateAsync(createMaterialDto);
            return NewResult(result);
        }
        catch
        {
            _logger.LogInfo("Error happen when mapping or by network in GetAll Teacher");
            return NewResult(ErrorHappen.ErrorInServer());
        }
    }
    [Authorize(Roles = "Admin,Teacher")]
    [HttpPut(MaterialRouting.Prefix)]
    public async Task<IActionResult> UpdateMaterial([FromForm] UpdateMaterialDto updateMaterialDto)
    {
        try
        {
            var result = await _materialService.UpdateAsync(updateMaterialDto);
            return NewResult(result);
        }
        catch
        {
            _logger.LogInfo("Error happen when mapping or by network in GetAll Teacher");
            return NewResult(ErrorHappen.ErrorInServer());
        }
    }
    [Authorize(Roles = "Admin,Teacher")]
    [HttpDelete(MaterialRouting.Prefix)]
    public async Task<IActionResult> DeleteMaterial(int materialId)
    {
        try
        {
            var result = await _materialService.DeleteAsync(materialId);
            return NewResult(result);
        }
        catch
        {
            _logger.LogInfo("Error happen when mapping or by network in GetAll Teacher");
            return NewResult(ErrorHappen.ErrorInServer());
        }
    }
    #endregion
}