namespace Backend.Entities.QuizeEntities;

public class StudentQuizeAnswer
{
    public int Id { get; set; }
    public int StudentId { get; set; }
    public int QuizId { get; set; }
    public decimal? GradingRating { get; set; }
    public int? NumberOfAswered { get; set; }
    public bool? IsPassed { get; set; }

    public Student Student { get; set; }
    public Quiz Quiz { get; set; }
}