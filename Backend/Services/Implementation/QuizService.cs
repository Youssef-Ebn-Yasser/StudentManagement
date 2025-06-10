using Backend.DTOs.QuizeDTOs;
using Backend.Entities.QuizeEntities;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;

namespace Backend.Services.Implementation
{
    public class QuizService : IQuizService
    {

        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public QuizService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public void CorrectQuiz(CorrectQuizDto dto)
        {
            throw new NotImplementedException();
        }

        public List<QuizToCorrectDto> GetQuizzesToCorrectByLessonId(int lessonId)
        {

            var quizzes = _unitOfWork.Repository<StudentQuizeAnswer>()
            .GetTableNoTracking()
            .Where(q => q.Quiz.LessonId == lessonId)
            .Where(sqa => sqa.StudentQuestionAnswer.IsCorrect == null)
            .Select(sqa => new QuizToCorrectDto
            {
                StudentQuizAnswerId = sqa.Id,
                QuizName = sqa.Quiz.Title,
                StudentName = sqa.Student.Name,

            })
            .ToList();

            return quizzes;
        }

        public List<StudentQuizAnswerDto> GetStudentQuizAnswer(int answerId)
        {

            return _unitOfWork.Repository<StudentQuestionAnswer>()
             .GetTableNoTracking()
             .Where(a => a.studentQuizeAnswerId == answerId && a.IsCorrect == null)
             .Include(a => a.studentQuestionOptions)
             .ThenInclude(opt => opt.QuestionOption)
             .Select(a => new StudentQuizAnswerDto
             {
                 Answer = a.studentQuestionOptions.Select(opt=> opt.QuestionOption.OptionText).ToList(),
                 IsCorrect = null

             })
             .ToList();
        }

        public void CorrectQuiz(int AnswerId, bool isCorrect)
        {
            var answer = _unitOfWork.Repository<StudentQuestionAnswer>()
                .GetTableAsTracking()
                .Where(a => a.Id == AnswerId).FirstOrDefault();


            if (answer == null)
                throw new Exception("Answer not found");

            answer.IsCorrect = isCorrect;

            _unitOfWork.Repository<StudentQuestionAnswer>().Update(answer);
            _unitOfWork.Complete();
        }
    }
}
