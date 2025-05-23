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

    [HttpGet("Course/GetAllByCategory")]
    public async Task<IActionResult> GetAllByCategory(string categoryName)
    {
        var result = await _courseService.GetAllByCategoryAsync(categoryName);
        return NewResult(result);
    }

    [HttpGet("HomeCourses/GetPaginated")]
    public async Task<IActionResult> GetPaginated([FromQuery] int pageNumber, [FromQuery] int PageSize, [FromQuery] enOrderBy enOrderBy)
    {
        var result = await _courseService.GetPaginatedCourse(pageNumber, PageSize, enOrderBy);
        return NewResult(result);
    }

    [HttpGet("Course/Get/{id}")]
    public async Task<IActionResult> GetCourseById(int id)
    {
        var result = await _courseService.GetCourseByIdAsync(id);
        return NewResult(result);
    }
    [HttpGet("Course/GetAllCoursesOfTeacher/{teacherId}")]
    public async Task<IActionResult> GetAllCoursesOfTeacher(int teacherId)
    {
        var result = await _courseService.GetAllCoursesOfTeacherAsync(teacherId);
        return NewResult(result);
    }

    [HttpPut("Course/Update/{id}")]
    public async Task<IActionResult> Update([FromBody] UpdateCourseDto updateCourseDto)
    {

        var result = await _courseService.UpdateAsync(updateCourseDto);
        return NewResult(result);
    }

    [HttpDelete("Course/Delete/")]
    public async Task<IActionResult> Delete([FromQuery]int id)
    {
        var result = await _courseService.DeleteAsync(id);
        return NewResult(result);
    }

    [HttpGet("Course/GetCourseInfoByCategory")]
    public async Task<IActionResult> GetCourseInfoByCategory(string category)
    {
        var result = await _courseService.GetCourseInfoByCategoryAsync(category);
        return NewResult(result);
    }
}