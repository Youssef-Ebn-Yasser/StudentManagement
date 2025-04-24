using Backend.DTOs.CommentDTOs;

namespace Backend.Services.Interfaces;

public interface ICommentService
{
    public Task<Response<List<ShowAllCommentByLessonIdOrderByDateDto>>> GetAllCommentsAsync(int lessonId);
    public Task<Response<List<ShowAllCommentForStudentInLessonOrderByDateDto>>> GetAllCommentsForStudentInLessonAsync(int lessonId);

    public Task<Response<string>> CreateAsync(CreateCommentDto createCommentDto);
    public Task<Response<string>> DeleteAsync(int commentId);
}