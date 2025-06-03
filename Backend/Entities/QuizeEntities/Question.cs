namespace Backend.Entities.QuizeEntities;

public class Question
{
    [Key] public int Id { get; set; }
    public int? QuizId { get; set; }
    public int? CourseId { get; set; }
    public required string QuestionText { get; set; }
    public QuestionType QuestionTypeId { get; set; }
    public int QuestionNumber { get; set; }
    public int Points { get; set; }
    public string? CorrectAnswer { get; set; }
    public bool IsMultiAnswer { get; set; }
    public bool IsQuestionBank { get; set; }
    public bool IsQuestionBankUsed { get; set; }

    public Course? Course { get; set; }
    public Quiz? Quiz { get; set; }
    public List<QuestionOption>? Options { get; set; }
}


public enum QuestionType { MCQ = 1, Text = 2 };