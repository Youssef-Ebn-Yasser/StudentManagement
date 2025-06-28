using Microsoft.AspNetCore.Http;

namespace Backend.DTOs.SliderDTOs;

public class CreateSliderDto
{
    public string Content { get; set; } = string.Empty;
    public string Link { get; set; } = string.Empty;
    public IFormFile Image { get; set; }
} 