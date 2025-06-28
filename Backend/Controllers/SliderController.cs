using Backend.DTOs.SliderDTOs;
using Backend.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers;

[Route("api/[controller]")]
[ApiController]
public class SliderController : ControllerBase
{
    private readonly ISliderService _sliderService;
    public SliderController(ISliderService sliderService)
    {
        _sliderService = sliderService;
    }

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