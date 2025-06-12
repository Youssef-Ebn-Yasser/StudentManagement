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
            // 1. Verify Quiz and Student exist and load related data
            var quiz = await _context.Quizzes
                .Include(q => q.questions)!
                    .ThenInclude(q => q.Options)
            .FirstOrDefaultAsync(q => q.Id == submission.QuizId);

            var student = await _context.Users.OfType<Student>().FirstOrDefaultAsync(s => s.Id == submission.StudentId);

            if (quiz == null)
            {
                return NotFound(new Response<SubmitQuizResponseDto>
                {
                    httpStatusCode = HttpStatusCode.NotFound,
                    Succeeded = false,
                    Massage = "Quiz not found",
                    Errors = new List<string> { "The specified quiz does not exist." }
                });
            }

            if (student == null)
            {
                return NotFound(new Response<SubmitQuizResponseDto>
                {
                    httpStatusCode = HttpStatusCode.NotFound,
                    Succeeded = false,
                    Massage = "Student not found",
                    Errors = new List<string> { "The specified student does not exist." }
                });
            }

            // 2. Check if quiz is still active for submission (considering potential auto-submit on end time)
            // Note: A more robust solution might involve checking server time vs quiz end time more strictly,
            // or having a background job handle true auto-submission after a grace period.
            // For this implementation, we allow submission up to the EndAtAt time.
            if (DateTime.Now > quiz.EndAtAt.AddMinutes(1)) // Allow a small buffer
            {
                return BadRequest(new Response<SubmitQuizResponseDto>
                {
                    httpStatusCode = HttpStatusCode.BadRequest,
                    Succeeded = false,
                    Massage = "Quiz submission window has closed",
                    Errors = new List<string> { $"The quiz ended at {quiz.EndAtAt:MMMM d, yyyy 'at' h:mm tt}." }
                });
            }

            // 3. Check if student has already submitted for this quiz
            var existingSubmission = await _context.studentQuizeAnswers
                .FirstOrDefaultAsync(sa => sa.StudentId == submission.StudentId && sa.QuizId == submission.QuizId);

            if (existingSubmission != null)
            {
                return BadRequest(new Response<SubmitQuizResponseDto>
                {
                    httpStatusCode = HttpStatusCode.BadRequest,
                    Succeeded = false,
                    Massage = "Quiz already submitted",
                    Errors = new List<string> { "You have already submitted this quiz." }
                });
            }

            // 4. Create a new StudentQuizeAnswer entry
            var studentQuizAnswer = new StudentQuizeAnswer
            {
                StudentId = submission.StudentId,
                QuizId = submission.QuizId,
                // Grading will be calculated later if IsAutoCorrect is true
                GradingRating = null,
                NumberOfAswered = submission.Answers.Count,
                IsPassed = null
            };

            await _context.studentQuizeAnswers.AddAsync(studentQuizAnswer);
            await _context.SaveChangesAsync(); // Save to get the studentQuizAnswer ID

            // 5. Save student's answers for each question
            var studentQuestionAnswers = new List<StudentQuestionAnswer>();
            foreach (var submittedAnswer in submission.Answers)
            {
                var question = quiz.questions?.FirstOrDefault(q => q.Id == submittedAnswer.QuestionId);
                if (question == null) continue; // Skip if question not found (shouldn't happen with valid submission)

                var studentQuestionAnswer = new StudentQuestionAnswer
                {
                    QuestionId = submittedAnswer.QuestionId,
                    studentQuizeAnswerId = studentQuizAnswer.Id,
                    IsCorrect = false, // Default to false, update if auto-corrected
                };

                if (question.QuestionTypeId == QuestionType.Text)
                {
                    // For Text questions, save the text answer
                    studentQuestionAnswer.StudentAnswerText = submittedAnswer.StudentAnswerText;
                    // Auto-correction for text answers would require external service integration (like Gemini)
                    // For now, IsCorrect remains false unless manual grading happens later.
                }
                else if (question.QuestionTypeId == QuestionType.MCQ)
                {
                    // For MCQ questions, save selected option(s)
                    if (submittedAnswer.SelectedOptionIds != null && submittedAnswer.SelectedOptionIds.Any())
                    {
                        studentQuestionAnswer.studentQuestionOptions = submittedAnswer.SelectedOptionIds.Select(optionId => new StudentQuestionOption
                        {
                            QuestionOptionId = optionId
                        }).ToList();

                        // If auto-correct is enabled, check if the selected options are correct
                        if (quiz.IsAutoCorrect)
                        {
                            // Assuming single correct option for simplicity for now
                            var correctOption = question.Options?.FirstOrDefault(o => o.IsCorrect);
                            studentQuestionAnswer.IsCorrect = submittedAnswer.SelectedOptionIds.Count == 1 && submittedAnswer.SelectedOptionIds.Contains(correctOption?.Id ?? 0);
                        }
                    }
                }
                studentQuestionAnswers.Add(studentQuestionAnswer);
            }

            if (studentQuestionAnswers.Any())
            {
                await _context.StudentQuestionAnswers.AddRangeAsync(studentQuestionAnswers);
                await _context.SaveChangesAsync();
            }

            // 6. Auto-correct if enabled
            if (quiz.IsAutoCorrect)
            {
                int correctAnswersCount = studentQuestionAnswers.Count(sa => sa.IsCorrect == true);
                int totalPointsEarned = studentQuestionAnswers
                    .Where(sa => sa.IsCorrect == true)
                    .Sum(sa => quiz.questions.FirstOrDefault(q => q.Id == sa.QuestionId)?.Points ?? 0);

                decimal gradingRating = quiz.PossiblePoints > 0 ? (decimal)totalPointsEarned * 100 / quiz.PossiblePoints : 0;
                bool isPassed = gradingRating >= 50; // Assuming a pass threshold of 50%

                studentQuizAnswer.GradingRating = gradingRating;
                studentQuizAnswer.NumberOfAswered = correctAnswersCount;
                studentQuizAnswer.IsPassed = isPassed;

                _context.studentQuizeAnswers.Update(studentQuizAnswer);
                await _context.SaveChangesAsync();
            }

            // 7. Prepare response
            var responseDto = new SubmitQuizResponseDto
            {
                QuizId = quiz.Id,
                StudentId = student.Id,
                IsAutoCorrected = quiz.IsAutoCorrect,
                GradingRating = studentQuizAnswer.GradingRating,
                NumberOfAnsweredCorrectly = studentQuizAnswer.NumberOfAswered,
                IsPassed = studentQuizAnswer.IsPassed,
                Message = quiz.IsAutoCorrect ? "Quiz submitted and graded successfully" : "Quiz submitted successfully. Grading will be done manually."
            };

            return Ok(new Response<SubmitQuizResponseDto>
            {
                httpStatusCode = HttpStatusCode.OK,
                Succeeded = true,
                Massage = responseDto.Message,
                Data = responseDto
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