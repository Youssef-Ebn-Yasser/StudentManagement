using Backend.DTOs.CommentDTOs;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CommentController : AppControllerBase
    {
        #region Fields
        private readonly ICommentService _commentService;
        #endregion

        #region Constructor
        public CommentController(ICommentService commentService)
        {
            _commentService = commentService;
        }
        #endregion

        #region Handle functions

        [HttpPost("create")]
        public async Task<IActionResult> Create([FromBody] CreateCommentDto createCommentDto)
        {
            var result = await _commentService.CreateAsync(createCommentDto);
            return NewResult(result);
        }

        [HttpDelete("{commentId}")]
        public async Task<IActionResult> Delete(int commentId)
        {
            var result = await _commentService.DeleteAsync(commentId);
            return NewResult(result);
        }

        [HttpGet("lesson/{lessonId}")]
        public async Task<IActionResult> GetAllByLessonId(int lessonId)
        {
            var result = await _commentService.GetAllCommentsAsync(lessonId);
            return NewResult(result);
        }

        [HttpGet("lesson/{lessonId}/student-comments")]
        public async Task<IActionResult> GetAllForStudentInLesson(int lessonId)
        {
            var result = await _commentService.GetAllCommentsForStudentInLessonAsync(lessonId);
            return NewResult(result);
        }

        #endregion
    }
}
