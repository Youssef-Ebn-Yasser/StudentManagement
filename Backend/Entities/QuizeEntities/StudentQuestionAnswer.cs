namespace Backend.Entities.QuizeEntities;

public class StudentQuestionAnswer
{
    public int Id { get; set; }
    public bool? IsCorrect { get; set; }
    public string? StudentAnswerText { get; set; }

    public int QuestionId { get; set; }
    public int studentQuizeAnswerId { get; set; }

    // Navigational properties
    public Question Question { get; set; }
    public StudentQuizeAnswer studentQuizeAnswer { get; set; }

    public List<StudentQuestionOption>? studentQuestionOptions { get; set; }
}