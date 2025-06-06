using Backend.DTOs.AssignmentDTOs;

[ApiController]
[Route("api/[controller]")]
public class AssignmentController : ControllerBase
{
    private readonly IAssignmentService _assignmentService;

    public AssignmentController(IAssignmentService assignmentService)
    {
        _assignmentService = assignmentService;
    }

    /// <summary>
    /// GET api/assignment/lesson/{lessonId}/grades
    /// Returns a list of (studentId, degree) for all StudentAssignments in that lesson.
    /// </summary>
    [HttpGet("lesson/{lessonId}/grades")]
    public async Task<IActionResult> GetStudentDegreesByLesson(int lessonId)
    {
        var list = await _assignmentService.GetStudentDegreesByLessonAsync(lessonId);
        return Ok(list);
    }

    /// <summary>
    /// GET api/assignment/lesson/{lessonId}
    /// Returns (studentAssignmentId, studentName) for a given lesson.
    /// </summary>
    [HttpGet("lesson/{lessonId}")]
    public async Task<IActionResult> GetAssignmentsToCorrect(int lessonId)
    {
        var result = await _assignmentService.GetAssignmentsToCorrectAsync(lessonId);
        return Ok(result);
    }

    /// <summary>
    /// GET api/assignment/{studentAssignmentId}
    /// Returns detail for one StudentAssignment: (studentName, lessonName, courseName, degree, filePath).
    /// </summary>
    [HttpGet("{studentAssignmentId}")]
    public async Task<IActionResult> GetAssignmentDetail(int studentAssignmentId)
    {
        try
        {
            var dto = await _assignmentService.GetAssignmentDetailAsync(studentAssignmentId);
            return Ok(dto);
        }
        catch (KeyNotFoundException)
        {
            return NotFound(new { Message = $"Assignment with ID {studentAssignmentId} not found." });
        }
    }

    /// <summary>
    /// PUT api/assignment/{studentAssignmentId}/degree
    /// Body: { "degree": 85 }
    /// Updates the degree of the given StudentAssignment.
    /// </summary>
    [HttpPut("{studentAssignmentId}/degree")]
    public async Task<IActionResult> UpdateAssignmentDegree(
        int studentAssignmentId,
        [FromBody] UpdateAssignmentDegreeDto updateDto)
    {
        if (updateDto == null)
            return BadRequest(new { Message = "Degree payload is required." });

        try
        {
            await _assignmentService.UpdateAssignmentDegreeAsync(studentAssignmentId, updateDto.Degree);
            return NoContent();
        }
        catch (KeyNotFoundException)
        {
            return NotFound(new { Message = $"Assignment with ID {studentAssignmentId} not found." });
        }
    }

    /// <summary>
    /// POST api/assignment
    /// Uploads a new assignment file for a given lesson & student.
    /// Expects multipart/form-data:
    ///   - lessonId (int)
    ///   - studentId (int)
    ///   - file (IFormFile)
    /// Returns: 201 Created, with { AssignmentId = newId }.
    /// </summary>
    [HttpPost]
    [DisableRequestSizeLimit]
    public async Task<IActionResult> UploadAssignment([FromForm] UploadAssignmentDto uploadDto)
    {
        if (uploadDto.File == null || uploadDto.File.Length == 0)
            return BadRequest(new { Message = "A non-empty file is required." });

        try
        {
            var newId = await _assignmentService.UploadAssignmentAsync(uploadDto);
            return CreatedAtAction(
                nameof(GetAssignmentDetail),
                new { studentAssignmentId = newId },
                new { AssignmentId = newId }
            );
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { ex.Message });
        }
        catch (Exception ex)
        {
            return StatusCode(StatusCodes.Status500InternalServerError,
                new { Message = "Could not save assignment file.", Detail = ex.Message });
        }
    }
}