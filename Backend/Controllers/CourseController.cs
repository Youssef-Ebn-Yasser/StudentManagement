using Backend.Models.Enums;
using Microsoft.AspNetCore.Authorization;

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

    [HttpGet(Routing.CourseRouting.GetAll)]
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

    [HttpGet(Routing.CourseRouting.GetDependenciesForAddCourse)]
    public async Task<IActionResult> GetDependenciesForAddCourse()
    {
        try
        {
            var result = await _courseService.GetDependenciesForAddCourse();
            return NewResult(result);
        }
        catch
        {
            _logger.LogInfo("Error happen  by network in GetDependenciesForAddCourse Teacher");
            return NewResult(ErrorHappen.ErrorInServer());
        }
    }



    [HttpGet(Routing.CourseRouting.GetAllByCategory)]
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



    [HttpGet(Routing.CourseRouting.GetPaginated)]
    public async Task<IActionResult> GetPaginated([FromQuery] int pageNumber, [FromQuery] int PageSize, [FromQuery] enOrderBy enOrderBy, EnFilterBy? filterBy = null, string? value = null)
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



    [HttpGet(Routing.CourseRouting.Prefix)]
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



    [HttpGet(Routing.CourseRouting.GetAllCoursesOfTeacher)]
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


    [HttpGet(Routing.CourseRouting.GetAllStudentAndCourse)]
    public async Task<IActionResult> GetAllStudentAndCourse()
    {
        try
        {
            var result = await _courseService.GetAllStudentAndCourse();
            return NewResult(result);
        }
        catch
        {
            _logger.LogInfo("Error happen when mapping or by network in GetAll Teacher");
            return NewResult(ErrorHappen.ErrorInServer());
        }
    }


    [Authorize(Roles = "Admin,Teacher")]
    [HttpPost(Routing.CourseRouting.Prefix)]
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



    [Authorize(Roles = "Admin,Teacher")]
    [HttpPut(Routing.CourseRouting.Prefix)]
    public async Task<IActionResult> Update(UpdateCourseDto updateCourseDto)
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



    [Authorize(Roles = "Admin,Teacher")]
    [HttpDelete(Routing.CourseRouting.Prefix)]
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