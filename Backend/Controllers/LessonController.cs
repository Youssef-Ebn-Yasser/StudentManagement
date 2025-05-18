using Backend.DTOs.LessonDTOs;
using Backend.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Backend.BaseResponse;
using Backend.Entities;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LessonController : AppControllerBase
    {
        private readonly ILessonService _lessonService;
        private readonly ResponseHandler _responseHandler;
        private const int DefaultPageSize = 10;

        public LessonController(ILessonService lessonService, ResponseHandler responseHandler)
        {
            _lessonService = lessonService;
            _responseHandler = responseHandler;
        }

        // GET endpoints
        [HttpGet("Get/All/Lessons")]
        public async Task<IActionResult> GetAllLessons([FromQuery] int page = 1, [FromQuery] int pageSize = DefaultPageSize)
        {
            var result = await _lessonService.GetAllLessonsAsync(page, pageSize);
            return NewResult<List<ShowLessonDetailsPage>>(result);
        }

        [HttpGet("GetLessonDetails/{lessonId}/{courseId}")]
        public async Task<IActionResult> GetLessonDetails(int lessonId, int courseId)
        {
            var result = await _lessonService.GetLessonDetailsAsync(lessonId, courseId);
            return NewResult<ShowLessonDetailsPage>(result);
        }

        [HttpGet("GetLessonsByCourseId/{courseId}")]
        public async Task<IActionResult> GetLessonsByCourseId(int courseId, [FromQuery] int page = 1, [FromQuery] int pageSize = DefaultPageSize)
        {
            var result = await _lessonService.GetAllLessonByCourseIdAsync(courseId, page, pageSize);
            return NewResult<List<ShowLessonDetailsPage>>(result);
        }

        [HttpGet("GetDeletedLessons")]
        public async Task<IActionResult> GetDeletedLessons([FromQuery] int page = 1, [FromQuery] int pageSize = DefaultPageSize)
        {
            var result = await _lessonService.GetDeletedLessonsAsync(page, pageSize);
            return NewResult<List<ShowLessonDto>>(result);
        }

        // POST endpoints
        [HttpPost("CreateLesson")]
        public async Task<IActionResult> CreateLesson([FromBody] CreateLessonDto createLessonDto)
        {
            var result = await _lessonService.CreateLessonAsync(createLessonDto);
            return NewResult<string>(result);
        }

        // PUT endpoints
        [HttpPut("UpdateLesson")]
        public async Task<IActionResult> UpdateLesson([FromBody] UpdateLessonDto updateLessonDto)
        {
            var result = await _lessonService.UpdateLessonAsync(updateLessonDto);
            return NewResult<string>(result);
        }

        [HttpPut("RestoreLesson/{lessonId}")]
        public async Task<IActionResult> RestoreLesson(int lessonId)
        {
            var result = await _lessonService.RestoreLessonAsync(lessonId);
            return NewResult<string>(result);
        }

        // DELETE endpoints
        [HttpDelete("DeleteLesson/{lessonId}")]
        public async Task<IActionResult> DeleteLesson(int lessonId)
        {
            var result = await _lessonService.DeleteLessonAsync(lessonId);
            return NewResult<string>(result);
        }
    }
} 