using Backend.DTOs.LessonDTOs;

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
        [HttpGet("Get/All/Lessons")]
        public async Task<IActionResult> GetLessonDetails()
        {
            var result = await _lessonService.GetAll();
            return NewResult(result);
        }

        [HttpGet("GetLessonDetails/{lessonId}")]
        public async Task<IActionResult> GetLessonDetails(int lessonId, int courseId)
        {
            var result = await _lessonService.GetLessonAsync(lessonId, courseId);
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