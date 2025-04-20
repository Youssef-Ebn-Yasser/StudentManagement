using Backend.DTOs.CommentDTOs;

namespace Backend.Services.Implementation
{
    public class CommentService : ResponseHandler, ICommentService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public CommentService(IUnitOfWork unitOfWork,IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public Task<Response<string>> CreateAsync(CreateCommentDto createCommentDto)
        {
            throw new NotImplementedException();
        }

        public Task<Response<string>> DeleteAsync(int commentId)
        {
            throw new NotImplementedException();
        }

        public Task<Response<List<ShowAllCommentByLessonIdOrderByDateDto>>> GetAllCommentsAsync(int lessonId)
        {
            throw new NotImplementedException();
        }

        public Task<Response<List<ShowAllCommentForStudentInLessonOrderByDateDto>>> GetAllCommentsForStudentInLessonAsync(int lessonId)
        {
            throw new NotImplementedException();
        }
    }
}
