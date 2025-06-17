using Backend.DTOs.CommentDTOs;
using System.Globalization;

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



        var comment = new Comment {};
    CultureInfo cultureInfo = Thread.CurrentThread.CurrentCulture;

        if (cultureInfo.TwoLetterISOLanguageName.ToLower().Equals("ar"))
        {
            comment.ContentAr = createCommentDto.Content;
            comment.LessonId = createCommentDto.LessonId;
            comment.StudentId = createCommentDto.StudentId;
            comment.CourseId = createCommentDto.CourseId;
            comment.CreatedAt = DateTime.UtcNow;
        }
        else
        {
            comment.ContentEn = createCommentDto.Content;
            comment.LessonId = createCommentDto.LessonId;
            comment.StudentId = createCommentDto.StudentId;
            comment.CourseId = createCommentDto.CourseId;
            comment.CreatedAt = DateTime.UtcNow;
        }
        

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
            Content = GeneralLocalizableEntity.Localized(c.ContentAr,c.ContentEn),
            StudentName = c.Student != null ? GeneralLocalizableEntity.Localized(c.Student.NameAr, c.Student.NameEn) : "Unknown"
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
            Content = GeneralLocalizableEntity.Localized(c.ContentAr,c.ContentEn),
            StudentName = c.Student != null ? GeneralLocalizableEntity.Localized(c.Student.NameAr, c.Student.NameEn) : "Unknown"
        }).ToList();

        return Success(result);
    }
}