
using Backend.DTOs.AssignmentDTOs;

namespace Backend.Services.Interfaces;

public interface IAssignmentService
{
    // Removed duplicate method declaration to fix CS0111  
    Task<int> UploadAssignmentAsync(UploadAssignmentDto uploadDto);
    Task<IEnumerable<StudentDegreeDto>> GetStudentDegreesByLessonAsync(int lessonId);
    Task<IEnumerable<AssignmentSummaryDto>> GetAssignmentsToCorrectAsync(int lessonId);
    Task<AssignmentDetailDto> GetAssignmentDetailAsync(int studentAssignmentId);
    Task UpdateAssignmentDegreeAsync(int studentAssignmentId, int degree);
}
