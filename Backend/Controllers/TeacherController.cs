using Microsoft.AspNetCore.Authorization;
using static Backend.Services.Interfaces.ITeacherService;

namespace Backend.Controllers;


[ApiController]
public class TeacherController : AppControllerBase
{
    #region Fields
    private readonly ITeacherService _teacherService;
    private readonly IStructuredLogger _logger;
    #endregion

    #region Constructor
    public TeacherController(ITeacherService teacherService, IStructuredLogger logger)
    {
        _teacherService = teacherService;
        _logger = logger;
    }
    #endregion

    #region Method
    [HttpGet(Routing.TeacherRouting.Prefix)]
    public async Task<IActionResult> GetTeacherById(int id)
    {
        try
        {
            var result = await _teacherService.GetByIdAsync(id);
            return NewResult(result);
        }
        catch
        {
            _logger.LogInfo("Error happen when mapping or by network in GetTeacherById");
            return NewResult(ErrorHappen.ErrorInServer());
        }
    }


    [HttpGet(Routing.TeacherRouting.GetAll)]
    public async Task<IActionResult> GetAll()
    {
        try
        {
            var result = await _teacherService.GetAllAsync();
            return NewResult(result);
        }
        catch
        {
            _logger.LogInfo("Error happen when mapping or by network in GetAll Teacher");
            return NewResult(ErrorHappen.ErrorInServer());
        }
    }


    [HttpGet(Routing.TeacherRouting.GetPaginated)]
    public async Task<IActionResult> GetAllPaginated(int pageNumber, int pageSize, enTeacherOrderBy enTeacherOrderBy)
    {
        try
        {
            var result = await _teacherService.GetAllPaginatedAsync(pageNumber, pageSize, enTeacherOrderBy);
            return Ok(result);
        }
        catch
        {
            _logger.LogInfo("Error happen when mapping or by network in GetAllPaginated Teacher");
            return NewResult(ErrorHappen.ErrorInServer());
        }
    }


    [HttpGet(Routing.TeacherRouting.GetByName)]
    public async Task<IActionResult> GetTeacherByName(string name)
    {
        try
        {
            var result = await _teacherService.GetByNameAsync(name);

            return NewResult(result);
        }
        catch
        {
            _logger.LogInfo("Error happen when mapping or by network in GetTeacherByName");
            return NewResult(ErrorHappen.ErrorInServer());
        }
    }

    [Authorize(Roles = "Admin,Teacher")]
    [HttpPut(Routing.TeacherRouting.Prefix)]
    public async Task<IActionResult> Update(UpdateTeacherDto updateTeacherDto)
    {
        try
        {
            var result = await _teacherService.UpdateAsync(updateTeacherDto);

            return NewResult(result);
        }
        catch
        {
            _logger.LogInfo("Error happen when mapping or by network in Update Teacher");
            return NewResult(ErrorHappen.ErrorInServer());
        }
    }

    [Authorize(Roles = "Admin")]
    [HttpDelete(Routing.TeacherRouting.Prefix)]
    public async Task<IActionResult> DeleteAll(int id)
    {
        try
        {
            var result = await _teacherService.DeleteAsync(id);

            return NewResult(result);
        }
        catch
        {
            _logger.LogInfo("Error happen when mapping or by network in Teacher");
            return NewResult(ErrorHappen.ErrorInServer());
        }
    }
    #endregion
}