using System.Collections.Generic;

namespace Backend.DTOs.QuizeDTOs;

// DTO for a student's quiz statistics in a course
public class CourseStudentQuizStatsDto
{
    public string StudentName { get; set; }
    public int NumberOfQuizzesSubmitted { get; set; }
    public double PercentageOfSubmitted { get; set; }
    public double PercentageOfDegree { get; set; }
    public double PercentageOfPassQuiz { get; set; }
    public List<LessonQuizStatsDto>? Lessons { get; set; }
}

// DTO for detailed quiz statistics for a specific student in a course
public class StudentCourseQuizStatsDto
{
    public string StudentName { get; set; }
    public int NumberOfQuizzesSubmitted { get; set; }
    public double PercentageOfSubmitted { get; set; }
    public double PercentageOfDegree { get; set; }
    public double PercentageOfPassQuiz { get; set; }
    public List<LessonQuizStatsDto>? Lessons { get; set; }
}

// DTO for lesson quiz statistics
public class LessonQuizStatsDto
{
    public string LessonName { get; set; }
    public int NumberOfQuizzesInLesson { get; set; }
    public double PercentageOfDegreeForAllQuizzes { get; set; }
    public List<QuizStatsDto>? Quizzes { get; set; }
}

// DTO for individual quiz statistics
public class QuizStatsDto
{
    public string QuizName { get; set; }
    public double StudentDegree { get; set; }
    public double StudentPercentage { get; set; }
}
