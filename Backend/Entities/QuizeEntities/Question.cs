namespace Backend.Entities.QuizeEntities;

public class Question
{
    public Guid Id { get; set; }
    public int QuizId { get; set; }
    public required string QuestionText { get; set; }
    public QuestionType QuestionTypeId { get; set; }
    public int Points { get; set; }
    public string? CorrectAnswer { get; set; }

    public Quiz Quiz { get; set; }
    public List<QuestionOption>? Options { get; set; }
}


public enum QuestionType { MCQ = 1, Text = 2 };