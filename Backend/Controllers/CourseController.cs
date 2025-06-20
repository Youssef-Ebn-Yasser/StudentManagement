namespace Backend.Controllers;

[ApiController]
public class CourseController : AppControllerBase
{
    #region Fields
    private readonly ICourseService _courseService;
    private readonly IStructuredLogger _logger;
    #endregion

    #region Constructor
    public CourseController(ICourseService courseService, IStructuredLogger logger)
    {
        _courseService = courseService;
        _logger = logger;
    }
    #endregion

    #region Method

    [HttpGet("Course/GetAll")]
    public async Task<IActionResult> GetAll()
    {
        try
        {
            var result = await _courseService.GetAllAsync();
            return NewResult(result);
        }
        catch
        {
            _logger.LogInfo("Error happen when mapping or by network in GetAll Teacher");
            return NewResult(ErrorHappen.ErrorInServer());
        }
    }

    [HttpGet("Course/GetAllByCategory")]
    public async Task<IActionResult> GetAllByCategory(int categoryId)
    {
        try
        {
            var result = await _courseService.GetAllByCategoryAsync(categoryId);
            return NewResult(result);
        }
        catch
        {
            _logger.LogInfo("Error happen when mapping or by network in GetAll Teacher");
            return NewResult(ErrorHappen.ErrorInServer());
        }
    }

    [HttpGet("HomeCourses/GetPaginated")]
    public async Task<IActionResult> GetPaginated([FromQuery] int pageNumber, [FromQuery] int PageSize, [FromQuery] enOrderBy enOrderBy)
    {
        try
        {
            var result = await _courseService.GetPaginatedCourse(pageNumber, PageSize, enOrderBy);
            return NewResult(result);
        }
        catch
        {
            _logger.LogInfo("Error happen when mapping or by network in GetAll Teacher");
            return NewResult(ErrorHappen.ErrorInServer());
        }
    }

    [HttpGet("Course/Get/{id}")]
    public async Task<IActionResult> GetCourseById(int id)
    {
        try
        {
            var result = await _courseService.GetCourseByIdAsync(id);
            return NewResult(result);
        }
        catch
        {
            _logger.LogInfo("Error happen when mapping or by network in GetAll Teacher");
            return NewResult(ErrorHappen.ErrorInServer());
        }
    }
    [HttpGet("Course/GetAllCoursesOfTeacher/{teacherId}")]
    public async Task<IActionResult> GetAllCoursesOfTeacher(int teacherId)
    {
        try
        {
            var result = await _courseService.GetAllCoursesOfTeacherAsync(teacherId);
            return NewResult(result);
        }
        catch
        {
            _logger.LogInfo("Error happen when mapping or by network in GetAll Teacher");
            return NewResult(ErrorHappen.ErrorInServer());
        }
    }
    [HttpPost("Course/Create")]
    public async Task<IActionResult> Create(CreateCourseDto createCourseDto)
    {
        try
        {
            var result = await _courseService.CreateAsync(createCourseDto);
            return NewResult(result);
        }
        catch
        {
            _logger.LogInfo("Error happen when mapping or by network in GetAll Teacher");
            return NewResult(ErrorHappen.ErrorInServer());
        }
    }

    [HttpPut("Course/Update/{id}")]
    public async Task<IActionResult> Update([FromBody] UpdateCourseDto updateCourseDto)
    {
        try
        {
            var result = await _courseService.UpdateAsync(updateCourseDto);
            return NewResult(result);
        }
        catch
        {
            _logger.LogInfo("Error happen when mapping or by network in GetAll Teacher");
            return NewResult(ErrorHappen.ErrorInServer());
        }
    }

    [HttpDelete("Course/Delete/")]
    public async Task<IActionResult> Delete([FromQuery] int id)
    {
        try
        {
            var result = await _courseService.DeleteAsync(id);
            return NewResult(result);
        }
        catch
        {
            _logger.LogInfo("Error happen when mapping or by network in GetAll Teacher");
            return NewResult(ErrorHappen.ErrorInServer());
        }
    }
    #endregion
}