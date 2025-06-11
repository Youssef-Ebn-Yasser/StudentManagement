using Backend.Entities.QuizeEntities;

namespace Backend.DTOs.QuizeDTOs;

public class CreateQuizeWithQuestionDto
{
    public int LessonId { get; set; }
    public required string Title { get; set; }
    public string? Description { get; set; }
    public DateTime StartsAt { get; set; }
    public int DurationMinutes { get; set; }
    public bool IsAutoCorrect { get; set; }
    public List<QuestionListDto> questionListDtos { get; set; }
}

public class QuestionListDto
{
    public required string QuestionText { get; set; }
    public QuestionType QuestionTypeId { get; set; }
    public int Points { get; set; }
    public string? CorrectAnswer { get; set; }
    public Dictionary<string, bool>? Options { get; set; }
}