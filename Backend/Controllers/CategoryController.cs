using Backend.DTOs.CategoryDTOOS;
using Backend.Resources;
using Microsoft.Extensions.Localization;

namespace Backend.Controllers;

[Route("api/[controller]")]
[ApiController]
public class CategoryController : ControllerBase
{
    private readonly IStringLocalizer<Messages> _localizer;
    private readonly ICategoryService _categoryService;
    public CategoryController(ICategoryService service, IStringLocalizer<Messages> localizer)
    {
        _categoryService = service;
        _localizer = localizer;
    }

    [HttpGet("testLocaLization")]
    public async Task<IActionResult> testLoca()
    {
        var val = GeneralLocalizableEntity.Localized("سيد سيد", "Said Said");
        return Ok(new { e = _localizer["Error_NotFound:Value"], x = val });
    }



    [HttpGet("GetAll")]
    public async Task<IActionResult> GetAll()
    {
        var result = await _categoryService.GetAllAsync();
        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var result = await _categoryService.GetByIdAsync(id);
        return Ok(result);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateCategoryDto dto)
    {
        var result = await _categoryService.UpdateAsync(id, dto);
        return Ok(result);
    }

    [HttpDelete("Delete")]
    public async Task<IActionResult> Delete([FromBody] int id)
    {
        var result = await _categoryService.DeleteAsync(int.Parse(id.ToString().Trim()));
        return Ok(result);
    }

    [HttpPost("Create")]
    public async Task<IActionResult> Create([FromBody] CreateCategoryDto dto)
    {
        var result = await _categoryService.CreateAsync(dto);
        return Ok(result);
    }
}
