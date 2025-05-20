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
    public async Task<IActionResult> UploadAssignment([FromForm]UploadAssignmentDto dto)
    {
        var result = await _studentAssignmentService.UploadAssignment(dto);

        return NewResult(result);

    }
    [HttpGet("GetStudentAssignmentForLessonId")]
    public async Task<IActionResult> GetStudentAssignmentForLesson(int lessonId)
    {
        var result = await _studentAssignmentService.GetStudentAssignmentForLessonId(lessonId);
        return NewResult(result);
    }
    [HttpGet("GetAllAssignmentOfCourse")]
    public async Task<IActionResult> GetAllAssignmentOfCourse(string courseName, string studentName)
    {
        var result = await _studentAssignmentService.GetAllAssignmentOfCourse(courseName, studentName);
        return NewResult(result);
    }
}