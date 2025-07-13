using Backend.DTOs.CategoryDTOOS;
using Backend.Resources;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Localization;

namespace Backend.Controllers;

[Route("api/[controller]")]
[ApiController]
public class CategoryController : AppControllerBase
{
    #region Fields
    private readonly IStringLocalizer<Messages> _localizer;
    private readonly ICategoryService _categoryService;
    private readonly IStructuredLogger _logger;
    #endregion

    #region Constructor
    public CategoryController(ICategoryService service,
                              IStringLocalizer<Messages> localizer,
                              IStructuredLogger logger)
    {
        _categoryService = service;
        _localizer = localizer;
        _logger = logger;
    }
    #endregion

    #region Method
    [HttpGet("testLocaLization")]
    public async Task<IActionResult> testLoca()
    {
        var val = GeneralLocalizableEntity.Localized("سيد سيد", "Said Said");
        return Ok(new { e = _localizer["Error_NotFound:Value"], x = val });
    }



    [HttpGet("GetAll")]
    public async Task<IActionResult> GetAll()
    {
        try
        {
            var result = await _categoryService.GetAllAsync();
            return Ok(result);
        }
        catch
        {
            _logger.LogInfo("Error happen when mapping or by network in GetAll Teacher");
            return NewResult(ErrorHappen.ErrorInServer());
        }
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        try
        {
            var result = await _categoryService.GetByIdAsync(id);
            return Ok(result);
        }
        catch
        {
            _logger.LogInfo("Error happen when mapping or by network in GetAll Teacher");
            return NewResult(ErrorHappen.ErrorInServer());
        }
    }
    [Authorize(Roles = "Admin")]
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateCategoryDto dto)
    {
        try
        {
            var result = await _categoryService.UpdateAsync(id, dto);
            return Ok(result);
        }
        catch
        {
            _logger.LogInfo("Error happen when mapping or by network in GetAll Teacher");
            return NewResult(ErrorHappen.ErrorInServer());
        }
    }
    [Authorize(Roles = "Admin")]
    [HttpDelete("Delete")]
    public async Task<IActionResult> Delete([FromBody] int id)
    {
        try
        {
            var result = await _categoryService.DeleteAsync(int.Parse(id.ToString().Trim()));
            return Ok(result);
        }
        catch
        {
            _logger.LogInfo("Error happen when mapping or by network in GetAll Teacher");
            return NewResult(ErrorHappen.ErrorInServer());
        }
    }
    [Authorize(Roles = "Admin")]
    [HttpPost("Create")]
    public async Task<IActionResult> Create([FromBody] CreateCategoryDto dto)
    {
        try
        {
            var result = await _categoryService.CreateAsync(dto);
            return Ok(result);
        }
        catch
        {
            _logger.LogInfo("Error happen when mapping or by network in GetAll Teacher");
            return NewResult(ErrorHappen.ErrorInServer());
        }
    }
    #endregion
}