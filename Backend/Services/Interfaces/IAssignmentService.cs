
using Backend.DTOs.AssignmentDTOs;

namespace Backend.Services.Interfaces;

public interface IAssignmentService
{
    Task<List<AssignmentListItemDto>> GetByLessonAsync(int lessonId);
    Task<AssignmentDetailDto> GetDetailAsync(int studentAssignmentId);
    Task<bool> UpdateDegreeAsync(int studentAssignmentId, int degree);
}
