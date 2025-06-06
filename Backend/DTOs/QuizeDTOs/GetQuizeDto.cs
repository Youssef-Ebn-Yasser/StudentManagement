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

public class QuizToCorrectDto
{
    public int Id { get; set; }
    public string QuizName { get; set; }
    public string StudentName { get; set; }
    public int StudentQuizAnswerId { get; set; }
}

public class StudentQuizAnswerDto
{
    public string Answer { get; set; }
    public bool? IsCorrect { get; set; }
}

public class CorrectQuizDto
{
    public int AnswerId { get; set; }
    public bool IsCorrect { get; set; }
    public int Degree { get; set; }
}