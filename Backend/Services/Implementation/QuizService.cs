namespace Backend.Services.Implementation;

public class QuizService : ResponseHandler, IQuizService
{

    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly IEmailSender _emailSender;

    public QuizService(IUnitOfWork unitOfWork, IMapper mapper, IEmailSender emailSender)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _emailSender = emailSender;
    }

    public List<QuizToCorrectDto> GetQuizzesToCorrectByLessonId(int lessonId)
    {
        var quizzesToCorrect = _unitOfWork.Repository<StudentQuizeAnswer>()
            .GetTableNoTracking()
            .Where(sqa => sqa.Quiz.LessonId == lessonId && !sqa.Quiz.IsAutoCorrect)
            .Select(sqa => new QuizToCorrectDto
            {
                StudentQuizAnswerId = sqa.Id,
                QuizName = sqa.Quiz.Title,
                StudentName = sqa.Student.Name
            })
            .ToList();
        return quizzesToCorrect;
    }

    public async Task<Response<StudentQuizAnswerDto>> GetStudentQuizAnswer(int answerId)
    {
        var result = await _unitOfWork.Repository<StudentQuizeAnswer>()
                                                       .GetTableNoTracking()
                                                       .Where(a => a.Id == answerId)
                                                       .Include(a => a.StudentQuestionAnswer)!
                                                       .ThenInclude(opt => opt.studentQuestionOptions)
                                                       .Select(a => new StudentQuizAnswerDto
                                                       {
                                                           QuizTitle = a.Quiz.Title,
                                                           StudentName = a.Student.Name,
                                                           Que = a.StudentQuestionAnswer.Where(q => q.StudentAnswerText != null).Select(sqa => new Que
                                                           {
                                                               QuestionId = sqa.Id,
                                                               QuestionText = sqa.Question.QuestionText,
                                                               QuestionTextAnswer = sqa.StudentAnswerText!,
                                                           }).ToList(),
                                                       }).FirstOrDefaultAsync();

        return result == null ? BadRequest<StudentQuizAnswerDto>("No Text question") : Success(result);
    }

    public async Task<Response<string>> CorrectQuiz(int studentQuizAnswerId, List<CorrectQuizDto> dto)
    {
        foreach (var item in dto)
        {
            var answer = await _unitOfWork.Repository<StudentQuestionAnswer>()
                                         .GetTableAsTracking()
                                         .Where(a => a.Id == item.AnswerId)
                                         .FirstOrDefaultAsync();


            if (answer == null)
                return BadRequest<string>("Answer not found");

            answer.IsCorrect = item.IsCorrect;
        }

        _unitOfWork.Complete();


        var q = await _unitOfWork.Repository<StudentQuestionAnswer>()
                                                  .GetTableAsTracking()
                                                  .Where(a => a.studentQuizeAnswerId == studentQuizAnswerId)
                                                  .Select(q => new
                                                  {
                                                      Points = q.Question.Points,
                                                      IsCorrect = q.IsCorrect,
                                                  }).ToListAsync();
        int totalPoint = 0;
        int degree = 0;
        int numberOfAnswered = 0;

        foreach (var item in q)
        {

            if (item.IsCorrect != null && item.IsCorrect == true)
            {
                degree += item.Points;
                numberOfAnswered++;
            }

            totalPoint += item.Points;
        }

        decimal gradingRating = numberOfAnswered > 0
               ? (decimal)degree * 100 / totalPoint
               : 0;
        bool isPassed = gradingRating >= 50;

        var studentQuizAnswer = await _unitOfWork.Repository<StudentQuizeAnswer>()
                                                  .GetTableAsTracking()
                                                  .FirstOrDefaultAsync(a => a.Id == studentQuizAnswerId);

        studentQuizAnswer.GradingRating = gradingRating;
        studentQuizAnswer.IsPassed = isPassed;
        studentQuizAnswer.NumberOfAswered = numberOfAnswered;

        var finalResult = _unitOfWork.Complete();
        return finalResult > 0 ? Success("Quiz Correct successfully") : BadRequest<string>("error happen whe try correct it");
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
                        QuizName = GeneralLocalizableEntity.Localized(quiz.TitleAr, quiz.TitleEn),
                        StudentDegree = studentDegree,
                        StudentPercentage = studentPercentage
                    });
                }

                lessonStats.Add(new LessonQuizStatsDto
                {
                    LessonName = GeneralLocalizableEntity.Localized(lesson.TitleAr, lesson.TitleEn),
                    NumberOfQuizzesInLesson = numQuizzesInLesson,
                    PercentageOfDegreeForAllQuizzes = lessonPercentageDegree,
                    Quizzes = quizStats
                });
            }

            result.Add(new CourseStudentQuizStatsDto
            {
                StudentName = GeneralLocalizableEntity.Localized(student.NameAr, student.NameEn),
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
                    QuizName = GeneralLocalizableEntity.Localized(quiz.TitleAr, quiz.TitleEn),
                    StudentDegree = studentDegree,
                    StudentPercentage = studentPercentage
                });
            }

            lessonStats.Add(new LessonQuizStatsDto
            {
                LessonName = GeneralLocalizableEntity.Localized(lesson.TitleAr, lesson.TitleEn),
                NumberOfQuizzesInLesson = numQuizzesInLesson,
                PercentageOfDegreeForAllQuizzes = lessonPercentageDegree,
                Quizzes = quizStats
            });
        }

        return new StudentCourseQuizStatsDto
        {
            StudentName = GeneralLocalizableEntity.Localized(student.NameAr, student.NameEn),
            NumberOfQuizzesSubmitted = submittedQuizzes,
            PercentageOfSubmitted = percentageSubmitted,
            PercentageOfDegree = percentageDegree,
            PercentageOfPassQuiz = percentagePassed,
            Lessons = lessonStats
        };
    }




    public async Task<Response<GetQuizeDto>> GetQuizById(int quizId)
    {
        // Get quiz with questions and options
        var quiz = await _unitOfWork.Repository<Quiz>()
                                         .GetTableAsTracking()
                                         .Include(q => q.questions)!
                                         .ThenInclude(q => q.Options)
                                        .FirstOrDefaultAsync(q => q.Id == quizId);

        if (quiz == null)
        {
            var response = new Response<GetQuizeDto>
            {
                httpStatusCode = HttpStatusCode.NotFound,
                Succeeded = false,
                Massage = "Quiz not found",
                Errors = new List<string> { "The specified quiz does not exist" }
            };

            return response;
        }

        // Check if quiz has started    or ended
        //if (quiz.StartsAt > DateTime.Now || quiz.EndAtAt < DateTime.Now)
        //{
        //    return BadRequest(new Response<GetQuizeDto>
        //    {
        //        httpStatusCode = HttpStatusCode.BadRequest,
        //        Succeeded = false,
        //        Massage = "Quiz has not started yet or ended",
        //        Errors = new List<string> { $"Quiz will be available at {quiz.StartsAt:MMMM d, yyyy 'at' h:mm tt}",
        //                                    $"Quiz ended at {quiz.EndAtAt:MMMM d, yyyy 'at' h:mm tt}" }
        //    });
        //}

        // Map to response DTO
        var quizDto = MapToGetQuizeDto(quiz);

        var result = new Response<GetQuizeDto>
        {
            httpStatusCode = HttpStatusCode.OK,
            Succeeded = true,
            Massage = "Quiz retrieved successfully",
            Data = quizDto
        };
        return result;
    }
    public async Task<Response<List<LessonQuizListDto>>> GetLessonQuizzes(int lessonId)
    {
        // Verify lesson exists
        var lesson = await _unitOfWork.Repository<Lesson>()
                                            .GetTableAsTracking()
                                            .FirstOrDefaultAsync(l => l.Id == lessonId);
        if (lesson == null)
        {
            var response = new Response<List<LessonQuizListDto>>
            {
                httpStatusCode = HttpStatusCode.NotFound,
                Succeeded = false,
                Massage = "Quiz not found",
                Errors = new List<string> { "The specified quiz does not exist" }
            };

            return response;
        }

        // Get all quizzes for the lesson
        var quizzes = await _unitOfWork.Repository<Quiz>()
                                                          .GetTableAsTracking()
                                                          .Where(q => q.LessonId == lessonId)
                                                          .Select(q => new LessonQuizListDto
                                                          {
                                                              QuizId = q.Id,
                                                              QuizName = GeneralLocalizableEntity.Localized(q.TitleAr, q.TitleEn),
                                                              CreatedAt = q.CreatedAt,
                                                              TotalQuestions = q.questions != null ? q.questions.Count : 0,
                                                              TotalPoints = q.questions != null ? q.PossiblePoints : 0
                                                          })
                                                          .ToListAsync();


        return Success(quizzes);
    }
    public async Task<Response<string>> CreateQuizWithCourse(CreateQuizQuestionBankDto dto)
    {
        // Verify course exists
        var course = await _unitOfWork.Repository<Course>()
            .GetTableNoTracking()
            .FirstOrDefaultAsync(c => c.Id == dto.CourseId);

        if (course == null) return BadRequest<string>("Course not found");


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
            return BadRequest<string>("Failed to create question bank");

        return Success("Question bank created successfully");
    }
    public async Task<Response<string>> CreateQuizWithLesson(CreateQuizeWithQuestionDto dto)
    {
        // Map DTO to Quiz entity using the existing helper method
        var quiz = MapToEntity(dto);

        // Save quiz to database
        await _unitOfWork.Repository<Quiz>().AddAsync(quiz);
        var result = _unitOfWork.Complete();

        if (result <= 0)
            return BadRequest<string>("Failed to create quiz");

        try
        {
            // send emails to student
            await SendEmailsToStudnet(quiz, dto.LessonId);
        }
        catch (Exception ex)
        {
            // Log email sending error but don't fail the quiz creation
            // TODO: Add proper logging
        }

        return Success("Quiz created successfully");
    }

    private GetQuizeDto MapToGetQuizeDto(Quiz quiz)
    {

        var quizDto = new GetQuizeDto
        {
            Id = quiz.Id,
            Title = GeneralLocalizableEntity.Localized(quiz.TitleAr, quiz.TitleEn),
            Description = GeneralLocalizableEntity.Localized(quiz.TitleAr, quiz.TitleEn),
            StartsAt = quiz.StartsAt,
            DurationMinutes = quiz.DurationMinutes,
            EndAt = quiz.EndAtAt,

            SendQuizeQuestions = quiz.questions?.Select(q => new SendQuizeQuestion
            {
                QuestionText = q.QuestionText,
                QuestionTypeId = q.QuestionTypeId,
                Points = q.Points,
                QuestionId = q.Id,
                Options = q.QuestionTypeId == QuestionType.MCQ
                    ? q.Options?.ToDictionary(opt => opt.OptionText, opt => opt.Id)
                    : null
            }).ToList() ?? new List<SendQuizeQuestion>()
        };

        return quizDto;
    }
    private static Quiz MapToEntity(CreateQuizeWithQuestionDto dto)
    {
        var quiz = new Quiz { 
            TitleAr = dto.Title,
            TitleEn = dto.Title,
        };
        

        CultureInfo cultureInfo = Thread.CurrentThread.CurrentCulture;

        if (cultureInfo.TwoLetterISOLanguageName.ToLower().Equals("ar"))
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
            IsAutoCorrect = dto.IsAutoCorrect,
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
            }).ToList();
        }
        else
        {
            quiz.LessonId = dto.LessonId;
            quiz.TitleEn = dto.Title;
            quiz.DescriptionEn = dto.Description;
            quiz.StartsAt = dto.StartsAt;
            quiz.DurationMinutes = dto.DurationMinutes;
            quiz.CreatedAt = DateTime.Now;
            quiz.EndAtAt = dto.StartsAt.AddMinutes(dto.DurationMinutes);
            quiz.NumberOfQuestions = dto.questionListDtos?.Count ?? 0;
            quiz.PossiblePoints = dto.questionListDtos?.Sum(q => q.Points) ?? 0;
            quiz.IsAutoCorrect = dto.IsAutoCorrect;
            quiz.questions = dto.questionListDtos?.Select(qDto => new Question
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
            }).ToList();
        }

        return quiz;
    }
    private async Task<List<string?>?> GetEmailsForStudent(int lessonId)
    {
        var studentEmails = await _unitOfWork.Repository<Lesson>()
                                                         .GetTableNoTracking()
                                                         .Include(l => l.Course)
                                                         .ThenInclude(c => c.StudentCourses)!
                                                         .ThenInclude(sc => sc.Student)
                                                         .Where(l => l.Id == lessonId)
                                                         .SelectMany(l => l.Course!.StudentCourses!.Select(sc => sc.Student!.Email))
                                                         .ToListAsync();
        return studentEmails;
    }
    private async Task<bool> SendEmailsToStudnet(Quiz quiz, int lessonId)
    {
        // Send email notification to students
        string emailSubject = $"New Quiz: \"{GeneralLocalizableEntity.Localized(quiz.TitleAr, quiz.TitleEn)}\" Scheduled for {quiz.StartsAt:MMMM d, yyyy 'at' h:mm tt}";
        string emailMessage = $@"
                                    <html>
                                      <body style='font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px; color: #333;'>
                                        <div style='background-color: #ffffff; padding: 20px; border-radius: 10px; max-width: 600px; margin: auto; box-shadow: 0 0 10px rgba(0,0,0,0.05);'>
                                    
                                          <h2 style='color: #007BFF;'>📘 New Quiz Scheduled</h2>
                                          <p>Dear Student,</p>
                                    
                                          <p>A new quiz has been created for your course lesson.</p>
                                    
                                          <h3 style='color: #333; margin-top: 20px;'>📋 Quiz Details:</h3>
                                          <ul style='padding-left: 20px;'>
                                            <li style='margin-bottom: 8px;'><strong>Title:</strong> {GeneralLocalizableEntity.Localized(quiz.TitleAr, quiz.TitleEn)}</li>
                                            <li style='margin-bottom: 8px;'><strong>Description:</strong> {GeneralLocalizableEntity.Localized(quiz.DescriptionAr, quiz.DescriptionEn) ?? "No description provided."}</li>
                                            <li style='margin-bottom: 8px;'><strong>Start Time:</strong> {quiz.StartsAt:MMMM d, yyyy 'at' h:mm tt}</li>
                                            <li style='margin-bottom: 8px;'><strong>Duration:</strong> {quiz.DurationMinutes} minutes</li>
                                            <li style='margin-bottom: 8px;'><strong>Number of Questions:</strong> {quiz.NumberOfQuestions}</li>
                                            <li style='margin-bottom: 8px;'><strong>Total Points:</strong> {quiz.PossiblePoints}</li>
                                          </ul>
                                    
                                          <h3 style='color: #333; margin-top: 20px;'>📝 Important Notes:</h3>
                                          <ul style='padding-left: 20px;'>
                                            <li style='margin-bottom: 8px;'>Please ensure you join the quiz on time.</li>
                                            <li style='margin-bottom: 8px;'>You must complete it within the allocated duration.</li>
                                            <li style='margin-bottom: 8px;'>Make sure your internet connection is stable.</li>
                                          </ul>
                                    
                                          <p style='margin-top: 20px; font-size: 0.9em; color: #666;'>Best regards,<br/>Course Team</p>
                                        </div>
                                      </body>
                                    </html>";

        var studentEmails = await GetEmailsForStudent(lessonId);
        if (studentEmails == null) return false;

        foreach (var email in studentEmails)
        {
            await _emailSender.SendEmailAsync(email, emailSubject, emailMessage);
        }

        return true;
    }


    public async Task<Response<LessonQuizesStatsDto>> GetLessonQuizStats(int lessonId)
    {
        var lesson = await _unitOfWork.Repository<Lesson>()
            .GetTableNoTracking()
            .Include(l => l.Quizs)
            .ThenInclude(q => q.StudentQuizeAnswers)
            .ThenInclude(sqa => sqa.Student)
            .FirstOrDefaultAsync(l => l.Id == lessonId);
        if (lesson == null) return NotFound<LessonQuizesStatsDto>("Lesson not found");

        var quizzes = lesson.Quizs;
        int totalQuizzes = quizzes.Count;
        var quizAnalyticsList = new List<QuizAnalyticsDto>();
        int totalStudents = await _unitOfWork.Repository<StudentCourse>()
            .GetTableNoTracking()
            .Where(sc => sc.CourseId == lesson.CourseId && !sc.IsDeleted)
            .CountAsync();

        foreach (var quiz in quizzes)
        {
            var studentAnswers = quiz.StudentQuizeAnswers ?? new List<StudentQuizeAnswer>();
            int numSubmitted = studentAnswers.Count;
            double percentageOfSubmit = totalStudents > 0 ? (double)numSubmitted / totalStudents * 100 : 0;
            double percentageWithDegree = quiz.PossiblePoints > 0 && numSubmitted > 0
                ? studentAnswers.Sum(a => (double?)a.GradingRating ?? 0) / (quiz.PossiblePoints * numSubmitted) * 100
                : 0;
            int numUnder50 = studentAnswers.Count(a => (double)(a.GradingRating ?? 0) < (quiz.PossiblePoints * 0.5));
            int numOver70 = studentAnswers.Count(a => (double)(a.GradingRating ?? 0) >= (quiz.PossiblePoints * 0.7));
            int numWith100 = studentAnswers.Count(a => (a.GradingRating ?? 0) == quiz.PossiblePoints);

            var studentSubmissions = studentAnswers.Select(a => new StudentQuizSubmissionDto
            {
                StudentName = a.Student?.Name,
                StudentDegree = (double)(a.GradingRating ?? 0),
                NumberOfSubmittedQuestions = a.StudentQuestionAnswer?.Count ?? 0
            }).ToList();

            quizAnalyticsList.Add(new QuizAnalyticsDto
            {
                QuizName = quiz.Title,
                PercentageWithDegree = percentageWithDegree,
                NumberOfStudentSubmit = numSubmitted,
                PercentageOfSubmit = percentageOfSubmit,
                NumberOfStudentUnder50 = numUnder50,
                NumberOfStudentOver70 = numOver70,
                NumberOfStudentWith100 = numWith100,
                StudentSubmissions = studentSubmissions
            });
        }

        var result = new LessonQuizesStatsDto
        {
            LessonName = lesson.Title,
            NumberOfQuizzes = totalQuizzes,
            PercentageOfAllQuizzes = 100, // For a single lesson, always 100%
            Quizzes = quizAnalyticsList
        };
        return Success(result);
    }

    public async Task<Response<List<LessonQuizesStatsDto>>> GetCourseLessonQuizStats(int courseId)
    {
        var lessons = await _unitOfWork.Repository<Lesson>()
            .GetTableNoTracking()
            .Where(l => l.CourseId == courseId && !l.IsDeleted)
            .Include(l => l.Quizs)
            .ThenInclude(q => q.StudentQuizeAnswers)
            .ThenInclude(sqa => sqa.Student)
            .ToListAsync();
        int totalQuizzesInCourse = lessons.SelectMany(l => l.Quizs).Count();
        var result = new List<LessonQuizesStatsDto>();
        foreach (var lesson in lessons)
        {
            int totalQuizzes = lesson.Quizs.Count;
            double percentageOfAllQuizzes = totalQuizzesInCourse > 0 ? (double)totalQuizzes / totalQuizzesInCourse * 100 : 0;
            var quizAnalyticsList = new List<QuizAnalyticsDto>();
            int totalStudents = await _unitOfWork.Repository<StudentCourse>()
                .GetTableNoTracking()
                .Where(sc => sc.CourseId == lesson.CourseId && !sc.IsDeleted)
                .CountAsync();
            foreach (var quiz in lesson.Quizs)
            {
                var studentAnswers = quiz.StudentQuizeAnswers ?? new List<StudentQuizeAnswer>();
                int numSubmitted = studentAnswers.Count;
                double percentageOfSubmit = totalStudents > 0 ? (double)numSubmitted / totalStudents * 100 : 0;
                double percentageWithDegree = quiz.PossiblePoints > 0 && numSubmitted > 0
                    ? studentAnswers.Sum(a => (double?)a.GradingRating ?? 0) / (quiz.PossiblePoints * numSubmitted) * 100
                    : 0;
                int numUnder50 = studentAnswers.Count(a => (double)(a.GradingRating ?? 0) < (quiz.PossiblePoints * 0.5));
                int numOver70 = studentAnswers.Count(a => (double)(a.GradingRating ?? 0) >= (quiz.PossiblePoints * 0.7));
                int numWith100 = studentAnswers.Count(a => (a.GradingRating ?? 0) == quiz.PossiblePoints);

                var studentSubmissions = studentAnswers.Select(a => new StudentQuizSubmissionDto
                {
                    StudentName = a.Student?.Name,
                    StudentDegree = (double)(a.GradingRating ?? 0),
                    NumberOfSubmittedQuestions = a.StudentQuestionAnswer?.Count ?? 0
                }).ToList();

                quizAnalyticsList.Add(new QuizAnalyticsDto
                {
                    QuizName = quiz.Title,
                    PercentageWithDegree = percentageWithDegree,
                    NumberOfStudentSubmit = numSubmitted,
                    PercentageOfSubmit = percentageOfSubmit,
                    NumberOfStudentUnder50 = numUnder50,
                    NumberOfStudentOver70 = numOver70,
                    NumberOfStudentWith100 = numWith100,
                    StudentSubmissions = studentSubmissions
                });
            }
            result.Add(new LessonQuizesStatsDto
            {
                LessonName = lesson.Title,
                NumberOfQuizzes = totalQuizzes,
                PercentageOfAllQuizzes = percentageOfAllQuizzes,
                Quizzes = quizAnalyticsList
            });
        }
        return Success(result);
    }
}