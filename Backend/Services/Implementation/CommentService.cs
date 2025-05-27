using Backend.DTOs.CommentDTOs;

namespace Backend.Services.Implementation;

public class CommentService : ResponseHandler, ICommentService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public CommentService(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<Response<string>> CreateAsync(CreateCommentDto createCommentDto)
    {
        // Check if student and lesson exist
        var student = await _unitOfWork.Repository<Student>().GetByIdAsync(createCommentDto.StudentId);
        var lesson = await _unitOfWork.Repository<Lesson>().GetByIdAsync(createCommentDto.LessonId);

        if (student == null || lesson == null)
            return NotFound<string>("Student or Lesson not found.");

        var comment = new Comment
        {
            Content = createCommentDto.Content,
            LessonId = createCommentDto.LessonId,
            StudentId = createCommentDto.StudentId,
            CourseId = createCommentDto.CourseId,
            CreatedAt = DateTime.UtcNow
        };

        await _unitOfWork.Repository<Comment>().AddAsync(comment);
        var response = _unitOfWork.Complete();
        if (response > 0)
            return Success("Comment created successfully.");
        return BadRequest<string>("Faild");
    }

    public async Task<Response<string>> DeleteAsync(int commentId)
    {
        var comment = await _unitOfWork.Repository<Comment>().GetByIdAsync(commentId);
        if (comment == null)
            return NotFound<string>("Comment not found.");

        _unitOfWork.Repository<Comment>().Delete(comment);
        _unitOfWork.Complete();

        return Success("Comment deleted successfully.");
    }

    public async Task<Response<List<ShowAllCommentByLessonIdOrderByDateDto>>> GetAllCommentsAsync(int lessonId)
    {
        var comments = await _unitOfWork.Repository<Comment>().GetTableNoTracking()
            .Where(c => c.LessonId == lessonId)
            .Include(c => c.Student)
            .OrderByDescending(c => c.CreatedAt)
            .ToListAsync();

        var result = comments.Select(c => new ShowAllCommentByLessonIdOrderByDateDto
        {
            Id = c.Id,
            Content = c.Content,
            StudentName = c.Student != null ? c.Student.Name : "Unknown"
        }).ToList();

        return Success(result);
    }

    public async Task<Response<List<ShowAllCommentForStudentInLessonOrderByDateDto>>> GetAllCommentsForStudentInLessonAsync(int lessonId)
    {
        var comments = await _unitOfWork.Repository<Comment>().GetTableNoTracking()
            .Where(c => c.LessonId == lessonId)
            .Include(c => c.Student)
            .OrderByDescending(c => c.CreatedAt)
            .ToListAsync();

        var result = comments.Select(c => new ShowAllCommentForStudentInLessonOrderByDateDto
        {
            Id = c.Id,
            Content = c.Content,
            StudentName = c.Student != null ? c.Student.Name : "Unknown"
        }).ToList();

        return Success(result);
    }
}