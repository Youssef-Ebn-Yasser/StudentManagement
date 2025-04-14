using Backend.DTOs.LessonDTOs;
using Backend.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class LessonController : AppControllerBase
    {
        private readonly ILessonService _lessonService;

        public LessonController(ILessonService lessonService)
        {
            _lessonService = lessonService;
        }

        [HttpGet("GetLessonDetails/{lessonId}")]
        public async Task<IActionResult> GetLessonDetails(int lessonId)
        {
            var result = await _lessonService.CreateAsync(lessonId);
            return NewResult(result);
        }

        [HttpPost("CreateLesson")]
        public async Task<IActionResult> CreateLesson([FromBody] CreateLessonDto createLessonDto)
        {
            var result = await _lessonService.CreateAsync(createLessonDto);
            return NewResult(result);
        }

        [HttpPut("UpdateLesson")]
        public async Task<IActionResult> UpdateLesson([FromBody] UpdateLessonDto updateLessonDto)
        {
            var result = await _lessonService.UpdateAsync(updateLessonDto);
            return NewResult(result);
        }

        [HttpDelete("DeleteLesson/{lessonId}")]
        public async Task<IActionResult> DeleteLesson(int lessonId)
        {
            var result = await _lessonService.DeleteAsync(lessonId);
            return NewResult(result);
        }
    }
} 