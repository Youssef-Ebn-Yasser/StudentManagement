namespace Backend.Services.Implementation;

public class QuizService : ResponseHandler, IQuizService
{
    #region Fields
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly IEmailSender _emailSender;
    private readonly IStructuredLogger _logger;
    #endregion

    #region Constructor
    public QuizService(IUnitOfWork unitOfWork, IMapper mapper, IEmailSender emailSender, IStructuredLogger logger)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _emailSender = emailSender;
        _logger = logger;
    }
    #endregion

    #region Method
    public List<QuizToCorrectDto> GetQuizzesToCorrectByLessonId(int lessonId)
    {
        try
        {
            _logger.LogInfo($"Getting quizzes to correct for LessonId: {lessonId}");
            
            var quizzesToCorrect = _unitOfWork.Repository<StudentQuizeAnswer>()
                .GetTableNoTracking()
                .Where(sqa => sqa.Quiz.LessonId == lessonId && !sqa.Quiz.IsAutoCorrect)
                .Select(sqa => new QuizToCorrectDto
                {
                    StudentQuizAnswerId = sqa.Id,
                    QuizName = sqa.Quiz.TitleEn,
                    StudentName = sqa.Student.NameEn
                })
                .ToList();
                
            _logger.LogInfo($"Successfully retrieved {quizzesToCorrect.Count} quizzes to correct for LessonId: {lessonId}");
            return quizzesToCorrect;
        }
        catch (Exception ex)
        {
            _logger.LogInfo($"Error getting quizzes to correct for LessonId: {lessonId}. Exception: {ex.Message}");
            throw;
        }
    }

    public async Task<Response<StudentQuizAnswerDto>> GetStudentQuizAnswer(int answerId)
    {
        try
        {
            _logger.LogInfo($"Getting student quiz answer for AnswerId: {answerId}");
            
            var result = await _unitOfWork.Repository<StudentQuizeAnswer>()
                                                       .GetTableNoTracking()
                                                       .Where(a => a.Id == answerId)
                                                       .Include(a => a.StudentQuestionAnswer)!
                                                       .ThenInclude(opt => opt.studentQuestionOptions)
                                                       .Select(a => new StudentQuizAnswerDto
                                                       {
                                                           QuizTitle = a.Quiz.TitleEn,
                                                           StudentName = a.Student.NameEn,
                                                           Que = a.StudentQuestionAnswer.Where(q => q.StudentAnswerText != null).Select(sqa => new Que
                                                           {
                                                               QuestionId = sqa.Id,
                                                               QuestionText = sqa.Question.QuestionText,
                                                               QuestionTextAnswer = sqa.StudentAnswerText!,
                                                           }).ToList(),
                                                       }).FirstOrDefaultAsync();

            if (result == null)
            {
                _logger.LogInfo($"No text question found for AnswerId: {answerId}");
                return BadRequest<StudentQuizAnswerDto>("No Text question");
            }
            
            _logger.LogInfo($"Successfully retrieved student quiz answer for AnswerId: {answerId}");
            return Success(result);
        }
        catch (Exception ex)
        {
            _logger.LogInfo($"Error getting student quiz answer for AnswerId: {answerId}. Exception: {ex.Message}");
            throw;
        }
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
        // Save changes to the database
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
        if (finalResult <= 0)
        {
            _logger.LogInfo($"Failed to correct quiz for StudentQuizAnswerId: {studentQuizAnswerId}");

            return BadRequest<string>("Failed to correct quiz");
        }
        else
        {
            _logger.LogInfo($"Quiz corrected successfully for StudentQuizAnswerId: {studentQuizAnswerId}");
            return Success("Quiz Correct successfully");
        }

       
    }

    public List<CourseStudentQuizStatsDto> GetCourseStudentQuizStats(int courseId)
    {
        try
        {
            _logger.LogInfo($"Getting course student quiz stats for CourseId: {courseId}");
            
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

            _logger.LogInfo($"Successfully retrieved course student quiz stats for CourseId: {courseId}. Found {result.Count} students");
            return result;
        }
        catch (Exception ex)
        {
            _logger.LogInfo($"Error getting course student quiz stats for CourseId: {courseId}. Exception: {ex.Message}");
            throw;
        }
    }

    public StudentCourseQuizStatsDto GetStudentCourseQuizStats(int studentId, int courseId)
    {
        try
        {
            _logger.LogInfo($"Getting student course quiz stats for StudentId: {studentId}, CourseId: {courseId}");
            
            // Get the student
            var student = _unitOfWork.Repository<Student>()
                .GetTableNoTracking()
                .FirstOrDefault(s => s.Id == studentId);
            if (student == null)
            {
                _logger.LogInfo($"Student not found for StudentId: {studentId}");
                return null;
            }

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

            var result = new StudentCourseQuizStatsDto
            {
                StudentName = GeneralLocalizableEntity.Localized(student.NameAr, student.NameEn),
                NumberOfQuizzesSubmitted = submittedQuizzes,
                PercentageOfSubmitted = percentageSubmitted,
                PercentageOfDegree = percentageDegree,
                PercentageOfPassQuiz = percentagePassed,
                Lessons = lessonStats
            };

            _logger.LogInfo($"Successfully retrieved student course quiz stats for StudentId: {studentId}, CourseId: {courseId}");
            return result;
        }
        catch (Exception ex)
        {
            _logger.LogInfo($"Error getting student course quiz stats for StudentId: {studentId}, CourseId: {courseId}. Exception: {ex.Message}");
            throw;
        }
    }




    public async Task<Response<GetQuizeDto>> GetQuizById(int quizId)
    {
        try
        {
            _logger.LogInfo($"Getting quiz by ID: {quizId}");
            
            // Get quiz with questions and options
            var quiz = await _unitOfWork.Repository<Quiz>()
                                         .GetTableAsTracking()
                                         .Include(q => q.questions)!
                                         .ThenInclude(q => q.Options)
                                        .FirstOrDefaultAsync(q => q.Id == quizId);

            if (quiz == null)
            {
                _logger.LogInfo($"Quiz not found for QuizId: {quizId}");
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
            
            _logger.LogInfo($"Successfully retrieved quiz for QuizId: {quizId}");
            return result;
        }
        catch (Exception ex)
        {
            _logger.LogInfo($"Error getting quiz by ID: {quizId}. Exception: {ex.Message}");
            throw;
        }
    }
    public async Task<Response<List<LessonQuizListDto>>> GetLessonQuizzes(int lessonId)
    {
        try
        {
            _logger.LogInfo($"Getting lesson quizzes for LessonId: {lessonId}");
            
            // Verify lesson exists
            var lesson = await _unitOfWork.Repository<Lesson>()
                                                .GetTableAsTracking()
                                                .FirstOrDefaultAsync(l => l.Id == lessonId);
            if (lesson == null)
            {
                _logger.LogInfo($"Lesson not found for LessonId: {lessonId}");
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

            _logger.LogInfo($"Successfully retrieved {quizzes.Count} quizzes for LessonId: {lessonId}");
            return Success(quizzes);
        }
        catch (Exception ex)
        {
            _logger.LogInfo($"Error getting lesson quizzes for LessonId: {lessonId}. Exception: {ex.Message}");
            throw;
        }
    }
    public async Task<Response<string>> CreateQuizWithCourse(CreateQuizQuestionBankDto dto)
    {
        try
        {
            _logger.LogInfo($"Creating quiz with course for CourseId: {dto.CourseId}");
            
            // Verify course exists
            var course = await _unitOfWork.Repository<Course>()
                .GetTableNoTracking()
                .FirstOrDefaultAsync(c => c.Id == dto.CourseId);

            if (course == null)
            {
                _logger.LogInfo($"Course not found for CourseId: {dto.CourseId}");
                return BadRequest<string>("Course not found");
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
                _logger.LogInfo($"Failed to create question bank for CourseId: {dto.CourseId}");
                return BadRequest<string>("Failed to create question bank");
            }

            _logger.LogInfo($"Successfully created question bank with {questions.Count} questions for CourseId: {dto.CourseId}");
            return Success("Question bank created successfully");
        }
        catch (Exception ex)
        {
            _logger.LogInfo($"Error creating quiz with course for CourseId: {dto.CourseId}. Exception: {ex.Message}");
            throw;
        }
    }
    public async Task<Response<string>> CreateQuizWithLesson(CreateQuizeWithQuestionDto dto)
    {
        try
        {
            _logger.LogInfo($"Creating quiz with lesson for LessonId: {dto.LessonId}");
            
            // Map DTO to Quiz entity using the existing helper method
            var quiz = MapToEntity(dto);

            // Save quiz to database
            await _unitOfWork.Repository<Quiz>().AddAsync(quiz);
            var result = _unitOfWork.Complete();

            if (result <= 0)
            {
                _logger.LogInfo($"Failed to create quiz for LessonId: {dto.LessonId}");
                return BadRequest<string>("Failed to create quiz");
            }

            try
            {
                // send emails to student
                await SendEmailsToStudnet(quiz, dto.LessonId);
                _logger.LogInfo($"Successfully sent email notifications for quiz creation in LessonId: {dto.LessonId}");
            }
            catch (Exception ex)
            {
                // Log email sending error but don't fail the quiz creation
                _logger.LogInfo($"Failed to send email notifications for quiz creation in LessonId: {dto.LessonId}. Exception: {ex.Message}");
            }

            _logger.LogInfo($"Successfully created quiz with {quiz.questions?.Count ?? 0} questions for LessonId: {dto.LessonId}");
            return Success("Quiz created successfully");
        }
        catch (Exception ex)
        {
            _logger.LogInfo($"Error creating quiz with lesson for LessonId: {dto.LessonId}. Exception: {ex.Message}");
            throw;
        }
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
        var quiz = new Quiz();


        CultureInfo cultureInfo = Thread.CurrentThread.CurrentCulture;

        if (cultureInfo.TwoLetterISOLanguageName.ToLower().Equals("ar"))
        {
            quiz.LessonId = dto.LessonId;
            quiz.TitleAr = dto.Title;
            quiz.DescriptionAr = dto.Description;
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
        try
        {
            _logger.LogInfo($"Getting student emails for LessonId: {lessonId}");
            
            var studentEmails = await _unitOfWork.Repository<Lesson>()
                                                         .GetTableNoTracking()
                                                         .Include(l => l.Course)
                                                         .ThenInclude(c => c.StudentCourses)!
                                                         .ThenInclude(sc => sc.Student)
                                                         .Where(l => l.Id == lessonId)
                                                         .SelectMany(l => l.Course!.StudentCourses!.Select(sc => sc.Student!.Email))
                                                         .ToListAsync();
            
            _logger.LogInfo($"Found {studentEmails.Count} student emails for LessonId: {lessonId}");
            return studentEmails;
        }
        catch (Exception ex)
        {
            _logger.LogInfo($"Error getting student emails for LessonId: {lessonId}. Exception: {ex.Message}");
            throw;
        }
    }
    private async Task<bool> SendEmailsToStudnet(Quiz quiz, int lessonId)
    {
        try
        {
            _logger.LogInfo($"Sending email notifications for quiz {quiz.Id} in LessonId: {lessonId}");
            
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
            if (studentEmails == null)
            {
                _logger.LogInfo($"No student emails found for LessonId: {lessonId}");
                return false;
            }

            foreach (var email in studentEmails)
            {
                await _emailSender.SendEmailAsync(email, emailSubject, emailMessage);
            }

            _logger.LogInfo($"Successfully sent email notifications to {studentEmails.Count} students for quiz {quiz.Id} in LessonId: {lessonId}");
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogInfo($"Error sending email notifications for quiz {quiz.Id} in LessonId: {lessonId}. Exception: {ex.Message}");
            throw;
        }
    }


    public async Task<Response<LessonQuizesStatsDto>> GetLessonQuizStats(int lessonId)
    {
        try
        {
            _logger.LogInfo($"Getting lesson quiz stats for LessonId: {lessonId}");
            
            var lesson = await _unitOfWork.Repository<Lesson>()
                .GetTableNoTracking()
                .Include(l => l.Quizs)
                .ThenInclude(q => q.StudentQuizeAnswers)
                .ThenInclude(sqa => sqa.Student)
                .FirstOrDefaultAsync(l => l.Id == lessonId);
            if (lesson == null)
            {
                _logger.LogInfo($"Lesson not found for LessonId: {lessonId}");
                return NotFound<LessonQuizesStatsDto>("Lesson not found");
            }

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
                    StudentName = a.Student?.NameEn,
                    StudentDegree = (double)(a.GradingRating ?? 0),
                    NumberOfSubmittedQuestions = a.StudentQuestionAnswer?.Count ?? 0
                }).ToList();

                quizAnalyticsList.Add(new QuizAnalyticsDto
                {
                    QuizName = quiz.TitleEn,
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
                LessonName = lesson.TitleEn,
                NumberOfQuizzes = totalQuizzes,
                PercentageOfAllQuizzes = 100, // For a single lesson, always 100%
                Quizzes = quizAnalyticsList
            };
            
            _logger.LogInfo($"Successfully retrieved lesson quiz stats for LessonId: {lessonId}. Found {totalQuizzes} quizzes");
            return Success(result);
        }
        catch (Exception ex)
        {
            _logger.LogInfo($"Error getting lesson quiz stats for LessonId: {lessonId}. Exception: {ex.Message}");
            throw;
        }
    }

    public async Task<Response<List<LessonQuizesStatsDto>>> GetCourseLessonQuizStats(int courseId)
    {
        try
        {
            _logger.LogInfo($"Getting course lesson quiz stats for CourseId: {courseId}");
            
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
                double percentageOfAllQuizzes = totalQuizzesInCourse > 0 ? ((double)totalQuizzes / totalQuizzesInCourse) * 100 : 0;
                var quizAnalyticsList = new List<QuizAnalyticsDto>();
                int totalStudents = await _unitOfWork.Repository<StudentCourse>()
                    .GetTableNoTracking()
                    .Where(sc => sc.CourseId == lesson.CourseId && !sc.IsDeleted)
                    .CountAsync();
                foreach (var quiz in lesson.Quizs)
                {
                    var studentAnswers = quiz.StudentQuizeAnswers ?? new List<StudentQuizeAnswer>();
                    int numSubmitted = studentAnswers.Count;
                    double percentageOfSubmit = totalStudents > 0 ? ((double)numSubmitted / totalStudents) * 100 : 0;
                    double percentageWithDegree = quiz.PossiblePoints > 0 && numSubmitted > 0
                        ? (studentAnswers.Sum(a => (double?)a.GradingRating ?? 0) / (quiz.PossiblePoints * numSubmitted)) * 100
                        : 0;
                    int numUnder50 = studentAnswers.Count(a => (double)(a.GradingRating ?? 0) < (quiz.PossiblePoints * 0.5));
                    int numOver70 = studentAnswers.Count(a => (double)(a.GradingRating ?? 0) >= (quiz.PossiblePoints * 0.7));
                    int numWith100 = studentAnswers.Count(a => (a.GradingRating ?? 0) == quiz.PossiblePoints);

                    var studentSubmissions = studentAnswers.Select(a => new StudentQuizSubmissionDto
                    {
                        StudentName = a.Student?.NameEn,
                        StudentDegree = (double)(a.GradingRating ?? 0),
                        NumberOfSubmittedQuestions = a.StudentQuestionAnswer?.Count ?? 0
                    }).ToList();

                    quizAnalyticsList.Add(new QuizAnalyticsDto
                    {
                        QuizName = quiz.TitleEn,
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
                    LessonName = lesson.TitleEn,
                    NumberOfQuizzes = totalQuizzes,
                    PercentageOfAllQuizzes = percentageOfAllQuizzes,
                    Quizzes = quizAnalyticsList
                });
            }
            
            _logger.LogInfo($"Successfully retrieved course lesson quiz stats for CourseId: {courseId}. Found {result.Count} lessons with {totalQuizzesInCourse} total quizzes");
            return Success(result);
        }
        catch (Exception ex)
        {
            _logger.LogInfo($"Error getting course lesson quiz stats for CourseId: {courseId}. Exception: {ex.Message}");
            throw;
        }
    }
    #endregion
}