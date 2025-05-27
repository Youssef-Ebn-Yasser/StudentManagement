namespace Backend.DTOs.QuizeDTOs;

public class GetQuizeDto
{
    public int Id { get; set; }
    public required string Title { get; set; }
    public string? Description { get; set; }
    public DateTime StartsAt { get; set; }
    public int DurationMinutes { get; set; }
    public DateTime EndAt { get; set; }
    public List<SendQuizeQuestion> SendQuizeQuestions { get; set; }
}

public class SendQuizeQuestion : QuestionListDto
{
    public string? StudentAnswer { get; set; }
}