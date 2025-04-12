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

    public async Task<IActionResult> Create(CreateCourseDto createCourseDto)
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
}