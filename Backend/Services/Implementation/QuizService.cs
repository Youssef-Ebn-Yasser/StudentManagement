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

        public List<CourseStudentQuizStatsDto> GetCourseStudentQuizStats(int courseId)
        {
            // Get all students enrolled in the course
            var students = _unitOfWork.Repository<StudentCourse>()
                .GetTableNoTracking()
                .Where(sc => sc.CourseId == courseId && !sc.IsDeleted)
                .Select(sc => sc.Student)
                .ToList();

            // Get all lessons in the course
            var lessons = _unitOfWork.Repository<Lesson>()
                .GetTableNoTracking()
                .Where(l => l.CourseId == courseId && !l.IsDeleted)
                .Include(l => l.Quizs)
                .ToList();

            // Get all quizzes in the course
            var quizIds = lessons.SelectMany(l => l.Quizs).Select(q => q.Id).ToList();

            // Get all student quiz answers for these quizzes
            var studentQuizAnswers = _unitOfWork.Repository<StudentQuizeAnswer>()
                .GetTableNoTracking()
                .Where(sqa => quizIds.Contains(sqa.QuizId))
                .Include(sqa => sqa.Quiz)
                .Include(sqa => sqa.Student)
                .ToList();

            var result = new List<CourseStudentQuizStatsDto>();

            foreach (var student in students)
            {
                var studentAnswers = studentQuizAnswers.Where(sqa => sqa.StudentId == student.Id).ToList();
                int totalQuizzes = quizIds.Count;
                int submittedQuizzes = studentAnswers.Count;
                double percentageSubmitted = totalQuizzes > 0 ? (double)submittedQuizzes / totalQuizzes * 100 : 0;
                double totalDegree = studentAnswers.Sum(a => (double?)a.GradingRating ?? 0);
                double maxDegree = lessons.SelectMany(l => l.Quizs).Sum(q => (double)q.PossiblePoints);
                double percentageDegree = maxDegree > 0 ? totalDegree / maxDegree * 100 : 0;
                int passedQuizzes = studentAnswers.Count(a => a.IsPassed == true);
                double percentagePassed = submittedQuizzes > 0 ? (double)passedQuizzes / submittedQuizzes * 100 : 0;

                var lessonStats = new List<LessonQuizStatsDto>();
                foreach (var lesson in lessons)
                {
                    var lessonQuizzes = lesson.Quizs;
                    var lessonQuizIds = lessonQuizzes.Select(q => q.Id).ToList();
                    int numQuizzesInLesson = lessonQuizzes.Count;
                    double lessonDegree = studentAnswers.Where(a => lessonQuizIds.Contains(a.QuizId)).Sum(a => (double?)a.GradingRating ?? 0);
                    double lessonMaxDegree = lessonQuizzes.Sum(q => (double)q.PossiblePoints);
                    double lessonPercentageDegree = lessonMaxDegree > 0 ? lessonDegree / lessonMaxDegree * 100 : 0;

                    var quizStats = new List<QuizStatsDto>();
                    foreach (var quiz in lessonQuizzes)
                    {
                        var answer = studentAnswers.FirstOrDefault(a => a.QuizId == quiz.Id);
                        double studentDegree = (double)(answer?.GradingRating ?? 0);
                        double studentPercentage = quiz.PossiblePoints > 0 ? studentDegree / quiz.PossiblePoints * 100 : 0;
                        quizStats.Add(new QuizStatsDto
                        {
                            QuizName = quiz.Title,
                            StudentDegree = studentDegree,
                            StudentPercentage = studentPercentage
                        });
                    }

                    lessonStats.Add(new LessonQuizStatsDto
                    {
                        LessonName = lesson.Title,
                        NumberOfQuizzesInLesson = numQuizzesInLesson,
                        PercentageOfDegreeForAllQuizzes = lessonPercentageDegree,
                        Quizzes = quizStats
                    });
                }

                result.Add(new CourseStudentQuizStatsDto
                {
                    StudentName = student.Name,
                    NumberOfQuizzesSubmitted = submittedQuizzes,
                    PercentageOfSubmitted = percentageSubmitted,
                    PercentageOfDegree = percentageDegree,
                    PercentageOfPassQuiz = percentagePassed,
                    Lessons = lessonStats
                });
            }

            return result;
        }

        public StudentCourseQuizStatsDto GetStudentCourseQuizStats(int studentId, int courseId)
        {
            // Get the student
            var student = _unitOfWork.Repository<Student>()
                .GetTableNoTracking()
                .FirstOrDefault(s => s.Id == studentId);
            if (student == null) return null;

            // Get all lessons in the course
            var lessons = _unitOfWork.Repository<Lesson>()
                .GetTableNoTracking()
                .Where(l => l.CourseId == courseId && !l.IsDeleted)
                .Include(l => l.Quizs)
                .ToList();

            // Get all quizzes in the course
            var quizIds = lessons.SelectMany(l => l.Quizs).Select(q => q.Id).ToList();

            // Get all student quiz answers for these quizzes
            var studentQuizAnswers = _unitOfWork.Repository<StudentQuizeAnswer>()
                .GetTableNoTracking()
                .Where(sqa => quizIds.Contains(sqa.QuizId) && sqa.StudentId == studentId)
                .Include(sqa => sqa.Quiz)
                .ToList();

            int totalQuizzes = quizIds.Count;
            int submittedQuizzes = studentQuizAnswers.Count;
            double percentageSubmitted = totalQuizzes > 0 ? (double)submittedQuizzes / totalQuizzes * 100 : 0;
            double totalDegree = studentQuizAnswers.Sum(a => (double?)a.GradingRating ?? 0);
            double maxDegree = lessons.SelectMany(l => l.Quizs).Sum(q => (double)q.PossiblePoints);
            double percentageDegree = maxDegree > 0 ? totalDegree / maxDegree * 100 : 0;
            int passedQuizzes = studentQuizAnswers.Count(a => a.IsPassed == true);
            double percentagePassed = submittedQuizzes > 0 ? (double)passedQuizzes / submittedQuizzes * 100 : 0;

            var lessonStats = new List<LessonQuizStatsDto>();
            foreach (var lesson in lessons)
            {
                var lessonQuizzes = lesson.Quizs;
                var lessonQuizIds = lessonQuizzes.Select(q => q.Id).ToList();
                int numQuizzesInLesson = lessonQuizzes.Count;
                double lessonDegree = studentQuizAnswers.Where(a => lessonQuizIds.Contains(a.QuizId)).Sum(a => (double?)a.GradingRating ?? 0);
                double lessonMaxDegree = lessonQuizzes.Sum(q => (double)q.PossiblePoints);
                double lessonPercentageDegree = lessonMaxDegree > 0 ? lessonDegree / lessonMaxDegree * 100 : 0;

                var quizStats = new List<QuizStatsDto>();
                foreach (var quiz in lessonQuizzes)
                {
                    var answer = studentQuizAnswers.FirstOrDefault(a => a.QuizId == quiz.Id);
                    double studentDegree = (double)(answer?.GradingRating ?? 0);
                    double studentPercentage = quiz.PossiblePoints > 0 ? studentDegree / quiz.PossiblePoints * 100 : 0;
                    quizStats.Add(new QuizStatsDto
                    {
                        QuizName = quiz.Title,
                        StudentDegree = studentDegree,
                        StudentPercentage = studentPercentage
                    });
                }

                lessonStats.Add(new LessonQuizStatsDto
                {
                    LessonName = lesson.Title,
                    NumberOfQuizzesInLesson = numQuizzesInLesson,
                    PercentageOfDegreeForAllQuizzes = lessonPercentageDegree,
                    Quizzes = quizStats
                });
            }

            return new StudentCourseQuizStatsDto
            {
                StudentName = student.Name,
                NumberOfQuizzesSubmitted = submittedQuizzes,
                PercentageOfSubmitted = percentageSubmitted,
                PercentageOfDegree = percentageDegree,
                PercentageOfPassQuiz = percentagePassed,
                Lessons = lessonStats
            };
        }
    }
}
