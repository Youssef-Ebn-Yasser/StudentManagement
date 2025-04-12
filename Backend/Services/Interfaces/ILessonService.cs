using Backend.DTOs.LessonDTOs;

namespace Backend.Services.Interfaces;

public interface ILessonService
{
    public Task<Response<ShowLessonDetailsPage>> CreateAsync(int lessonId);
    public Task<Response<string>> CreateAsync(CreateLessonDto createLessonDto);
    public Task<Response<string>> UpdateAsync(UpdateLessonDto createLessonDto);
    public Task<Response<string>> DeleteAsync(int lessonId);
}