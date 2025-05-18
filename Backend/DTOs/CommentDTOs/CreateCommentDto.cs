namespace Backend.DTOs.CommentDTOs;

public class CreateCommentDto
{
    public string? Content { get; set; }
    public int LessonId { get; set; }
    public int StudentId { get; set; }
    public int CourseId { get; set; }
}