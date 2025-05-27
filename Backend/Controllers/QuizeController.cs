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

    public QuizeController(IUnitOfWork unitOfWork, IMapper mapper, IEmailSender emailSender, GeminiService geminiService)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _emailSender = emailSender;
        _geminiService = geminiService;
    }



    [HttpGet("GetQuizWithAnswers")]
    public async Task<IActionResult> GetQuizWithAnswers([FromQuery] int lessonId)
    {

        var quiz = await _unitOfWork.Repository<Quiz>().GetTableNoTracking()
            .Include(q => q.questions)
            .ThenInclude(q => q.Options)
                                     .Where(q => q.LessonId == lessonId)
            .FirstOrDefaultAsync();

        if (quiz == null)
            return NotFound("Quiz not found");

        var questionsWithCorrectAnswers = quiz.questions.Select(q => new
        {
            questionText = q.QuestionText,
            correctAnswer = q.CorrectAnswer,
            points = q.Points,
            questionTypeId = q.QuestionTypeId,
            options = q.Options?.Select(o => new { o.OptionText, o.IsCorrect }) // If you want to include options
        }).ToList();

        return Ok(new
        {
            quizId = quiz.Id,
            quizTitle = quiz.Title, // or any other quiz info
            questions = questionsWithCorrectAnswers
        });
    }

    [HttpGet("GetQuizeByLessoinId")]
    public async Task<IActionResult> GetQuizeByLessoinId(int lessonId)
    {
        // check if qize exist and startAt comming
        // not return not
        var quiz = await _unitOfWork.Repository<Quiz>()
                                         .GetTableNoTracking()
                                         .Where(q => q.LessonId == lessonId)
                                         .FirstOrDefaultAsync();
        // Check if quiz exists
        if (quiz == null)
            return NotFound("Quiz not found for the given lesson.");

        // Check if quiz has started
        if (quiz.StartsAt > DateTime.UtcNow)
            return NotFound("Quiz has not started yet.");



        // get quize with question 
        var quizeDtos = await _unitOfWork.Repository<Quiz>()
            .GetTableNoTracking()
            .Include(q => q.questions)!
                .ThenInclude(q => q.Options)
            .ToListAsync(); // Force EF to fetch all data first (move to memory)

        var mapped = quizeDtos.Select(quiz => new GetQuizeDto
        {
            Id = quiz.Id,
            Title = quiz.Title,
            Description = quiz.Description,
            StartsAt = quiz.StartsAt,
            DurationMinutes = quiz.DurationMinutes,
            EndAt = quiz.StartsAt.AddMinutes(quiz.DurationMinutes),
            SendQuizeQuestions = quiz.questions!.Select(q => new SendQuizeQuestion
            {
                QuestionText = q.QuestionText,
                QuestionTypeId = q.QuestionTypeId,
                Points = q.Points,
                CorrectAnswer = q.CorrectAnswer,
                StudentAnswer = null,
                Options = q.QuestionTypeId == QuestionType.MCQ
                    ? q.Options!.ToDictionary(opt => opt.OptionText, opt => opt.IsCorrect)
                    : null
            }).ToList()
        }).ToList();

        return Ok(mapped);

    }
    [HttpPost("SubmitAnswers")]
    public async Task<IActionResult> SubmitAnswers([FromBody] QuizSubmissionDto submission)
    {
        try
        {
            var quiz = await _unitOfWork.Repository<Quiz>()
                                             .GetTableNoTracking()
                                             .Include(q => q.questions)
                                             .ThenInclude(q => q.Options)
                                             .FirstOrDefaultAsync(q => q.Id == submission.QuizId);

            if (quiz == null)
                return NotFound("Quiz not found");

            int totalPoints = 0;
            int earnedPoints = 0;
            int correctAnswers = 0;

            foreach (var question in quiz.questions)
            {
                totalPoints += question.Points;

                var studentAnswer = submission.Answers
                    .FirstOrDefault(a => a.QuestionText == question.QuestionText)?
                    .StudentAnswer?.Trim();

                if (string.IsNullOrEmpty(studentAnswer))
                {
                    continue; // no answer provided
                }

                if (question.QuestionTypeId == QuestionType.Text)
                {
                    // Prepare prompt for GeminiService comparing two answers
                    var prompt = $"Compare these two answers and tell me if they match with at least 70% similarity or have the same meaning:\n" +
                                 $"Answer 1: \"{studentAnswer}\"\n" +
                                 $"Answer 2: \"{question.CorrectAnswer.Trim()}\" if it match just return match and if not return false";

                    // Call external service to get comparison response
                    var response = await _geminiService.GetResponseAsync(prompt);

                    // Example: Assume response contains "match" if answers are similar
                    if (response != null && response.Contains("match", StringComparison.OrdinalIgnoreCase))
                    {
                        correctAnswers++;
                        earnedPoints += question.Points;
                    }
                }
                else
                {
                    // For other question types, direct equality ignoring case
                    if (studentAnswer.Equals(question.CorrectAnswer.Trim(), StringComparison.OrdinalIgnoreCase))
                    {
                        correctAnswers++;
                        earnedPoints += question.Points;
                    }
                }
            }

            int grade = totalPoints > 0 ? (earnedPoints * 100) / totalPoints : 0;
            bool isPassed = grade >= 50; // pass threshold

            var result = new StudentQuizeAnswer
            {
                StudentId = submission.StudentId,
                QuizId = submission.QuizId,
                GradingRating = grade,
                NumberOfAswered = correctAnswers,
                IsPassed = isPassed
            };
            // send email with grade to student 
            await _unitOfWork.Repository<StudentQuizeAnswer>().AddAsync(result);
            var isSaved = _unitOfWork.Complete();

            if (isSaved <= 0) return BadRequest("error happen when saving data");

            return Ok(new
            {
                message = "Quiz submitted",
                grade,
                correctAnswers,
                isPassed
            });
        }
        catch
        {
            return BadRequest("error try later");
        }
    }
    [HttpPost("Create")]
    public async Task<IActionResult> CreateQuize(CreateQuizeWithQuestionDto dto)
    {
        // save data in his place 

        // first save quize
        var quiz = MapToEntity(dto);

        await _unitOfWork.Repository<Quiz>().AddAsync(quiz);
        var result = _unitOfWork.Complete();

        if (result < 0)
        {
            return BadRequest("can not create");
        }

        // send email to all student
        string emailSubject = $"Upcoming Quiz: \"{quiz.Title}\" Scheduled on {quiz.StartsAt:MMMM d, yyyy 'at' h:mm tt}";

        string emailMessage = $@"
                                    Dear Student,
                                    
                                    We hope this message finds you well.
                                    You are invited to participate in an upcoming quiz as part of your course lesson.
                                    
                                    📘 Quiz Details:
                                    - Title: {quiz.Title}
                                    - Lesson: {quiz.Lesson?.Title ?? "N/A"}
                                    - Description: {quiz.Description ?? "No description provided."}
                                    - Start Time: {quiz.StartsAt:MMMM d, yyyy 'at' h:mm tt}
                                    - Duration: {quiz.DurationMinutes} minutes

                                    
                                    📝 Important Notes:
                                    - Please ensure you join the quiz on time.
                                    - Once started, you must complete it within the allocated duration.
                                    - Make sure your internet connection is stable.
                                    
                                    If you have any questions or need assistance, feel free to contact your instructor.
                                    
                                    Best regards,
                                    Course Team
                                    ";

        await _emailSender.SendEmailAsync("yh29152@gmail.com", subject: emailSubject, message: emailMessage);
        return Ok("Created..... ");

    }

    public static Quiz MapToEntity(CreateQuizeWithQuestionDto dto)
    {
        var quiz = new Quiz
        {
            LessonId = dto.LessonId,
            Title = dto.Title,
            Description = dto.Description,
            StartsAt = dto.StartsAt,
            DurationMinutes = dto.DurationMinutes,
            CreatedAt = DateTime.Now,
            NumberOfQuestions = dto.questionListDtos?.Count ?? 0,
            PossiblePoints = dto.questionListDtos?.Sum(q => q.Points) ?? 0,
            questions = dto.questionListDtos?.Select(qDto => new Question
            {
                Id = Guid.NewGuid(),
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
    public class QuizSubmissionDto
    {
        public int StudentId { get; set; }
        public int QuizId { get; set; }
        public List<StudentAnswerDto> Answers { get; set; } = new();
    }
    public class StudentAnswerDto
    {
        public string QuestionText { get; set; }
        public int QuestionTypeId { get; set; }  // <-- added question type
        public string? StudentAnswer { get; set; }
    }
}