using Backend.DTOs.LessonDTOs;
using Microsoft.AspNetCore.Authorization;

namespace Backend.Controllers;

[ApiController]
public class LessonController : AppControllerBase
{
    #region Fields
    private readonly ILessonService _lessonService;
    private readonly IStructuredLogger _logger;
    #endregion

    #region Constructor
    public LessonController(ILessonService lessonService, IStructuredLogger logger)
    {
        _lessonService = lessonService;
        _logger = logger;
    }
    #endregion

    #region Method
    [HttpGet(Routing.LessonRouting.GetAll)]
    public async Task<IActionResult> GetLessonDetails()
    {
        try
        {
            var result = await _lessonService.GetAll();
            return NewResult(result);
        }
        catch
        {
            _logger.LogInfo("Error happen when mapping or by network in GetAll Teacher");
            return NewResult(ErrorHappen.ErrorInServer());
        }
    }

    [HttpGet(Routing.LessonRouting.Prefix)]
    public async Task<IActionResult> GetLessonDetails(int lessonId, int courseId)
    {
        try
        {
            var result = await _lessonService.GetLessonAsync(lessonId, courseId);
            return NewResult(result);
        }
        catch
        {
            _logger.LogInfo("Error happen when mapping or by network in GetAll Teacher");
            return NewResult(ErrorHappen.ErrorInServer());
        }
    }

    [Authorize(Roles = "Admin,Teacher")]
    [HttpPost(Routing.LessonRouting.Prefix)]
    public async Task<IActionResult> CreateLesson([FromBody] CreateLessonDto createLessonDto)
    {
        try
        {
            var result = await _lessonService.CreateAsync(createLessonDto);
            return NewResult(result);
        }
        catch
        {
            _logger.LogInfo("Error happen when mapping or by network in GetAll Teacher");
            return NewResult(ErrorHappen.ErrorInServer());
        }
    }

    [Authorize(Roles = "Admin,Teacher")]
    [HttpPut(Routing.LessonRouting.Prefix)]
    public async Task<IActionResult> UpdateLesson([FromBody] UpdateLessonDto updateLessonDto)
    {
        try
        {
            var result = await _lessonService.UpdateAsync(updateLessonDto);
            return NewResult(result);
        }
        catch
        {
            _logger.LogInfo("Error happen when mapping or by network in GetAll Teacher");
            return NewResult(ErrorHappen.ErrorInServer());
        }
    }

    [Authorize(Roles = "Admin,Teacher")]
    [HttpDelete(Routing.LessonRouting.Prefix)]
    public async Task<IActionResult> DeleteLesson(int lessonId)
    {
        try
        {
            var result = await _lessonService.DeleteAsync(lessonId);
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