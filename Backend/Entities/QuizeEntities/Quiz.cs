namespace Backend.Entities.QuizeEntities;

public class Quiz
{
    public int Id { get; set; }
    public int LessonId { get; set; }
    public required string TitleEn { get; set; }
    public required string TitleAr { get; set; }
    public string? DescriptionEn { get; set; }
    public string? DescriptionAr { get; set; }
    public DateTime StartsAt { get; set; }
    public DateTime EndAtAt { get; set; }
    public int DurationMinutes { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.Now;
    public int NumberOfQuestions { get; set; }
    public int PossiblePoints { get; set; } = 0;
    public bool IsAutoCorrect { get; set; }
    public List<Question>? questions { get; set; }
    public Lesson Lesson { get; set; }
    public List<StudentQuizeAnswer> StudentQuizeAnswers { get; set; }
}