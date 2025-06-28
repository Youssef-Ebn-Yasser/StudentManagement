using Microsoft.AspNetCore.Http;

namespace Backend.DTOs.SliderDTOs;

public class UpdateSliderDto
{
    public int Id { get; set; }
    public string Content { get; set; } = string.Empty;
    public string Link { get; set; } = string.Empty;
    public IFormFile? Image { get; set; }
} 