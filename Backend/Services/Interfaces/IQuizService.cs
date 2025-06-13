using Backend.DTOs.QuizeDTOs;

namespace Backend.Services.Interfaces;

public interface IQuizService
{
    public List<QuizToCorrectDto> GetQuizzesToCorrectByLessonId(int lessonId);
    public List<StudentQuizAnswerDto> GetStudentQuizAnswer(int answerId);
    public void CorrectQuiz(int AnswerId, bool isCorrect);
    public List<CourseStudentQuizStatsDto> GetCourseStudentQuizStats(int courseId);
    public StudentCourseQuizStatsDto GetStudentCourseQuizStats(int studentId, int courseId);
    public Task<Response<LessonQuizesStatsDto>> GetLessonQuizStats(int lessonId);
    public Task<Response<List<LessonQuizesStatsDto>>> GetCourseLessonQuizStats(int courseId);
    public Task<Response<GetQuizeDto>> GetQuizById(int quizId);
    public Task<Response<List<LessonQuizListDto>>> GetLessonQuizzes(int lessonId);
    public Task<Response<string>> CreateQuizWithCourse(CreateQuizQuestionBankDto dto);
    public Task<Response<string>> CreateQuizWithLesson(CreateQuizeWithQuestionDto dto);


}