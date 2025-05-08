using Backend.DTOs.AssignmentDTO;

namespace Backend.Controllers;

[Route("api/[controller]")]
[ApiController]
public class AssignmentController(IStudentAssignmentService _studentAssignmentService) : AppControllerBase
{
    [HttpGet("GetStudentAssignmentInCourse")]
    public async Task<IActionResult> UploadAssignment(int studentId, int courseId)
    {
        var result = await _studentAssignmentService.GetAllStudentAssignmentInCourse(studentId, courseId);

        return NewResult(result);

    }

    [HttpPost("upload/assignment")]
    public async Task<IActionResult> UploadAssignment(UploadAssignmentDto dto)
    {
        var result = await _studentAssignmentService.UploadAssignment(dto);

        return NewResult(result);

    }
    [HttpGet("GetStudentAssignmentForLessonId")]
    public async Task<IActionResult> GetStudentAssignmentForLesson(int LessonId)
    {
        var result = await _studentAssignmentService.GetStudentAssignmentForLessonId(LessonId);
        return NewResult(result);
    }
}