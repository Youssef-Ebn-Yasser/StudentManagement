namespace Backend.Services.Implementation;

public class StudentService : ResponseHandler, IStudentService
{
    #region   Fields
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly IPhysicalFileUpload _physicalFileUpload;
    private readonly IStructuredLogger _logger;
    CultureInfo cultureInfo = Thread.CurrentThread.CurrentCulture;
    #endregion

    #region Constructor
    public StudentService(IUnitOfWork unitOfWork,
                          IMapper mapper,
                          IPhysicalFileUpload physicalFileUpload,
                          IStructuredLogger logger)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _physicalFileUpload = physicalFileUpload;
        _logger = logger;
    }
    #endregion

    #region Handle Methods
    public async Task<Response<List<ShowStudentDto>>> GetAllAsync()
    {
        var students = await _unitOfWork.Repository<Student>()
                                                    .GetTableNoTracking()
                                                    .Where(s => s.IsDeleted == false)
                                                    .ToListAsync();

        if (students == null)
        {
            _logger.LogInfo("No Students in GetAllAsync");
            BadRequest<List<ShowAllCoursesDto>>("Students is null");
        }

        var mappedStudents = _mapper.Map<List<ShowStudentDto>>(students);
        return Success(mappedStudents);
    }

    public async Task<Response<List<ShowStudentWithCoursesDto>>> GetAllInCourseByCourseNameAsync(string courseName)
    {

        List<Student> students = new List<Student>();

        if (cultureInfo.TwoLetterISOLanguageName.ToLower().Equals("ar"))
        {
            students = await _unitOfWork.Repository<Student>()
                                                       .GetTableNoTracking()
                                                       .Where(s => s.StudentCourses.Any(sc => sc.Course.TitleAr.ToLower().Contains(courseName.ToLower())) && s.IsDeleted == false)
                                                       .Include(s => s.StudentCourses)
                                                       .ThenInclude(sc => sc.Course)
                                                       .ToListAsync();
        }
        else
        {
            students = await _unitOfWork.Repository<Student>()
                                                       .GetTableNoTracking()
                                                       .Where(s => s.StudentCourses.Any(sc => sc.Course.TitleEn.ToLower().Contains(courseName.ToLower())) && s.IsDeleted == false)
                                                       .Include(s => s.StudentCourses)
                                                       .ThenInclude(sc => sc.Course)
                                                       .ToListAsync();
        }


        if (students == null)
        {
            _logger.LogInfo("No Students in GetAllAsync");
            BadRequest<List<ShowAllCoursesDto>>("Students is null");
        }


        var mappedStudents = _mapper.Map<List<ShowStudentWithCoursesDto>>(students);
        return Success(mappedStudents);
    }

    public async Task<Response<ShowStudentDto>> GetByIdAsync(int id)
    {
        var student = await _unitOfWork.Repository<Student>().GetTableNoTracking().FirstOrDefaultAsync(s => s.Id == id && s.IsDeleted == false);
        if (student == null)
        {
            _logger.LogInfo($"No Students with this id {id}");
            return NotFound<ShowStudentDto>("Student Not Found");
        }

        var mappedStudent = _mapper.Map<ShowStudentDto>(student);
        return Success(mappedStudent);
    }

    public async Task<Response<ShowStudentDto>> GetByNameAsync(string name)
    {
        Student student = new Student();

        if (cultureInfo.TwoLetterISOLanguageName.ToLower().Equals("ar"))
        {
            student = await _unitOfWork.Repository<Student>()
                                       .GetTableNoTracking()
                                       .FirstOrDefaultAsync(s => s.NameAr == name && s.IsDeleted == false);
        }
        else
        {
            student = await _unitOfWork.Repository<Student>()
                                       .GetTableNoTracking()
                                       .FirstOrDefaultAsync(s => s.NameEn == name && s.IsDeleted == false);
        }

        if (student == null)
        {
            _logger.LogInfo("Student Not Found trying with student name");
            return NotFound<ShowStudentDto>("Student Not Found");
        }

        var mappedStudent = _mapper.Map<ShowStudentDto>(student);
        return Success(mappedStudent);
    }

    public async Task<Response<PaginateResult<ShowStudentDto>>> GetPaginatedListOfStudentAsync(int pageNumber, int pageSize)
    {
        var students = _unitOfWork.Repository<Student>()
                                                 .GetTableNoTracking()
                                                    .Where(s => !s.IsDeleted);

        if (students == null)
        {
            _logger.LogInfo("Student Not Found trying with GetPaginatedListOfStudentAsync");
            return NotFound<PaginateResult<ShowStudentDto>>("Students Not Found");
        }

        var mapper = await _mapper.ProjectTo<ShowStudentDto>(students)
                                                          .ToPaginatedListAsync(pageNumber, pageSize);
        return Success(mapper);
    }
    public async Task<Response<List<ShowStudentCourseDto>>> GetAllEnrolledStudentCourses(int studentId)
    {
        var studentCourses = await
        _unitOfWork.Repository<StudentCourse>()
                   .GetTableAsTracking()
                   .Where(s => s.IsDeleted == false)
                   .Include(sc => sc.Course)
                   .Include(sc => sc.Student)
                   .Where(sc => sc.StudentId == studentId)
                   .Select(_ => new ShowStudentCourseDto
                   {
                       Id = _.Course.Id,
                       Title = GeneralLocalizableEntity.Localized(_.Course.TitleAr, _.Course.TitleEn),
                       Description = GeneralLocalizableEntity.Localized(_.Course.DescriptionAr, _.Course.DescriptionEn),
                       Level = GeneralLocalizableEntity.Localized(_.Course.LevelAr, _.Course.LevelEn),
                       CategoryName = GeneralLocalizableEntity.Localized(_.Course.Category.CategoryNameAr, _.Course.Category.CategoryNameEn),
                       ImagePath = _.Course.ImagePath,
                       Hours = _.Course.Hours,
                       TeacherName = GeneralLocalizableEntity.Localized(_.Course.Teacher.NameAr, _.Course.Teacher.NameEn)

                   })
        .ToListAsync();

        if (studentCourses == null)
        {
            _logger.LogInfo("Student Not with id {id} not enroll in any courses");
            return NotFound<List<ShowStudentCourseDto>>("no enroll courses");
        }

        return Success(studentCourses);
    }
    public async Task<Response<string>> EnrollToCourse(StudentEnrollDto studentEnrollDto)
    {
        // check this student is exist 
        if (!await _isExistById(studentEnrollDto.StudentId))
            return BadRequest<string>($"this Student with this id : {studentEnrollDto.StudentId} not exist");
        // this course is exist
        if (!await _isCourseExistById(studentEnrollDto.CourseId))
            return BadRequest<string>($"this Course with this id : {studentEnrollDto.CourseId} not exist");

        // check if in payment table  
        //var isPaid = await IsEnrolledInCourse(studentEnrollDto);
        // if (!isPaid.Succeeded) return BadRequest<string>("Student Should Pay First");

        var isEnroll = await IsEnrolledInCourse(studentEnrollDto);

        if (isEnroll.Data)
        {
            _logger.LogInfo($"Student with id : {studentEnrollDto.StudentId} is enroll in course with id :{studentEnrollDto.CourseId}");
            return BadRequest<string>($"this student Already in this course");
        }

        var mapper = _mapper.Map<StudentCourse>(studentEnrollDto);

        await _unitOfWork.Repository<StudentCourse>().AddAsync(mapper);
        var result = _unitOfWork.Complete();

        if (result > 0)
        {
            _logger.LogInfo($"eroll success for Student with id : {studentEnrollDto.StudentId} and course with id :{studentEnrollDto.CourseId}");
            return Success("Enroll Success");
        }
        else
        {
            _logger.LogInfo($"Error Student with id : {studentEnrollDto.StudentId} can not  enroll in course with id :{studentEnrollDto.CourseId}");
            return BadRequest<string>("Can not enroll to course");
        }
    }
    public async Task<Response<bool>> IsEnrolledInCourse(StudentEnrollDto studentEnrollDto)
    {
        var isEnrolled = await _unitOfWork.Repository<StudentCourse>()
                                              .GetTableNoTracking()
                                              .AnyAsync(p => p.StudentId == studentEnrollDto.StudentId &&
                                                                      p.CourseId == studentEnrollDto.CourseId &&
                                                                      p.IsDeleted == false);

        return isEnrolled ? Success(true) : BadRequest<bool>("not in course");
    }
    public async Task<Response<string>> CreateAsync(CreateStudentDto createStudent)
    {
        var isNameExist = await _isNameExist(createStudent.Name);
        if (isNameExist) return BadRequest<string>("Student Name is already exist");

        var isEmailExist = await _isEmailExist(createStudent.Email);
        if (isNameExist) return BadRequest<string>("Student Email is already exist");

        var newStudent = _mapper.Map<Student>(createStudent);



        await _unitOfWork.Repository<Student>().AddAsync(newStudent);
        var result = _unitOfWork.Complete();

        return result > 0 ? Success("Student Added Successfully") :
                            BadRequest<string>("can not add this student error happen when try add");
    }
    public async Task<Response<string>> UpdateAsync(UpdateStudentDto updateStudentDto)
    {
        // check this student is exist 
        var student = await _studentExistById(updateStudentDto.Id);
        if (student == null)
            return BadRequest<string>($"this Student with this id : {updateStudentDto.Id} not exist");

        _mapper.Map(updateStudentDto, student);

        if (updateStudentDto.Image != null)
        {
            _logger.LogInfo("Satrt Upload physical file");
            var path = await _physicalFileUpload.UploadFileAsync("Students", updateStudentDto.Image);

            if (string.IsNullOrEmpty(path))
                _logger.LogInfo("Upload file faild");

            _logger.LogInfo("Upload physical file Success");
            student.ImageUrl = path;
        }
        _unitOfWork.Repository<Student>().Update(student);
        var result = _unitOfWork.Complete();

        if (result > 0)
        {
            _logger.LogInfo($"Student Updated Successfully");
            return Success("Student Updated Successfully");
        }
        else
        {
            _logger.LogInfo($"Error can not Updated this student error happen when trying");
            return BadRequest<string>("can not Updated this student error happen when trying");
        }
    }
    public async Task<Response<string>> DeleteAsync(int id)
    {
        var isNameExist = await _isExistById(id);
        if (!isNameExist)
        {
            _logger.LogInfo($"try to delete student with id : {id} but not found");
            return NotFound<string>($"Student with this id = {id} not exist");
        }

        var student = await _unitOfWork.Repository<Student>()
                                              .GetTableAsTracking()
                                              .FirstOrDefaultAsync(s => s.Id == id);

        student!.IsDeleted = true;

        var result = _unitOfWork.Complete();

        if (result > 0)
        {
            _logger.LogInfo($"Student Deleted Successfully with id : {id}");
            return Success("Student Deleted Successfully");
        }
        else
        {
            _logger.LogInfo($"Error Student with id : {id} can not deleted");
            return BadRequest<string>("can not delete this student error happen when try deleting");
        }
    }
    public async Task<Response<String>> DeleteStudentFromCourseAsync(DeleteStudentFromCourseDto deleteStudent)
    {
        var StudentExist = await _studentExistByName(deleteStudent.StudentName);
        if (StudentExist == null)
        {
            _logger.LogInfo($"try to delete student with name : {deleteStudent.StudentName} from course {deleteStudent.CourseName} but not found student");
            return NotFound<string>($"Student with this name = {deleteStudent.StudentName} not exist");
        }

        var CourseExist = await _courseExistByName(deleteStudent.CourseName);
        if (CourseExist == null)
        {
            _logger.LogInfo($"try to delete course with name : {deleteStudent.CourseName} for  student with name : {deleteStudent.StudentName} but not found course");
            return NotFound<string>($"Course with this name = {deleteStudent.CourseName} not exist");
        }



        var studentCourse = await _unitOfWork.Repository<StudentCourse>()
                                                        .GetTableAsTracking()
                                                        .Where(sc => sc.StudentId == StudentExist.Id && sc.CourseId == CourseExist.Id)
                                                        .FirstOrDefaultAsync();

        if (studentCourse == null) return NotFound<string>($"Student with this name = {deleteStudent.StudentName} not enroll in this course");

        studentCourse.IsDeleted = true;

        var result = _unitOfWork.Complete();

        if (result > 0)
        {
            _logger.LogInfo($"Student delete from course with name : {deleteStudent.CourseName} for  student with name : {deleteStudent.StudentName}");
            return Success("Student Deleted From Course Successfully");
        }
        else
        {
            _logger.LogInfo($"Error can not Student delete from course with name : {deleteStudent.CourseName} for  student with name : {deleteStudent.StudentName}");
            return BadRequest<string>("can not delete this student from course error happen when try deleting");
        }
    }

    private async Task<bool> _isNameExist(string name)
    {
        bool exist = false;

        if (cultureInfo.TwoLetterISOLanguageName.ToLower().Equals("ar"))
        {
            exist = await _unitOfWork.Repository<Student>()
                                           .GetTableNoTracking()
                                           .AnyAsync(s => s.NameAr == name && s.IsDeleted == false);
        }
        else
        {
            exist = await _unitOfWork.Repository<Student>()
                                           .GetTableNoTracking()
                                           .AnyAsync(s => s.NameEn == name && s.IsDeleted == false);
        }

        return exist;
    }
    private async Task<bool> _isExistById(int id)
    {
        var exist = await _unitOfWork.Repository<Student>()
                                           .GetTableNoTracking()
                                           .AnyAsync(s => s.Id == id && s.IsDeleted == false);

        return exist;
    }
    private async Task<bool> _isEmailExist(string email)
    {
        var exist = await _unitOfWork.Repository<Student>()
                                           .GetTableNoTracking()
                                           .AnyAsync(s => s.Email == email && s.IsDeleted == false);

        return exist;
    }
    private async Task<bool> _isCourseExistById(int id) =>
    await _unitOfWork.Repository<Course>().GetTableNoTracking().AnyAsync(s => s.Id == id);
    private async Task<Course> _courseExistByName(string Name)
    {
        Course course = new Course();

        if (cultureInfo.TwoLetterISOLanguageName.ToLower().Equals("ar"))
        {
            course = await _unitOfWork.Repository<Course>()
                        .GetTableNoTracking()
                        .FirstOrDefaultAsync(s => s.TitleAr == Name);
        }
        else
        {
            course = await _unitOfWork.Repository<Course>()
                                      .GetTableNoTracking()
                                      .FirstOrDefaultAsync(s => s.TitleEn == Name);
        }

        return course;
    }
    private async Task<Student> _studentExistByName(string name)
    {
        Student student = new Student();

        if (cultureInfo.TwoLetterISOLanguageName.ToLower().Equals("ar"))
        {
            student = await _unitOfWork.Repository<Student>()
                        .GetTableNoTracking()
                        .FirstOrDefaultAsync(s => s.NameAr == name);

        }
        else
        {
            student = await _unitOfWork.Repository<Student>()
                                      .GetTableNoTracking()
                                      .FirstOrDefaultAsync(s => s.NameEn == name);
        }


        return student;
    }
    private async Task<Student> _studentExistById(int id) =>
await _unitOfWork.Repository<Student>().GetTableNoTracking().FirstOrDefaultAsync(s => s.Id == id);

    public async Task<Response<StudentProfDTO>> GetStudentProfileAsync(int studentId)
    {
        var student = await _studentExistById(studentId);
        if (student == null)
            return NotFound<StudentProfDTO>($"Student with ID {studentId} not found");

        // Get student basic info
        var studentInfo = _mapper.Map<ShowStudentDto>(student);

        //var listOfAssignment = _unitOfWork.Repository<Lesson>()
        //    .GetTableNoTracking()
        //    .Include(sa => sa.StudentAssignments)
        //    .Include(l => l.Quizs)
        //.Select(l => new
        // {
        //     AssignmentDetails = l.StudentAssignments.Where(sa => sa.LessonId == l.Id)
        //                           .Select(sa => new
        //                           {
        //                               StudentDegreePercentage = sa.DegreePercentage,
        //                               StudentAssignmentId = sa.Id,
        //                               AssignmentName = l.materials.Where(m => m.LessonId == l.Id)
        //                                                           .Select(m => m.Title)
        //                                                           .FirstOrDefault(),
        //                           }).FirstOrDefault(),

        //     numberOfQuizesInLesson = l.Quizs.Where(q => q.LessonId == l.Id).Count(),
        //     TotalQuizesDegreeInLessons = l.Quizs.Where(q => q.LessonId == l.Id).Sum(q => q.PossiblePoints),
        //     StudentDegreeOfQuizesInLessons = l.Quizs.SelectMany(q => q.StudentQuizeAnswers).Sum(qa => qa.GradingRating),
        //     quizLestDetails = l.Quizs.SelectMany(q => q.StudentQuizeAnswers).Select(qa => new
        //     {
        //         studentQuizAnswerId = qa.Id,
        //         quizPercentageDegree = qa.GradingRating,
        //         IsPass = qa.IsPassed,
        //         PossiblePoints = qa.Quiz.PossiblePoints,
        //         NumberOfAswered = qa.NumberOfAswered,
        //         quizName = qa.Quiz.Title,

        //     })
        // });








        // Get assignments
        var assignments = await _unitOfWork.Repository<StudentAssignment>()
            .GetTableNoTracking()
            .Include(sa => sa.Lesson)
            .ThenInclude(l => l.Course)
            .Where(sa => sa.StudentId == studentId)
            .Select(sa => new DTOs.StudentProfileDto.StudentAssignmentDto
            {
                Id = sa.Id,
                CourseName = sa.Lesson.Course.TitleEn,
                LessonName = sa.Lesson.TitleEn,
                Path = sa.Path,
                DegreePercentage = sa.DegreePercentage

            })
            .ToListAsync();



        var quizzes = await _unitOfWork.Repository<StudentQuizeAnswer>()
         .GetTableNoTracking()
         .Include(sqa => sqa.Quiz)
        .Where(sqa => sqa.StudentId == studentId)
        .Select(sqa => new StudentQuizDto
        {
            QuizId = sqa.Id,
            QuizTitle = sqa.Quiz.TitleEn,
            GradingRating = sqa.GradingRating,
            IsPassed = sqa.IsPassed,

        })
      .ToListAsync();
        var attendance = await GetStudentAttendance(studentId);

        // Create the profile DTO
        var profile = new StudentProfDTO
        {
            StudentInfo = studentInfo,
            Assignments = assignments,
            Quizzes = quizzes,
            Attendance = attendance
        };

        return Success(profile);
    }
    private async Task<List<Backend.DTOs.StudentProfileDto.StudentAttendanceDto>> GetStudentAttendance(int studentId)
    {
        // Implement this based on how you track meeting attendance
        // This is just a placeholder implementation
        return await _unitOfWork.Repository<MeetingAttendance>() // You'll need this entity
            .GetTableNoTracking()
            .Include(ma => ma.Meeting)
            .Where(ma => ma.StudentId == studentId)
            .Select(ma => new Backend.DTOs.StudentProfileDto.StudentAttendanceDto
            {
                Id = ma.Id,
                MeetingTopic = ma.Meeting.TopicEn,
                MeetingDate = ma.Meeting.StartTime ?? ma.Meeting.CreatedAt,
                Attended = ma.Attended
            })
            .ToListAsync();
    }
}
#endregion