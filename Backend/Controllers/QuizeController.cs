using Backend.DTOs.QuizeDTOs;
using Backend.Entities.QuizeEntities;

namespace Backend.Controllers;

[Route("api/[controller]")]
[ApiController]
public class QuizeController : AppControllerBase
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly IEmailSender _emailSender;
    private readonly GeminiService _geminiService;
    private readonly IQuizService _service;
    private readonly ApplicationDbContext _context;

    public QuizeController(IUnitOfWork unitOfWork, IMapper mapper, IEmailSender emailSender, GeminiService geminiService, IQuizService service, ApplicationDbContext context)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _emailSender = emailSender;
        _geminiService = geminiService;
        _service = service;
        _context = context;
    }


    [HttpPost("CorrectAnswer")]
    public IActionResult CorrectAnswer([FromBody] CorrectQuizDto dto)
    {
        _service.CorrectQuiz(dto.AnswerId, dto.IsCorrect);
        return Ok();
    }

    [HttpGet("ToCorrect")]
    public IActionResult GetQuizzesToCorrect([FromQuery] int lessonId)
    {
        var result = _service.GetQuizzesToCorrectByLessonId(lessonId);
        return Ok(result);
    }

    [HttpGet("StudentAnswers")]
    public IActionResult GetStudentAnswers([FromQuery] int studentQuizAnswerId)
    {
        var result = _service.GetStudentQuizAnswer(studentQuizAnswerId);

        return Ok(result);
    }






    [HttpPost("CreateQuizWithLesson")]
    public async Task<IActionResult> CreateQuizWithLesson([FromBody] CreateQuizeWithQuestionDto dto)
    {
        try
        {
            var result = await _service.CreateQuizWithLesson(dto);

            return NewResult(result);
        }
        catch (Exception ex)
        {
            return BadRequest(new Response<string>
            {
                httpStatusCode = HttpStatusCode.BadRequest,
                Massage = $"Error creating quiz: {ex.Message}",
                Data = null,
                Succeeded = false
            });
        }
    }

    [HttpPost("CreateQuizWithCourse")]
    public async Task<IActionResult> CreateQuizWithCourse([FromBody] CreateQuizQuestionBankDto dto)
    {
        try
        {
            var result = await _service.CreateQuizWithCourse(dto);

            return NewResult(result);
        }
        catch (Exception ex)
        {
            return BadRequest(new Response<string>
            {
                httpStatusCode = HttpStatusCode.BadRequest,
                Massage = $"Error creating question bank: {ex.Message}",
                Data = null,
                Succeeded = false
            });
        }
    }

    [HttpGet("GetLessonQuizzes/{lessonId}")]
    public async Task<ActionResult<Response<List<LessonQuizListDto>>>> GetLessonQuizzes(int lessonId)
    {
        try
        {
            var result = await _service.GetLessonQuizzes(lessonId);

            return NewResult(result);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new Response<List<LessonQuizListDto>>
            {
                httpStatusCode = HttpStatusCode.InternalServerError,
                Succeeded = false,
                Massage = "Failed to retrieve quizzes",
                Errors = new List<string> { ex.Message }
            });
        }
    }





    [HttpGet("GetQuizById/{quizId}")]
    public async Task<ActionResult<Response<GetQuizeDto>>> GetQuizById(int quizId)
    {
        try
        {
            var result = await _service.GetQuizById(quizId);

            return NewResult(result);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new Response<GetQuizeDto>
            {
                httpStatusCode = HttpStatusCode.InternalServerError,
                Succeeded = false,
                Massage = "Failed to retrieve quiz",
                Errors = new List<string> { ex.Message }
            });
        }
    }

    [HttpPost("SubmitQuiz")]
    public async Task<ActionResult<Response<SubmitQuizResponseDto>>> SubmitQuiz([FromBody] SubmitQuizDto submission)
    {
        try
        {
            // 1. Get student & quiz
            var student = await _context.Users.FindAsync(submission.StudentId);
            if (student == null)
            {
                return NotFound(new Response<SubmitQuizResponseDto>
                {
                    httpStatusCode = HttpStatusCode.NotFound,
                    Succeeded = false,
                    Massage = "Student not found"
                });
            }

            // 1. Get the quiz including its questions and options
            var quiz = await _context.Quizzes
                .Include(q => q.questions)
                    .ThenInclude(q => q.Options)
                .FirstOrDefaultAsync(q => q.Id == submission.QuizId);

            if (quiz == null)
            {
                return NotFound(new Response<SubmitQuizResponseDto>
                {
                    httpStatusCode = HttpStatusCode.NotFound,
                    Succeeded = false,
                    Massage = "Quiz not found"
                });
            }

            // 2. Create root entity
            var studentQuizAnswer = new StudentQuizeAnswer
            {
                StudentId = submission.StudentId,
                QuizId = submission.QuizId,
                StudentQuestionAnswer = new List<StudentQuestionAnswer>()
            };

            // 3. Loop through answers and build the tree
            foreach (var submittedAnswer in submission.Answers)
            {
                var question = quiz.questions.FirstOrDefault(q => q.Id == submittedAnswer.QuestionId);
                if (question == null) continue;

                var studentAnswer = new StudentQuestionAnswer
                {
                    QuestionId = submittedAnswer.QuestionId,
                    IsCorrect = false,
                    StudentAnswerText = question.QuestionTypeId == QuestionType.Text ? submittedAnswer.StudentAnswerText : null,
                    studentQuestionOptions = new List<StudentQuestionOption>()
                };

                // Handle MCQ options
                if (question.QuestionTypeId == QuestionType.MCQ && submittedAnswer.SelectedOptionIds != null)
                {
                    foreach (var optionId in submittedAnswer.SelectedOptionIds)
                    {
                        studentAnswer.studentQuestionOptions.Add(new StudentQuestionOption
                        {
                            QuestionOptionId = optionId
                        });
                    }
                }

                studentQuizAnswer.StudentQuestionAnswer.Add(studentAnswer);
            }

            // 4. Save the full object graph in one go
            _context.studentQuizeAnswers.Add(studentQuizAnswer);
            await _context.SaveChangesAsync();



            // 5. Auto-correct if enabled
            if (quiz.IsAutoCorrect)
            {
                int correctAnswersCount = 0;
                int totalPointsEarned = 0;

                foreach (var studentAnswer in studentQuizAnswer.StudentQuestionAnswer)
                {
                    var question = quiz.questions.FirstOrDefault(q => q.Id == studentAnswer.QuestionId);
                    if (question == null || question.QuestionTypeId != QuestionType.MCQ) continue;

                    var correctOption = question.Options.FirstOrDefault(o => o.IsCorrect);
                    var selectedOptionIds = studentAnswer.studentQuestionOptions
                        .Select(o => o.QuestionOptionId)
                        .ToList();

                    bool isCorrect = correctOption != null &&
                                     selectedOptionIds.Count == 1 &&
                                     selectedOptionIds.Contains(correctOption.Id);

                    studentAnswer.IsCorrect = isCorrect;

                    if (isCorrect)
                    {
                        correctAnswersCount++;
                        totalPointsEarned += question.Points;
                    }
                }

                decimal gradingRating = quiz.PossiblePoints > 0
                    ? (decimal)totalPointsEarned * 100 / quiz.PossiblePoints
                    : 0;
                bool isPassed = gradingRating >= 50;

                studentQuizAnswer.GradingRating = gradingRating;
                studentQuizAnswer.NumberOfAswered = correctAnswersCount;
                studentQuizAnswer.IsPassed = isPassed;
            }


            return Ok(new Response<SubmitQuizResponseDto>
            {
                httpStatusCode = HttpStatusCode.OK,
                Succeeded = true,
                Massage = "Quiz submitted successfully"
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new Response<SubmitQuizResponseDto>
            {
                httpStatusCode = HttpStatusCode.InternalServerError,
                Succeeded = false,
                Massage = "Failed to submit quiz",
                Errors = new List<string> { ex.Message }
            });
        }
    }




    [HttpGet("CourseStudentStats")]
    public IActionResult GetCourseStudentStats([FromQuery] int courseId)
    {
        var result = _service.GetCourseStudentQuizStats(courseId);
        return Ok(result);
    }

    [HttpGet("StudentCourseStats")]
    public IActionResult GetStudentCourseStats([FromQuery] int studentId, [FromQuery] int courseId)
    {
        var result = _service.GetStudentCourseQuizStats(studentId, courseId);
        if (result == null)
            return NotFound();
        return Ok(result);
    }
}