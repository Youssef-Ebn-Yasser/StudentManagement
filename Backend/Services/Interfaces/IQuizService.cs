using Backend.DTOs.QuizeDTOs;

namespace Backend.Services.Interfaces;

public interface IQuizService
{
    List<QuizToCorrectDto> GetQuizzesToCorrectByLessonId(int lessonId);
    List<StudentQuizAnswerDto> GetStudentQuizAnswer(int answerId);
    void CorrectQuiz(int AnswerId, bool isCorrect);
    List<CourseStudentQuizStatsDto> GetCourseStudentQuizStats(int courseId);
    StudentCourseQuizStatsDto GetStudentCourseQuizStats(int studentId, int courseId);


    public Task<Response<GetQuizeDto>> GetQuizById(int quizId);
    public Task<Response<List<LessonQuizListDto>>> GetLessonQuizzes(int lessonId);
    public Task<Response<string>> CreateQuizWithCourse(CreateQuizQuestionBankDto dto);
    public Task<Response<string>> CreateQuizWithLesson(CreateQuizeWithQuestionDto dto);

}