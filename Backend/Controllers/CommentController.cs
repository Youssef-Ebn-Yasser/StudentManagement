namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CommentController : AppControllerBase
    {
        #region   fields
        ICommentService commentService;
        #endregion

        #region   Constructor
        public CommentController(ICommentService commentService)
        {
            this.commentService = commentService;
        }
        #endregion


        #region   Handle function


        #endregion
    }
}