using Backend.DTOs.AssignmentDTO;
using static Backend.Services.Implementation.StudentAssignmentService;

namespace Backend.Services.Interfaces;

public interface IStudentAssignmentService
{
    public Task<Response<string>> UploadAssignment(UploadAssignmentDto assignment);
    public Task<Response<List<StudentAssignmentCourseDto>>> GetAllStudentAssignmentInCourse(int studentId, int courseId);
    public Task<Response<AssignmentStudentDto>> GetStudentAssignmentForLessonId(int lessonId);

}