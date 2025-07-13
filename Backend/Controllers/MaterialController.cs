using Backend.DTOs.MaterialDTOs;
using Microsoft.AspNetCore.Authorization;

namespace Backend.Controllers;

[Route("api/[controller]/[action]")]
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
    [HttpGet("GetMaterialsByLessonId/{lessonId}")]
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
    [HttpPost("CreateMaterial")]
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
    [HttpPut("UpdateMaterial")]
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
    [HttpDelete("DeleteMaterial/{materialId}")]
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
}
#endregion
