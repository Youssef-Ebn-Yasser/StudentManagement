using Backend.DTOs.CommentDTOs;

namespace Backend.Controllers;

[ApiController]
public class CommentController : AppControllerBase
{
    #region Fields
    private readonly ICommentService _commentService;
    private readonly IStructuredLogger _logger;
    #endregion

    #region Constructor
    public CommentController(ICommentService commentService, IStructuredLogger logger)
    {
        _commentService = commentService;
        _logger = logger;
    }
    #endregion

    #region Handle functions
    [HttpGet(Routing.CommentRouting.Prefix)]
    public async Task<IActionResult> GetAllByLessonId(int lessonId)
    {
        var result = await _commentService.GetAllCommentsAsync(lessonId);
        return NewResult(result);
    }

    [HttpGet(Routing.CommentRouting.ForStudent)]
    public async Task<IActionResult> GetAllForStudentInLesson(int lessonId)
    {
        var result = await _commentService.GetAllCommentsForStudentInLessonAsync(lessonId);
        return NewResult(result);
    }

    [HttpPost(Routing.CommentRouting.Prefix)]
    public async Task<IActionResult> Create([FromBody] CreateCommentDto createCommentDto)
    {
        var result = await _commentService.CreateAsync(createCommentDto);
        return NewResult(result);
    }

    [HttpDelete(Routing.CommentRouting.Prefix)]
    public async Task<IActionResult> Delete(int commentId)
    {
        var result = await _commentService.DeleteAsync(commentId);
        return NewResult(result);
    }
    #endregion
}
