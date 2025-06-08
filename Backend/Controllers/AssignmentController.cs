using Backend.DTOs.AssignmentDTOs;
[ApiController]
[Route("api/[controller]")]
public class AssignmentsController : ControllerBase
{
    private readonly IAssignmentService _assignmentService;

    public AssignmentsController(IAssignmentService assignmentService)
    {
        _assignmentService = assignmentService;
    }

    [HttpGet("by-lesson/{lessonId}")]
    public async Task<IActionResult> GetByLesson(int lessonId)
    {
        var result = await _assignmentService.GetByLessonAsync(lessonId);
        return Ok(result);
    }

    [HttpGet("{studentAssignmentId}")]
    public async Task<IActionResult> GetDetail(int studentAssignmentId)
    {
        var result = await _assignmentService.GetDetailAsync(studentAssignmentId);
        return Ok(result);
    }

    [HttpPut("{studentAssignmentId}/grade")]
    public async Task<IActionResult> UpdateGrade(int studentAssignmentId, [FromBody] UpdateAssignmentDegreeDto dto)
    {
        await _assignmentService.UpdateDegreeAsync(studentAssignmentId, dto.Degree);
        return Ok(new { success = true });
    }
}
