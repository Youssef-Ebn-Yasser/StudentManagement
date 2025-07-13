using Microsoft.AspNetCore.Authorization;

namespace Backend.Controllers;

[Route("api/[controller]")]
[ApiController]
public class QuizeController : AppControllerBase
{
    #region Fields
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly IEmailSender _emailSender;
    private readonly GeminiService _geminiService;
    private readonly IQuizService _service;
    private readonly ApplicationDbContext _context;
    private readonly IStructuredLogger _logger;
    #endregion

    #region Constructor
    public QuizeController(IUnitOfWork unitOfWork,
                           IMapper mapper,
                           IEmailSender emailSender,
                           GeminiService geminiService,
                           IQuizService service,
                           ApplicationDbContext context,
                           IStructuredLogger logger)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _emailSender = emailSender;
        _geminiService = geminiService;
        _service = service;
        _context = context;
        _logger = logger;
    }
    #endregion

    #region Method
    [Authorize(Roles = "Admin,Teacher")]
    [HttpPost("CorrectAnswer")]
    public async Task<IActionResult> CorrectAnswer(int quizeAnserId, [FromBody] List<CorrectQuizDto> dto)
    {
        try
        {
            _logger.LogInfo($"Correcting quiz answer for QuizAnswerId: {quizeAnserId}");

            var result = await _service.CorrectQuiz(quizeAnserId, dto);

            _logger.LogInfo($"Successfully corrected quiz answer for QuizAnswerId: {quizeAnserId}");
            return NewResult(result);
        }
        catch (Exception ex)
        {
            _logger.LogInfo($"Error correcting quiz answer for QuizAnswerId: {quizeAnserId}. Exception: {ex.Message}");
            return StatusCode(500, new Response<string>
            {
                httpStatusCode = HttpStatusCode.InternalServerError,
                Succeeded = false,
                Massage = "Failed to correct quiz answer",
                Errors = new List<string> { ex.Message }
            });
        }
    }
    [Authorize]
    [HttpGet("ToCorrect")]
    public IActionResult GetQuizzesToCorrect([FromQuery] int lessonId)
    {
        try
        {
            _logger.LogInfo($"Getting quizzes to correct for LessonId: {lessonId}");

            var result = _service.GetQuizzesToCorrectByLessonId(lessonId);

            _logger.LogInfo($"Successfully retrieved {result.Count} quizzes to correct for LessonId: {lessonId}");
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogInfo($"Error getting quizzes to correct for LessonId: {lessonId}. Exception: {ex.Message}");
            return StatusCode(500, new Response<List<QuizToCorrectDto>>
            {
                httpStatusCode = HttpStatusCode.InternalServerError,
                Succeeded = false,
                Massage = "Failed to retrieve quizzes to correct",
                Errors = new List<string> { ex.Message }
            });
        }
    }

    [Authorize]
    [HttpGet("StudentAnswers")]
    public async Task<IActionResult> GetStudentAnswers([FromQuery] int studentQuizAnswerId)
    {
        try
        {
            _logger.LogInfo($"Getting student answers for StudentQuizAnswerId: {studentQuizAnswerId}");

            var result = await _service.GetStudentQuizAnswer(studentQuizAnswerId);

            _logger.LogInfo($"Successfully retrieved student answers for StudentQuizAnswerId: {studentQuizAnswerId}");
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogInfo($"Error getting student answers for StudentQuizAnswerId: {studentQuizAnswerId}. Exception: {ex.Message}");
            return StatusCode(500, new Response<List<StudentQuizAnswerDto>>
            {
                httpStatusCode = HttpStatusCode.InternalServerError,
                Succeeded = false,
                Massage = "Failed to retrieve student answers",
                Errors = new List<string> { ex.Message }
            });
        }
    }

    [Authorize(Roles = "Admin,Teacher")]
    [HttpPost("CreateQuizWithLesson")]
    public async Task<IActionResult> CreateQuizWithLesson([FromBody] CreateQuizeWithQuestionDto dto)
    {
        try
        {
            _logger.LogInfo($"Creating quiz with lesson for LessonId: {dto.LessonId}");

            var result = await _service.CreateQuizWithLesson(dto);

            _logger.LogInfo($"Successfully created quiz with lesson for LessonId: {dto.LessonId}");
            return NewResult(result);
        }
        catch (Exception ex)
        {
            _logger.LogInfo($"Error creating quiz with lesson for LessonId: {dto.LessonId}. Exception: {ex.Message}");
            return BadRequest(new Response<string>
            {
                httpStatusCode = HttpStatusCode.BadRequest,
                Massage = $"Error creating quiz: {ex.Message}",
                Data = null,
                Succeeded = false
            });
        }
    }

    [Authorize(Roles = "Admin,Teacher")]
    [HttpPost("CreateQuizWithCourse")]
    public async Task<IActionResult> CreateQuizWithCourse([FromBody] CreateQuizQuestionBankDto dto)
    {
        try
        {
            _logger.LogInfo($"Creating quiz with course for CourseId: {dto.CourseId}");

            var result = await _service.CreateQuizWithCourse(dto);

            _logger.LogInfo($"Successfully created quiz with course for CourseId: {dto.CourseId}");
            return NewResult(result);
        }
        catch (Exception ex)
        {
            _logger.LogInfo($"Error creating quiz with course for CourseId: {dto.CourseId}. Exception: {ex.Message}");
            return BadRequest(new Response<string>
            {
                httpStatusCode = HttpStatusCode.BadRequest,
                Massage = $"Error creating question bank: {ex.Message}",
                Data = null,
                Succeeded = false
            });
        }
    }
    [Authorize(Roles = "Student,Teacher")]
    [HttpGet("GetLessonQuizzes/{lessonId}")]
    public async Task<ActionResult<Response<List<LessonQuizListDto>>>> GetLessonQuizzes(int lessonId)
    {
        try
        {
            _logger.LogInfo($"Getting lesson quizzes for LessonId: {lessonId}");

            var result = await _service.GetLessonQuizzes(lessonId);

            _logger.LogInfo($"Successfully retrieved lesson quizzes for LessonId: {lessonId}");
            return NewResult(result);
        }
        catch (Exception ex)
        {
            _logger.LogInfo($"Error getting lesson quizzes for LessonId: {lessonId}. Exception: {ex.Message}");
            return StatusCode(500, new Response<List<LessonQuizListDto>>
            {
                httpStatusCode = HttpStatusCode.InternalServerError,
                Succeeded = false,
                Massage = "Failed to retrieve quizzes",
                Errors = new List<string> { ex.Message }
            });
        }
    }
    [Authorize(Roles = "Student,Teacher")]
    [HttpGet("GetQuizById/{quizId}")]
    public async Task<ActionResult<Response<GetQuizeDto>>> GetQuizById(int quizId)
    {
        try
        {
            _logger.LogInfo($"Getting quiz by ID: {quizId}");

            var result = await _service.GetQuizById(quizId);

            _logger.LogInfo($"Successfully retrieved quiz for QuizId: {quizId}");
            return NewResult(result);
        }
        catch (Exception ex)
        {
            _logger.LogInfo($"Error getting quiz by ID: {quizId}. Exception: {ex.Message}");
            return StatusCode(500, new Response<GetQuizeDto>
            {
                httpStatusCode = HttpStatusCode.InternalServerError,
                Succeeded = false,
                Massage = "Failed to retrieve quiz",
                Errors = new List<string> { ex.Message }
            });
        }
    }

    [Authorize(Roles = "Student")]
    [HttpPost("SubmitQuiz")]
    public async Task<ActionResult<Response<string>>> SubmitQuiz([FromBody] SubmitQuizDto submission)
    {
        try
        {
            _logger.LogInfo($"Submitting quiz for StudentId: {submission.StudentId}, QuizId: {submission.QuizId}");

            // 1. Get student & quiz
            var student = await _context.Users.FindAsync(submission.StudentId);
            if (student == null)
            {
                _logger.LogInfo($"Student not found for StudentId: {submission.StudentId}");
                return NotFound(new Response<string>
                {
                    httpStatusCode = HttpStatusCode.NotFound,
                    Succeeded = false,
                    Massage = "Student not found"
                });
            }
            // if already quiz submited return submited 
            var submitedQuiz = await _unitOfWork.Repository<StudentQuizeAnswer>()
                                                               .GetTableNoTracking()
                                                               .Where(sq => sq.QuizId == submission.QuizId &&
                                                                                     sq.StudentId == submission.StudentId)
                                                               .FirstOrDefaultAsync();

            if (submitedQuiz != null)
            {
                return BadRequest(new Response<string>
                {
                    httpStatusCode = HttpStatusCode.NotFound,
                    Succeeded = false,
                    Massage = "Student Submitted already..."
                });
            }

            // 1. Get the quiz including its questions and options
            var quiz = await _context.Quizzes
                .Include(q => q.questions)
                    .ThenInclude(q => q.Options)
                .FirstOrDefaultAsync(q => q.Id == submission.QuizId);

            if (quiz == null)
            {
                _logger.LogInfo($"Quiz not found for QuizId: {submission.QuizId}");
                return NotFound(new Response<string>
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
                StudentQuestionAnswer = new List<StudentQuestionAnswer>(),
            };

            // 3. Loop through answers and build the tree
            foreach (var submittedAnswer in submission.Answers)
            {
                var question = quiz.questions.FirstOrDefault(q => q.Id == submittedAnswer.QuestionId);
                if (question == null) continue;

                var studentAnswer = new StudentQuestionAnswer
                {
                    QuestionId = submittedAnswer.QuestionId,
                    IsCorrect = null,
                    StudentAnswerText = submittedAnswer.StudentAnswerText,
                    studentQuestionOptions = new List<StudentQuestionOption>()
                };

                // Handle MCQ options
                if (question.QuestionTypeId == QuestionType.MCQ && submittedAnswer.SelectedOptionIds != null)
                {
                    foreach (var optionId in submittedAnswer.SelectedOptionIds)
                    {
                        var isCorrectOption = await _context.QuestionOptions.Where(q => q.Id == optionId).Select(o => o.IsCorrect).FirstOrDefaultAsync();

                        studentAnswer.studentQuestionOptions.Add(new StudentQuestionOption
                        {
                            QuestionOptionId = optionId,
                            IsCorrect = isCorrectOption,
                        });
                    }
                }

                studentQuizAnswer.StudentQuestionAnswer.Add(studentAnswer);
            }

            // 4. Save the full object graph in one go
            _context.studentQuizeAnswers.Add(studentQuizAnswer);
            await _context.SaveChangesAsync();

            // 5. Auto-correct if enabled
            int correctAnswersCount = 0;
            int totalPointsEarned = 0;

            foreach (var studentAnswer in studentQuizAnswer.StudentQuestionAnswer)
            {
                var question = quiz.questions.FirstOrDefault(q => q.Id == studentAnswer.QuestionId);
                if (quiz.IsAutoCorrect)
                {
                    if (question.QuestionTypeId == QuestionType.Text)
                    {
                        string prompt = $@"
                                                Compare the following two answers:
                                                
                                                Answer 1: ""{question.CorrectAnswer}""
                                                Answer 2: ""{studentAnswer.StudentAnswerText}""
                                                
                                                If the two answers match in meaning or content by 70% or more, return only: true
                                                Otherwise, return only: false
                                                
                                                Respond with only true or false.
                                                ";

                        var result = await _geminiService.GetResponseAsync(prompt);

                        if (result.Trim().ToLower() == "true")
                        {
                            studentAnswer.IsCorrect = true;
                            correctAnswersCount++;
                            totalPointsEarned += question.Points;
                        }
                        else
                        {
                            studentAnswer.IsCorrect = false;
                        }
                    }
                }
                else
                {
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
            }

            decimal gradingRating = correctAnswersCount > 0
                ? (decimal)totalPointsEarned * 100 / quiz.PossiblePoints
                : 0;
            bool isPassed = gradingRating >= 50;

            studentQuizAnswer.GradingRating = gradingRating;
            studentQuizAnswer.NumberOfAswered = correctAnswersCount;
            studentQuizAnswer.IsPassed = isPassed;

            // 6. Save the grading results
            _context.studentQuizeAnswers.Update(studentQuizAnswer);
            await _context.SaveChangesAsync();

            _logger.LogInfo($"Successfully submitted quiz for StudentId: {submission.StudentId}, QuizId: {submission.QuizId}. Grade: {gradingRating}%, Passed: {isPassed}");

            return Ok(new Response<string>
            {
                httpStatusCode = HttpStatusCode.OK,
                Succeeded = true,
                Massage = "Quiz submitted successfully",
            });
        }
        catch (Exception ex)
        {
            _logger.LogInfo($"Error submitting quiz for StudentId: {submission.StudentId}, QuizId: {submission.QuizId}. Exception: {ex.Message}");
            return StatusCode(500, new Response<string>
            {
                httpStatusCode = HttpStatusCode.InternalServerError,
                Succeeded = false,
                Massage = "Failed to submit quiz",
                Errors = new List<string> { ex.Message }
            });
        }
    }

    [Authorize]
    [HttpGet("CourseStudentStats")]
    public IActionResult GetCourseStudentStats([FromQuery] int courseId)
    {
        try
        {
            _logger.LogInfo($"Getting course student stats for CourseId: {courseId}");

            var result = _service.GetCourseStudentQuizStats(courseId);

            _logger.LogInfo($"Successfully retrieved course student stats for CourseId: {courseId}");
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogInfo($"Error getting course student stats for CourseId: {courseId}. Exception: {ex.Message}");
            return StatusCode(500, new Response<List<CourseStudentQuizStatsDto>>
            {
                httpStatusCode = HttpStatusCode.InternalServerError,
                Succeeded = false,
                Massage = "Failed to retrieve course student stats",
                Errors = new List<string> { ex.Message }
            });
        }
    }
    [Authorize]
    [HttpGet("StudentCourseStats")]
    public IActionResult GetStudentCourseStats([FromQuery] int studentId, [FromQuery] int courseId)
    {
        try
        {
            _logger.LogInfo($"Getting student course stats for StudentId: {studentId}, CourseId: {courseId}");

            var result = _service.GetStudentCourseQuizStats(studentId, courseId);
            if (result == null)
            {
                _logger.LogInfo($"Student course stats not found for StudentId: {studentId}, CourseId: {courseId}");
                return NotFound();
            }

            _logger.LogInfo($"Successfully retrieved student course stats for StudentId: {studentId}, CourseId: {courseId}");
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogInfo($"Error getting student course stats for StudentId: {studentId}, CourseId: {courseId}. Exception: {ex.Message}");
            return StatusCode(500, new Response<StudentCourseQuizStatsDto>
            {
                httpStatusCode = HttpStatusCode.InternalServerError,
                Succeeded = false,
                Massage = "Failed to retrieve student course stats",
                Errors = new List<string> { ex.Message }
            });
        }
    }
    [Authorize]
    [HttpGet("LessonQuizStats/{lessonId}")]
    public async Task<IActionResult> GetLessonQuizStats(int lessonId)
    {
        try
        {
            _logger.LogInfo($"Getting lesson quiz stats for LessonId: {lessonId}");

            var result = await _service.GetLessonQuizStats(lessonId);

            _logger.LogInfo($"Successfully retrieved lesson quiz stats for LessonId: {lessonId}");
            return NewResult(result);
        }
        catch (Exception ex)
        {
            _logger.LogInfo($"Error getting lesson quiz stats for LessonId: {lessonId}. Exception: {ex.Message}");
            return StatusCode(500, new Response<LessonQuizStatsDto>
            {
                httpStatusCode = HttpStatusCode.InternalServerError,
                Succeeded = false,
                Massage = "Failed to retrieve lesson quiz stats",
                Errors = new List<string> { ex.Message }
            });
        }
    }
    [Authorize]
    [HttpGet("CourseLessonQuizStats/{courseId}")]
    public async Task<IActionResult> GetCourseLessonQuizStats(int courseId)
    {
        try
        {
            _logger.LogInfo($"Getting course lesson quiz stats for CourseId: {courseId}");

            var result = await _service.GetCourseLessonQuizStats(courseId);

            _logger.LogInfo($"Successfully retrieved course lesson quiz stats for CourseId: {courseId}");
            return NewResult(result);
        }
        catch (Exception ex)
        {
            _logger.LogInfo($"Error getting course lesson quiz stats for CourseId: {courseId}. Exception: {ex.Message}");
            return StatusCode(500, new Response<List<LessonQuizStatsDto>>
            {
                httpStatusCode = HttpStatusCode.InternalServerError,
                Succeeded = false,
                Massage = "Failed to retrieve course lesson quiz stats",
                Errors = new List<string> { ex.Message }
            });
        }
    }
    #endregion
}