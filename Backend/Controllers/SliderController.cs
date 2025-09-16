using Backend.DTOs.SliderDTOs;
using Microsoft.AspNetCore.Authorization;

namespace Backend.Controllers;

[Authorize(Roles = "Admin")]
[Route("api/[controller]")]
[ApiController]
public class SliderController : ControllerBase
{
    private readonly ISliderService _sliderService;
    public SliderController(ISliderService sliderService)
    {
        _sliderService = sliderService;
    }

    [AllowAnonymous]
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var result = await _sliderService.GetAllAsync();
        return Ok(result);
    }

    [HttpPost]
    public async Task<IActionResult> Add([FromForm] CreateSliderDto dto)
    {
        var result = await _sliderService.AddAsync(dto);
        return Ok(result);
    }

    [HttpPut]
    public async Task<IActionResult> Update([FromForm] UpdateSliderDto dto)
    {
        var result = await _sliderService.UpdateAsync(dto);
        return Ok(result);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var result = await _sliderService.DeleteAsync(id);
        if (!result) return NotFound();
        return Ok();
    }
}