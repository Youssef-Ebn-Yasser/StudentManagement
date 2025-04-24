namespace Backend.Controllers;

[ApiController]
public class CourseController : AppControllerBase
{

    private readonly ICourseService _courseService;
    public CourseController(ICourseService courseService)
    {
        _courseService = courseService;
    }

    [HttpPost("Course/Create")]

    public async Task<IActionResult> Create([FromBody] CreateCourseDto createCourseDto)
    {
        var result = await _courseService.CreateAsync(createCourseDto);
        return NewResult(result);
    }

    [HttpGet("Course/GetAll")]
    public async Task<IActionResult> GetAll()
    {
        var result = await _courseService.GetAllAsync();
        return NewResult(result);
    }


    [HttpGet("Course/Get/{id}")]
    public async Task<IActionResult> GetCourseById(int id)
    {
        var result = await _courseService.GetCourseByIdAsync(id);
        return NewResult(result);
    }

    [HttpPut("Course/Update/{id}")]
    public async Task<IActionResult> Update([FromBody] UpdateCourseDto updateCourseDto)
    {

        var result = await _courseService.UpdateAsync(updateCourseDto);
        return NewResult(result);
    }

    [HttpDelete("Course/Delete/{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var result = await _courseService.DeleteAsync(id);
        return NewResult(result);
    }
}