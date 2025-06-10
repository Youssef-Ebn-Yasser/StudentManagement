using Backend.DTOs.QuizeDTOs;

namespace Backend.Services.Interfaces;

public interface IQuizService
{
    List<QuizToCorrectDto> GetQuizzesToCorrectByLessonId(int lessonId);
    StudentQuizAnswerDto GetStudentQuizAnswer(int answerId);
    void CorrectQuiz(int AnswerId, bool isCorrect);

}