namespace Backend.Entities.QuizeEntities;

public class StudentQuestionOption
{
    public int Id { get; set; }
    public int StudentQuestionAnswerId { get; set; }
    public int QuestionOptionId { get; set; }
    public bool? IsCorrect { get; set; }

    public QuestionOption QuestionOption { get; set; }
    public StudentQuestionAnswer StudentQuestionAnswer { get; set; }
}