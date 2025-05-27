namespace Backend.Entities.QuizeEntities;

public class Quiz
{
    public int Id { get; set; }
    public int LessonId { get; set; }
    public required string Title { get; set; }
    public string? Description { get; set; }
    public DateTime StartsAt { get; set; }
    public int DurationMinutes { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.Now;
    public int NumberOfQuestions { get; set; }
    public int PossiblePoints { get; set; } = 0;

    public List<Question>? questions { get; set; }
    public Lesson Lesson { get; set; }
}