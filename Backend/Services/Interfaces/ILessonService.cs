using Backend.DTOs.LessonDTOs;
using Backend.BaseResponse;

namespace Backend.Services.Interfaces;

public interface ILessonService
{
    public Task<Response<ShowLessonDetailsPage>> GetLessonAsync(int lessonId, int courseId);
    public Task<Response<List<ShowLessonDetailsPage>>> GetAll();
    public Task<Response<List<ShowLessonDetailsPage>>> GetAllLessonByCourseIdAsync(int courseId, int page = 1, int pageSize = 10);
    public Task<Response<string>> CreateAsync(CreateLessonDto createLessonDto);
    public Task<Response<string>> UpdateAsync(UpdateLessonDto createLessonDto);
    public Task<Response<string>> DeleteAsync(int lessonId);
    public Task<Response<List<ShowLessonDetailsPage>>> GetAllLessonsAsync(int page = 1, int pageSize = 10);
    public Task<Response<ShowLessonDetailsPage>> GetLessonDetailsAsync(int lessonId, int courseId);
    public Task<Response<List<ShowLessonDto>>> GetDeletedLessonsAsync(int page = 1, int pageSize = 10);
    public Task<Response<string>> CreateLessonAsync(CreateLessonDto createLessonDto);
    public Task<Response<string>> UpdateLessonAsync(UpdateLessonDto updateLessonDto);
    public Task<Response<string>> RestoreLessonAsync(int lessonId);
    public Task<Response<string>> DeleteLessonAsync(int lessonId);
}