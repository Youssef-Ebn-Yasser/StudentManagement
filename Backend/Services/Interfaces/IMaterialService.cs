using Backend.DTOs.MaterialDTOs;
using Backend.BaseResponse;
using Microsoft.AspNetCore.Http;

namespace Backend.Services.Interfaces;

public interface IMaterialService
{
    public Task<Response<List<ShowMaterialDto>>> GetAllMaterialByLessonIdAsync(int lessonId, int page = 1, int pageSize = 10);
    public Task<Response<string>> CreateAsync(CreateMaterialDto createMaterialDto);
    public Task<Response<string>> UpdateAsync(UpdateMaterialDto createMaterialDto);
    public Task<Response<string>> DeleteAsync(int lessonId);
    public Task<Response<List<ShowMaterialDto>>> GetMaterialsByLessonIdAsync(int lessonId, int page = 1, int pageSize = 10);
    public Task<Response<List<ShowMaterialDto>>> GetDeletedMaterialsAsync(int page = 1, int pageSize = 10);
    public Task<Response<string>> CreateMaterialAsync(CreateMaterialDto createMaterialDto, IFormFile? file);
    public Task<Response<string>> UpdateMaterialAsync(UpdateMaterialDto updateMaterialDto, IFormFile? file);
    public Task<Response<string>> RestoreMaterialAsync(int materialId);
    public Task<Response<string>> DeleteMaterialAsync(int materialId);
}