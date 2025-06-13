using System.Collections.Generic;

namespace Backend.DTOs.QuizeDTOs;

public class LessonQuizesStatsDto
{
    public string LessonName { get; set; }
    public int NumberOfQuizzes { get; set; }
    public double PercentageOfAllQuizzes { get; set; }
    public List<QuizAnalyticsDto> Quizzes { get; set; }
}

public class QuizAnalyticsDto
{
    public string QuizName { get; set; }
    public double PercentageWithDegree { get; set; }
    public int NumberOfStudentSubmit { get; set; }
    public double PercentageOfSubmit { get; set; }
    public int NumberOfStudentUnder50 { get; set; }
    public int NumberOfStudentOver70 { get; set; }
    public int NumberOfStudentWith100 { get; set; }
    public List<StudentQuizSubmissionDto> StudentSubmissions { get; set; }
}

public class StudentQuizSubmissionDto
{
    public string StudentName { get; set; }
    public double StudentDegree { get; set; }
    public int NumberOfSubmittedQuestions { get; set; }
} 