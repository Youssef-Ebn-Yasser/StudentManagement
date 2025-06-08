using Backend.Entities.QuizeEntities;

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


public class CreateQuizResponseDto
{
    public int Id { get; set; }
    public int LessonId { get; set; }
    public required string Title { get; set; }
    public string? Description { get; set; }
    public DateTime StartsAt { get; set; }
    public DateTime EndAtAt { get; set; }
    public int DurationMinutes { get; set; }
    public DateTime CreatedAt { get; set; }
    public int NumberOfQuestions { get; set; }
    public int PossiblePoints { get; set; }
    public bool IsAutoCorrect { get; set; }
    public List<CreateQuizQuestionResponseDto> Questions { get; set; } = new();
}

public class CreateQuizQuestionResponseDto
{
    public int Id { get; set; }
    public string QuestionText { get; set; } = string.Empty;
    public QuestionType QuestionTypeId { get; set; }
    public int Points { get; set; }
    public string? CorrectAnswer { get; set; }
    public List<QuestionOptionResponseDto>? Options { get; set; }
}

public class QuestionOptionResponseDto
{
    public int Id { get; set; }
    public string OptionText { get; set; } = string.Empty;
    public bool IsCorrect { get; set; }
}

public class CreateQuizQuestionBankResponseDto
{
    public int CourseId { get; set; }
    public string CourseName { get; set; } = string.Empty;
    public List<CreateQuizQuestionResponseDto> Questions { get; set; } = new();
}

public class LessonQuizListDto
{
    public int QuizId { get; set; }
    public string QuizName { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public int TotalQuestions { get; set; }
    public int TotalPoints { get; set; }
}

public class SubmitQuizDto
{
    public int StudentId { get; set; }
    public int QuizId { get; set; }
    public List<SubmitAnswerDto> Answers { get; set; } = new();
}

public class SubmitAnswerDto
{
    public int QuestionId { get; set; }
    public string? StudentAnswerText { get; set; } // For Text answers
    public List<int>? SelectedOptionIds { get; set; } // For MCQ answers
}

public class SubmitQuizResponseDto
{
    public int QuizId { get; set; }
    public int StudentId { get; set; }
    public bool IsAutoCorrected { get; set; }
    public decimal? GradingRating { get; set; }
    public int? NumberOfAnsweredCorrectly { get; set; }
    public bool? IsPassed { get; set; }
    public string Message { get; set; } = string.Empty;
}