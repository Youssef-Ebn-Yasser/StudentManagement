using Backend.DTOs.MaterialDTOs;

namespace Backend.Services.Interfaces;

public interface IMaterialService
{
    public Task<Response<List<ShowMaterialDto>>> GetAllMaterialByLessonIdAsync(int lessonId);

    public Task<Response<string>> UploadLink(UploadLinkDto uploadLinkDto);
    public Task<Response<string>> CreateAsync(CreateMaterialDto createMaterialDto);
    public Task<Response<string>> UpdateAsync(UpdateMaterialDto createMaterialDto);
    public Task<Response<string>> DeleteAsync(int lessonId);
}