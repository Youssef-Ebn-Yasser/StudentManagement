using Backend.DTOs.QuizeDTOs;
using Backend.Entities.QuizeEntities;

namespace Backend.Controllers;

[Route("api/[controller]")]
[ApiController]
public class QuizeController : ControllerBase
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
            // Map DTO to Quiz entity using the existing helper method
            var quiz = MapToEntity(dto);

            // Save quiz to database
            await _unitOfWork.Repository<Quiz>().AddAsync(quiz);
            var result = _unitOfWork.Complete();

            if (result <= 0)
            {
                return BadRequest(new Response<string>
                {
                    httpStatusCode = HttpStatusCode.BadRequest,
                    Massage = "Failed to create quiz",
                    Data = null,
                    Succeeded = false
                });
            }

            // Map to response DTO to avoid circular references
            var responseDto = new CreateQuizResponseDto
            {
                Id = quiz.Id,
                LessonId = quiz.LessonId,
                Title = quiz.Title,
                Description = quiz.Description,
                StartsAt = quiz.StartsAt,
                EndAtAt = quiz.EndAtAt,
                DurationMinutes = quiz.DurationMinutes,
                CreatedAt = quiz.CreatedAt,
                NumberOfQuestions = quiz.NumberOfQuestions,
                PossiblePoints = quiz.PossiblePoints,
                IsAutoCorrect = quiz.IsAutoCorrect,
                Questions = quiz.questions?.Select(q => new CreateQuizQuestionResponseDto
                {
                    Id = q.Id,
                    QuestionText = q.QuestionText,
                    QuestionTypeId = q.QuestionTypeId,
                    Points = q.Points,
                    CorrectAnswer = q.CorrectAnswer,
                    Options = q.Options?.Select(o => new QuestionOptionResponseDto
                    {
                        Id = o.Id,
                        OptionText = o.OptionText,
                        IsCorrect = o.IsCorrect
                    }).ToList()
                }).ToList() ?? new List<CreateQuizQuestionResponseDto>()
            };

            // Send email notification to students
            string emailSubject = $"New Quiz: \"{quiz.Title}\" Scheduled for {quiz.StartsAt:MMMM d, yyyy 'at' h:mm tt}";
            string emailMessage = $@"
                Dear Student,

                A new quiz has been created for your course lesson.

                📘 Quiz Details:
                - Title: {quiz.Title}
                - Description: {quiz.Description ?? "No description provided."}
                - Start Time: {quiz.StartsAt:MMMM d, yyyy 'at' h:mm tt}
                - Duration: {quiz.DurationMinutes} minutes
                - Number of Questions: {quiz.NumberOfQuestions}
                - Total Points: {quiz.PossiblePoints}

                📝 Important Notes:
                - Please ensure you join the quiz on time
                - You must complete it within the allocated duration
                - Make sure your internet connection is stable

                Best regards,
                Course Team
            ";

            try
            {
                // Get students enrolled in the lesson's course
                var lesson = await _unitOfWork.Repository<Lesson>()
                    .GetTableNoTracking()
                    .Include(l => l.Course)
                    .ThenInclude(c => c.StudentCourses)
                    .ThenInclude(sc => sc.Student)
                    .FirstOrDefaultAsync(l => l.Id == dto.LessonId);

                if (lesson?.Course?.StudentCourses != null)
                {
                    foreach (var studentCourse in lesson.Course.StudentCourses)
                    {
                        if (studentCourse.Student?.Email != null)
                        {
                            await _emailSender.SendEmailAsync(studentCourse.Student.Email, emailSubject, emailMessage);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                // Log email sending error but don't fail the quiz creation
                // TODO: Add proper logging
            }

            return Ok(new Response<CreateQuizResponseDto>
            {
                httpStatusCode = HttpStatusCode.OK,
                Massage = "Quiz created successfully",
                Data = responseDto,
                Succeeded = true
            });
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
            // Verify course exists
            var course = await _unitOfWork.Repository<Course>()
                .GetTableNoTracking()
                .FirstOrDefaultAsync(c => c.Id == dto.CourseId);

            if (course == null)
            {
                return BadRequest(new Response<string>
                {
                    httpStatusCode = HttpStatusCode.BadRequest,
                    Massage = "Course not found",
                    Data = null,
                    Succeeded = false
                });
            }

            // Create questions for the question bank
            var questions = dto.QuestionListDtos.Select(qDto => new Question
            {
                CourseId = dto.CourseId,
                QuestionText = qDto.QuestionText,
                QuestionTypeId = qDto.QuestionTypeId,
                Points = qDto.Points,
                CorrectAnswer = qDto.CorrectAnswer,
                IsQuestionBank = true, // Mark as question bank question
                IsQuestionBankUsed = false, // Not used in any quiz yet
                Options = qDto.Options?.Select(opt => new QuestionOption
                {
                    OptionText = opt.Key,
                    IsCorrect = opt.Value
                }).ToList()
            }).ToList();

            // Save questions to database
            await _unitOfWork.Repository<Question>().AddRangeAsync(questions);
            var result = _unitOfWork.Complete();

            if (result <= 0)
            {
                return BadRequest(new Response<string>
                {
                    httpStatusCode = HttpStatusCode.BadRequest,
                    Massage = "Failed to create question bank",
                    Data = null,
                    Succeeded = false
                });
            }

            // Map to response DTO
            var responseDto = new CreateQuizQuestionBankResponseDto
            {
                CourseId = dto.CourseId,
                CourseName = course.Title,
                Questions = questions.Select(q => new CreateQuizQuestionResponseDto
                {
                    Id = q.Id,
                    QuestionText = q.QuestionText,
                    QuestionTypeId = q.QuestionTypeId,
                    Points = q.Points,
                    CorrectAnswer = q.CorrectAnswer,
                    Options = q.Options?.Select(o => new QuestionOptionResponseDto
                    {
                        Id = o.Id,
                        OptionText = o.OptionText,
                        IsCorrect = o.IsCorrect
                    }).ToList()
                }).ToList()
            };

            return Ok(new Response<CreateQuizQuestionBankResponseDto>
            {
                httpStatusCode = HttpStatusCode.OK,
                Massage = "Question bank created successfully",
                Data = responseDto,
                Succeeded = true
            });
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

    private static Quiz MapToEntity(CreateQuizeWithQuestionDto dto)
    {
        var quiz = new Quiz
        {
            LessonId = dto.LessonId,
            Title = dto.Title,
            Description = dto.Description,
            StartsAt = dto.StartsAt,
            DurationMinutes = dto.DurationMinutes,
            CreatedAt = DateTime.Now,
            EndAtAt = dto.StartsAt.AddMinutes(dto.DurationMinutes),
            NumberOfQuestions = dto.questionListDtos?.Count ?? 0,
            PossiblePoints = dto.questionListDtos?.Sum(q => q.Points) ?? 0,
            IsAutoCorrect = true, // Default to true for automatic grading
            questions = dto.questionListDtos?.Select(qDto => new Question
            {
                QuestionText = qDto.QuestionText,
                QuestionTypeId = qDto.QuestionTypeId,
                Points = qDto.Points,
                CorrectAnswer = qDto.CorrectAnswer,
                Options = qDto.Options?.Select(opt => new QuestionOption
                {
                    OptionText = opt.Key,
                    IsCorrect = opt.Value
                }).ToList()
            }).ToList()
        };

        return quiz;
    }

    [HttpGet("GetLessonQuizzes/{lessonId}")]
    public async Task<ActionResult<Response<List<LessonQuizListDto>>>> GetLessonQuizzes(int lessonId)
    {
        try
        {
            // Verify lesson exists
            var lesson = await _context.Lessons.FindAsync(lessonId);
            if (lesson == null)
            {
                return NotFound(new Response<List<LessonQuizListDto>>
                {
                    httpStatusCode = HttpStatusCode.NotFound,
                    Succeeded = false,
                    Massage = "Lesson not found",
                    Errors = new List<string> { "The specified lesson does not exist" }
                });
            }

            // Get all quizzes for the lesson
            var quizzes = await _context.Quizzes
                .Where(q => q.LessonId == lessonId)
                .Select(q => new LessonQuizListDto
                {
                    QuizId = q.Id,
                    QuizName = q.Title,
                    CreatedAt = q.CreatedAt,
                    TotalQuestions = q.questions != null ? q.questions.Count : 0,
                    TotalPoints = q.questions != null ? q.questions.Sum(question => question.Points) : 0
                })
                .ToListAsync();

            return Ok(new Response<List<LessonQuizListDto>>
            {
                httpStatusCode = HttpStatusCode.OK,
                Succeeded = true,
                Massage = "Quizzes retrieved successfully",
                Data = quizzes
            });
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
            // Get quiz with questions and options
            var quiz = await _context.Quizzes
                .Include(q => q.questions)
                    .ThenInclude(q => q.Options)
                .FirstOrDefaultAsync(q => q.Id == quizId);

            if (quiz == null)
            {
                return NotFound(new Response<GetQuizeDto>
                {
                    httpStatusCode = HttpStatusCode.NotFound,
                    Succeeded = false,
                    Massage = "Quiz not found",
                    Errors = new List<string> { "The specified quiz does not exist" }
                });
            }

            // Check if quiz has started
            if (quiz.StartsAt > DateTime.Now)
            {
                return BadRequest(new Response<GetQuizeDto>
                {
                    httpStatusCode = HttpStatusCode.BadRequest,
                    Succeeded = false,
                    Massage = "Quiz has not started yet",
                    Errors = new List<string> { $"Quiz will be available at {quiz.StartsAt:MMMM d, yyyy 'at' h:mm tt}" }
                });
            }

            // Check if quiz has ended
            if (quiz.EndAtAt < DateTime.Now)
            {
                return BadRequest(new Response<GetQuizeDto>
                {
                    httpStatusCode = HttpStatusCode.BadRequest,
                    Succeeded = false,
                    Massage = "Quiz has ended",
                    Errors = new List<string> { $"Quiz ended at {quiz.EndAtAt:MMMM d, yyyy 'at' h:mm tt}" }
                });
            }

            // Map to response DTO
            var quizDto = new GetQuizeDto
            {
                Id = quiz.Id,
                Title = quiz.Title,
                Description = quiz.Description,
                StartsAt = quiz.StartsAt,
                DurationMinutes = quiz.DurationMinutes,
                EndAt = quiz.EndAtAt,
                SendQuizeQuestions = quiz.questions?.Select(q => new SendQuizeQuestion
                {
                    QuestionText = q.QuestionText,
                    QuestionTypeId = q.QuestionTypeId,
                    Points = q.Points,
                    CorrectAnswer = q.CorrectAnswer,
                    StudentAnswer = null, // Student hasn't answered yet
                    Options = q.QuestionTypeId == QuestionType.MCQ
                        ? q.Options?.ToDictionary(opt => opt.OptionText, opt => opt.IsCorrect)
                        : null
                }).ToList() ?? new List<SendQuizeQuestion>()
            };

            return Ok(new Response<GetQuizeDto>
            {
                httpStatusCode = HttpStatusCode.OK,
                Succeeded = true,
                Massage = "Quiz retrieved successfully",
                Data = quizDto
            });
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

    //[HttpPost("SubmitQuiz")]
    //public async Task<ActionResult<Response<SubmitQuizResponseDto>>> SubmitQuiz([FromBody] SubmitQuizDto submission)
    //{
    //    try
    //    {
    //        // 1. Verify Quiz and Student exist and load related data
    //        var quiz = await _context.Quizzes
    //            .Include(q => q.questions)!
    //                .ThenInclude(q => q.Options)
    //        .FirstOrDefaultAsync(q => q.Id == submission.QuizId);

    //        var student = await _context.Users.OfType<Student>().FirstOrDefaultAsync(s => s.Id == submission.StudentId);

    //        if (quiz == null)
    //        {
    //            return NotFound(new Response<SubmitQuizResponseDto>
    //            {
    //                httpStatusCode = HttpStatusCode.NotFound,
    //                Succeeded = false,
    //                Massage = "Quiz not found",
    //                Errors = new List<string> { "The specified quiz does not exist." }
    //            });
    //        }

    //        if (student == null)
    //        {
    //            return NotFound(new Response<SubmitQuizResponseDto>
    //            {
    //                httpStatusCode = HttpStatusCode.NotFound,
    //                Succeeded = false,
    //                Massage = "Student not found",
    //                Errors = new List<string> { "The specified student does not exist." }
    //            });
    //        }

    //        // 2. Check if quiz is still active for submission (considering potential auto-submit on end time)
    //        // Note: A more robust solution might involve checking server time vs quiz end time more strictly,
    //        // or having a background job handle true auto-submission after a grace period.
    //        // For this implementation, we allow submission up to the EndAtAt time.
    //        if (DateTime.Now > quiz.EndAtAt.AddMinutes(1)) // Allow a small buffer
    //        {
    //            return BadRequest(new Response<SubmitQuizResponseDto>
    //            {
    //                httpStatusCode = HttpStatusCode.BadRequest,
    //                Succeeded = false,
    //                Massage = "Quiz submission window has closed",
    //                Errors = new List<string> { $"The quiz ended at {quiz.EndAtAt:MMMM d, yyyy 'at' h:mm tt}." }
    //            });
    //        }

    //        // 3. Check if student has already submitted for this quiz
    //        var existingSubmission = await _context.studentQuizeAnswers
    //            .FirstOrDefaultAsync(sa => sa.StudentId == submission.StudentId && sa.QuizId == submission.QuizId);

    //        if (existingSubmission != null)
    //        {
    //            return BadRequest(new Response<SubmitQuizResponseDto>
    //            {
    //                httpStatusCode = HttpStatusCode.BadRequest,
    //                Succeeded = false,
    //                Massage = "Quiz already submitted",
    //                Errors = new List<string> { "You have already submitted this quiz." }
    //            });
    //        }

    //        // 4. Create a new StudentQuizeAnswer entry
    //        var studentQuizAnswer = new StudentQuizeAnswer
    //        {
    //            StudentId = submission.StudentId,
    //            QuizId = submission.QuizId,
    //            // Grading will be calculated later if IsAutoCorrect is true
    //            GradingRating = null,
    //            NumberOfAswered = submission.Answers.Count,
    //            IsPassed = null
    //        };

    //        await _context.studentQuizeAnswers.AddAsync(studentQuizAnswer);
    //        await _context.SaveChangesAsync(); // Save to get the studentQuizAnswer ID

    //        // 5. Save student's answers for each question
    //        var studentQuestionAnswers = new List<StudentQuestionAnswer>();
    //        foreach (var submittedAnswer in submission.Answers)
    //        {
    //            var question = quiz.questions?.FirstOrDefault(q => q.Id == submittedAnswer.QuestionId);
    //            if (question == null) continue; // Skip if question not found (shouldn't happen with valid submission)

    //            var studentQuestionAnswer = new StudentQuestionAnswer
    //            {
    //                QuestionId = submittedAnswer.QuestionId,
    //                studentQuizeAnswerId = studentQuizAnswer.Id,
    //                IsCorrect = false, // Default to false, update if auto-corrected
    //            };

    //            if (question.QuestionTypeId == QuestionType.Text)
    //            {
    //                // For Text questions, save the text answer
    //                studentQuestionAnswer.StudentAnswerText = submittedAnswer.StudentAnswerText;
    //                // Auto-correction for text answers would require external service integration (like Gemini)
    //                // For now, IsCorrect remains false unless manual grading happens later.
    //            }
    //            else if (question.QuestionTypeId == QuestionType.MCQ)
    //            {
    //                // For MCQ questions, save selected option(s)
    //                if (submittedAnswer.SelectedOptionIds != null && submittedAnswer.SelectedOptionIds.Any())
    //                {
    //                    studentQuestionAnswer.studentQuestionOptions = submittedAnswer.SelectedOptionIds.Select(optionId => new StudentQuestionOption
    //                    {
    //                        QuestionOptionId = optionId
    //                    }).ToList();

    //                    // If auto-correct is enabled, check if the selected options are correct
    //                    if (quiz.IsAutoCorrect)
    //                    {
    //                        // Assuming single correct option for simplicity for now
    //                        var correctOption = question.Options?.FirstOrDefault(o => o.IsCorrect);
    //                        studentQuestionAnswer.IsCorrect = submittedAnswer.SelectedOptionIds.Count == 1 && submittedAnswer.SelectedOptionIds.Contains(correctOption?.Id ?? 0);
    //                    }
    //                }
    //            }
    //            studentQuestionAnswers.Add(studentQuestionAnswer);
    //        }

    //        if (studentQuestionAnswers.Any())
    //        {
    //            await _context.StudentQuestionAnswers.AddRangeAsync(studentQuestionAnswers);
    //            await _context.SaveChangesAsync();
    //        }

    //        // 6. Auto-correct if enabled
    //        if (quiz.IsAutoCorrect)
    //        {
    //            int correctAnswersCount = studentQuestionAnswers.Count(sa => sa.IsCorrect == true);
    //            int totalPointsEarned = studentQuestionAnswers
    //                .Where(sa => sa.IsCorrect == true)
    //                .Sum(sa => quiz.questions.FirstOrDefault(q => q.Id == sa.QuestionId)?.Points ?? 0);

    //            decimal gradingRating = quiz.PossiblePoints > 0 ? (decimal)totalPointsEarned * 100 / quiz.PossiblePoints : 0;
    //            bool isPassed = gradingRating >= 50; // Assuming a pass threshold of 50%

    //            studentQuizAnswer.GradingRating = gradingRating;
    //            studentQuizAnswer.NumberOfAswered = correctAnswersCount;
    //            studentQuizAnswer.IsPassed = isPassed;

    //            _context.studentQuizeAnswers.Update(studentQuizAnswer);
    //            await _context.SaveChangesAsync();
    //        }

    //        // 7. Prepare response
    //        var responseDto = new SubmitQuizResponseDto
    //        {
    //            QuizId = quiz.Id,
    //            StudentId = student.Id,
    //            IsAutoCorrected = quiz.IsAutoCorrect,
    //            GradingRating = studentQuizAnswer.GradingRating,
    //            NumberOfAnsweredCorrectly = studentQuizAnswer.NumberOfAswered,
    //            IsPassed = studentQuizAnswer.IsPassed,
    //            Message = quiz.IsAutoCorrect ? "Quiz submitted and graded successfully" : "Quiz submitted successfully. Grading will be done manually."
    //        };

    //        return Ok(new Response<SubmitQuizResponseDto>
    //        {
    //            httpStatusCode = HttpStatusCode.OK,
    //            Succeeded = true,
    //            Massage = responseDto.Message,
    //            Data = responseDto
    //        });
    //    }
    //    catch (Exception ex)
    //    {
    //        return StatusCode(500, new Response<SubmitQuizResponseDto>
    //        {
    //            httpStatusCode = HttpStatusCode.InternalServerError,
    //            Succeeded = false,
    //            Massage = "Failed to submit quiz",
    //            Errors = new List<string> { ex.Message }
    //        });
    //    }
    //}
























    //[HttpGet("GetQuizWithAnswers")]
    //public async Task<IActionResult> GetQuizWithAnswers([FromQuery] int lessonId)
    //{

    //    var quiz = await _unitOfWork.Repository<Quiz>().GetTableNoTracking()
    //        .Include(q => q.questions)
    //        .ThenInclude(q => q.Options)
    //                                 .Where(q => q.LessonId == lessonId)
    //        .FirstOrDefaultAsync();

    //    if (quiz == null)
    //        return NotFound("Quiz not found");

    //    var questionsWithCorrectAnswers = quiz.questions.Select(q => new
    //    {
    //        questionText = q.QuestionText,
    //        correctAnswer = q.CorrectAnswer,
    //        points = q.Points,
    //        questionTypeId = q.QuestionTypeId,
    //        options = q.Options?.Select(o => new { o.OptionText, o.IsCorrect }) // If you want to include options
    //    }).ToList();

    //    return Ok(new
    //    {
    //        quizId = quiz.Id,
    //        quizTitle = quiz.Title, // or any other quiz info
    //        questions = questionsWithCorrectAnswers
    //    });
    //}

    //[HttpGet("GetQuizeByLessoinId")]
    //public async Task<IActionResult> GetQuizeByLessoinId(int lessonId)
    //{
    //    // check if qize exist and startAt comming
    //    // not return not
    //    var quiz = await _unitOfWork.Repository<Quiz>()
    //                                     .GetTableNoTracking()
    //                                     .Where(q => q.LessonId == lessonId)
    //                                     .FirstOrDefaultAsync();
    //    // Check if quiz exists
    //    if (quiz == null)
    //        return NotFound("Quiz not found for the given lesson.");

    //    // Check if quiz has started
    //    //if (quiz.StartsAt > DateTime.Now)
    //    //    return NotFound("Quiz has not started yet.");



    //    // get quize with question 
    //    var quizeDtos = await _unitOfWork.Repository<Quiz>()
    //        .GetTableNoTracking()
    //        .Include(q => q.questions)!
    //            .ThenInclude(q => q.Options)
    //             .Where(q => q.LessonId == lessonId)
    //        .ToListAsync(); // Force EF to fetch all data first (move to memory)

    //    var mapped = quizeDtos.Select(quiz => new GetQuizeDto
    //    {
    //        Id = quiz.Id,
    //        Title = quiz.Title,
    //        Description = quiz.Description,
    //        StartsAt = quiz.StartsAt,
    //        DurationMinutes = quiz.DurationMinutes,
    //        EndAt = quiz.StartsAt.AddMinutes(quiz.DurationMinutes),
    //        SendQuizeQuestions = quiz.questions!.Select(q => new SendQuizeQuestion
    //        {
    //            QuestionText = q.QuestionText,
    //            QuestionTypeId = q.QuestionTypeId,
    //            Points = q.Points,
    //            CorrectAnswer = q.CorrectAnswer,
    //            StudentAnswer = null,
    //            Options = q.QuestionTypeId == QuestionType.MCQ
    //                ? q.Options!.ToDictionary(opt => opt.OptionText, opt => opt.IsCorrect)
    //                : null
    //        }).ToList()
    //    }).ToList();

    //    return Ok(mapped);

    //}
    //[HttpPost("SubmitAnswers")]
    //public async Task<IActionResult> SubmitAnswers([FromBody] QuizSubmissionDto submission)
    //{
    //    try
    //    {
    //        var quiz = await _unitOfWork.Repository<Quiz>()
    //                                         .GetTableNoTracking()
    //                                         .Include(q => q.questions)
    //                                         .ThenInclude(q => q.Options)
    //                                         .FirstOrDefaultAsync(q => q.Id == submission.QuizId);

    //        if (quiz == null)
    //            return NotFound("Quiz not found");

    //        int totalPoints = 0;
    //        int earnedPoints = 0;
    //        int correctAnswers = 0;

    //        foreach (var question in quiz.questions)
    //        {
    //            totalPoints += question.Points;

    //            var studentAnswer = submission.Answers
    //                .FirstOrDefault(a => a.QuestionText == question.QuestionText)?
    //                .StudentAnswer?.Trim();

    //            if (string.IsNullOrEmpty(studentAnswer))
    //            {
    //                continue; // no answer provided
    //            }

    //            if (question.QuestionTypeId == QuestionType.Text)
    //            {
    //                // Prepare prompt for GeminiService comparing two answers
    //                var prompt = $"Compare these two answers and tell me if they match with at least 70% similarity or have the same meaning:\n" +
    //                             $"Answer 1: \"{studentAnswer}\"\n" +
    //                             $"Answer 2: \"{question.CorrectAnswer.Trim()}\" if it match just return match and if not return false";

    //                // Call external service to get comparison response
    //                var response = await _geminiService.GetResponseAsync(prompt);

    //                // Example: Assume response contains "match" if answers are similar
    //                if (response != null && response.Contains("match", StringComparison.OrdinalIgnoreCase))
    //                {
    //                    correctAnswers++;
    //                    earnedPoints += question.Points;
    //                }
    //            }
    //            else
    //            {
    //                // For other question types, direct equality ignoring case
    //                if (studentAnswer.Equals(question.CorrectAnswer.Trim(), StringComparison.OrdinalIgnoreCase))
    //                {
    //                    correctAnswers++;
    //                    earnedPoints += question.Points;
    //                }
    //            }
    //        }

    //        int grade = totalPoints > 0 ? (earnedPoints * 100) / totalPoints : 0;
    //        bool isPassed = grade >= 50; // pass threshold

    //        var result = new StudentQuizeAnswer
    //        {
    //            StudentId = submission.StudentId,
    //            QuizId = submission.QuizId,
    //            GradingRating = grade,
    //            NumberOfAswered = correctAnswers,
    //            IsPassed = isPassed
    //        };
    //        // send email with grade to student 
    //        await _unitOfWork.Repository<StudentQuizeAnswer>().AddAsync(result);
    //        var isSaved = _unitOfWork.Complete();

    //        if (isSaved <= 0) return BadRequest("error happen when saving data");

    //        return Ok(new
    //        {
    //            message = "Quiz submitted",
    //            grade,
    //            correctAnswers,
    //            isPassed
    //        });
    //    }
    //    catch
    //    {
    //        return BadRequest("error try later");
    //    }
    //}
    //[HttpPost("Create")]
    //public async Task<IActionResult> CreateQuize(CreateQuizeWithQuestionDto dto)
    //{
    //    // save data in his place 

    //    // first save quize
    //    var quiz = MapToEntity(dto);

    //    await _unitOfWork.Repository<Quiz>().AddAsync(quiz);
    //    var result = _unitOfWork.Complete();

    //    if (result < 0)
    //    {
    //        return BadRequest("can not create");
    //    }

    //    // send email to all student
    //    string emailSubject = $"Upcoming Quiz: \"{quiz.Title}\" Scheduled on {quiz.StartsAt:MMMM d, yyyy 'at' h:mm tt}";

    //    string emailMessage = $@"
    //                                Dear Student,

    //                                We hope this message finds you well.
    //                                You are invited to participate in an upcoming quiz as part of your course lesson.

    //                                📘 Quiz Details:
    //                                - Title: {quiz.Title}
    //                                - Lesson: {quiz.Lesson?.Title ?? "N/A"}
    //                                - Description: {quiz.Description ?? "No description provided."}
    //                                - Start Time: {quiz.StartsAt:MMMM d, yyyy 'at' h:mm tt}
    //                                - Duration: {quiz.DurationMinutes} minutes


    //                                📝 Important Notes:
    //                                - Please ensure you join the quiz on time.
    //                                - Once started, you must complete it within the allocated duration.
    //                                - Make sure your internet connection is stable.

    //                                If you have any questions or need assistance, feel free to contact your instructor.

    //                                Best regards,
    //                                Course Team
    //                                ";

    //    try
    //    {
    //        //  var students = _unitOfWork.Repository<Student>().GetTableNoTracking().Where(s => s.IsDeleted == false);
    //        //foreach (var student in students)
    //        //{
    //        //    await _emailSender.SendEmailAsync(student.Email, subject: emailSubject, message: emailMessage);
    //        //}

    //        await _emailSender.SendEmailAsync("hadeer.abdelgawad33@outlook.con", subject: emailSubject, message: emailMessage);
    //        return Ok("Created..... ");

    //    }

    //    catch
    //    {
    //        return Ok("Created..... ");

    //    }
    //}

    //public static Quiz MapToEntity(CreateQuizeWithQuestionDto dto)
    //{
    //    var quiz = new Quiz
    //    {
    //        LessonId = dto.LessonId,
    //        Title = dto.Title,
    //        Description = dto.Description,
    //        StartsAt = dto.StartsAt,
    //        DurationMinutes = dto.DurationMinutes,
    //        CreatedAt = DateTime.Now,
    //        NumberOfQuestions = dto.questionListDtos?.Count ?? 0,
    //        PossiblePoints = dto.questionListDtos?.Sum(q => q.Points) ?? 0,
    //        questions = dto.questionListDtos?.Select(qDto => new Question
    //        {
    //            QuestionText = qDto.QuestionText,
    //            QuestionTypeId = qDto.QuestionTypeId,
    //            Points = qDto.Points,
    //            CorrectAnswer = qDto.CorrectAnswer,
    //            Options = qDto.Options?.Select(opt => new QuestionOption
    //            {
    //                OptionText = opt.Key,
    //                IsCorrect = opt.Value
    //            }).ToList()
    //        }).ToList()
    //    };

    //    return quiz;
    //}
    //public class QuizSubmissionDto
    //{
    //    public int StudentId { get; set; }
    //    public int QuizId { get; set; }
    //    public List<StudentAnswerDto> Answers { get; set; } = new();
    //}
    //public class StudentAnswerDto
    //{
    //    public string QuestionText { get; set; }
    //    public int QuestionTypeId { get; set; }  // <-- added question type
    //    public string? StudentAnswer { get; set; }
    //}
}