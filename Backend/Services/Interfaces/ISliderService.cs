using Backend.DTOs.SliderDTOs;

namespace Backend.Services.Interfaces;

public interface ISliderService
{
    Task<List<SliderDto>> GetAllAsync();
    Task<SliderDto> AddAsync(CreateSliderDto dto);
    Task<SliderDto> UpdateAsync(UpdateSliderDto dto);
    Task<bool> DeleteAsync(int id);
} 