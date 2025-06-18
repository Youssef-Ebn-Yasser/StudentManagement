using Backend.DTOs.AssignmentDTO;

namespace Backend.Services.Implementation;

public class StudentAssignmentService : ResponseHandler, IStudentAssignmentService
{
    #region    Fields
    public IUnitOfWork _unitOfWork { get; }
    private readonly IPhysicalFileUpload _physicalFileUpload;
    private readonly IStructuredLogger _logger;
    public IMapper _mapper { get; }
    #endregion

    #region    Constructor
    public StudentAssignmentService(IUnitOfWork unitOfWork, 
                                    IMapper Mapper, 
                                    IPhysicalFileUpload physicalFileUpload, 
                                    IStructuredLogger logger)
    {
        _unitOfWork = unitOfWork;
        _mapper = Mapper;
        _physicalFileUpload = physicalFileUpload;
        _logger = logger;
    }
    #endregion

    #region    Handle Methoods
    public async Task<Response<string>> UploadAssignment(UploadAssignmentDto assignment)
    {
        // check lesson id and student id is exist
        var student = await _unitOfWork.Repository<Student>().GetByIdAsync(assignment.StudentId);
        var lesson = await _unitOfWork.Repository<Lesson>().GetByIdAsync(assignment.LessonId);
        var isUploaded = await _unitOfWork.Repository<StudentAssignment>().GetTableNoTracking().AnyAsync(sa => sa.StudentId == assignment.StudentId && sa.LessonId == assignment.LessonId);

        if (isUploaded)
            return NotFound<string>("Student already Upload this Assignment.");

        if (student == null || lesson == null)
            return NotFound<string>("Student or Lesson not found.");


        var path = await _physicalFileUpload.UploadFileAsync("StudentAssignment", assignment.File);

        var newassignment = new StudentAssignment
        {
            LessonId = assignment.LessonId,
            StudentId = assignment.StudentId,
            Path = path,
        };
        await _unitOfWork.Repository<StudentAssignment>().AddAsync(newassignment);
        _unitOfWork.Complete();

        return Success("Assignment Added successfully.");
    }

    public async Task<Response<List<StudentAssignmentCourseDto>>> GetAllStudentAssignmentInCourse(int studentId, int courseId)
    {
        var student = await _unitOfWork.Repository<Student>().GetByIdAsync(studentId);
        var course = await _unitOfWork.Repository<Course>().GetByIdAsync(courseId);

        if (student == null || course == null)
            return NotFound<List<StudentAssignmentCourseDto>>("Student or Lesson not found.");

        var result = await _unitOfWork.Repository<StudentAssignment>()
                                                        .GetTableNoTracking()
                                                        .Include(x => x.Lesson)
                                                        .Where(sa => sa.StudentId == studentId && sa.Lesson.CourseId == courseId)
                                                        .ToListAsync();

        var mapper = _mapper.Map<List<StudentAssignmentCourseDto>>(result);
        return Success(mapper);
    }
    public async Task<Response<AssignmentStudentDto>> GetStudentAssignmentForLessonId(int lessonId)
    {
        var lesson = await _unitOfWork.Repository<Lesson>().GetByIdAsync(lessonId);
        if (lesson == null)
            return NotFound<AssignmentStudentDto>("Lesson not found.");

        var assignment = await _unitOfWork.Repository<StudentAssignment>()
                                                     .GetTableNoTracking()
                                                     .Include(x => x.Student)
                                                     .Include(x => x.Lesson)
                                                     .FirstOrDefaultAsync(sa => sa.LessonId == lessonId);

        if (assignment == null)
            return NotFound<AssignmentStudentDto>("Assignment not found.");

        var result = _mapper.Map<AssignmentStudentDto>(assignment);
        return Success(result);
    }

    public async Task<Response<List<AssignmentOfLessonDto>>> GetAllAssignmentOfCourse(String CourseName, string StudentName)
    {
        var course = await _unitOfWork.Repository<Course>()
                                      .GetTableNoTracking()
                                      .FirstOrDefaultAsync(x => GeneralLocalizableEntity.Localized(x.TitleAr, x.TitleEn) == CourseName);
        if (course == null)
            return NotFound<List<AssignmentOfLessonDto>>("Course not found.");
        var student = await _unitOfWork.Repository<Student>()
                                       .GetTableNoTracking()
                                       .Include(s => s.StudentCourses)
                                       .FirstOrDefaultAsync(x => GeneralLocalizableEntity.Localized(x.NameAr, x.NameEn) == StudentName && x.StudentCourses.Any(c => c.CourseId == course.Id));
        if (student == null)
            return NotFound<List<AssignmentOfLessonDto>>("Student not found.");
        var result = await _unitOfWork.Repository<StudentAssignment>()
                                      .GetTableNoTracking()
                                      .Include(x => x.Lesson)
                                      .Where(sa => sa.StudentId == student.Id && sa.Lesson.CourseId == course.Id)
                                      .ToListAsync();
        var mapper = _mapper.Map<List<AssignmentOfLessonDto>>(result);
        return Success(mapper);
    }
    public class StudentAssignmentCourseDto
    {
        public string Path { get; set; }
    }

    public async Task<Response<List<AssignmentIconTocorrectDto>>> GetAssignmentByLessonId(int lessonId)
    {
        var existLesson = await _unitOfWork.Repository<Lesson>().GetTableNoTracking().AnyAsync(l => l.Id == lessonId && !l.IsDeleted);

        if (!existLesson) return BadRequest<List<AssignmentIconTocorrectDto>>("no lesson with this id");

        var result = await _unitOfWork.Repository<StudentAssignment>()
                                                                .GetTableNoTracking()
                                                                .Include(x => x.Student)
                                                                .Where(x => x.LessonId == lessonId)
                                                                .Select(a => new AssignmentIconTocorrectDto
                                                                {
                                                                    Id = a.Id,
                                                                    Name = GeneralLocalizableEntity.Localized(a.Student!.NameAr, a.Student!.NameEn),
                                                                }).ToListAsync();

        if (result == null) return BadRequest<List<AssignmentIconTocorrectDto>>("no Uploaded assignment in this lesson");

        return Success(result);
    }
    public async Task<Response<StudentAssignmentDetailsDto>> GetAssignmentForStudentToCorrect(int studentAssignmentId)
    {
        var existLesson = await _unitOfWork.Repository<StudentAssignment>().GetTableNoTracking().AnyAsync(sa => sa.Id == studentAssignmentId);

        if (!existLesson) return BadRequest<StudentAssignmentDetailsDto>("no AssignmentId with this id for this Student");

        var result = await _unitOfWork.Repository<StudentAssignment>()
                                                            .GetTableNoTracking()
                                                            .Include(x => x.Student)
                                                            .Include(x => x.Lesson)
                                                            .ThenInclude(l => l.Course)
                                                            .Where(x => x.Id == studentAssignmentId)
                                                            .Select(a => new StudentAssignmentDetailsDto
                                                            {
                                                                CourseName = GeneralLocalizableEntity.Localized(a.Lesson!.Course!.TitleAr, a.Lesson!.Course!.TitleEn),
                                                                LessonName = GeneralLocalizableEntity.Localized(a.Lesson.TitleAr, a.Lesson.TitleEn),
                                                                Path = a.Path,
                                                                StudentAssignmentId = a.Id,
                                                                DegreePercentage = a.DegreePercentage,
                                                                StudentName = GeneralLocalizableEntity.Localized(a.Student!.NameAr, a.Student!.NameEn),
                                                            }).FirstOrDefaultAsync();

        if (result == null) return BadRequest<StudentAssignmentDetailsDto>("no Uploaded assignment this student not provide any");

        return Success(result);
    }
    public async Task<Response<string>> SaveStudentDegreeInAssignment(StudentAssignmentDegreeDto dto)
    {
        if (dto.DegreePercentage > 100 || dto.DegreePercentage < 0)
            return BadRequest<string>("the degree must be in range 0 to 100");

        var existLesson = await _unitOfWork.Repository<StudentAssignment>()
                                                          .GetTableAsTracking()
                                                          .FirstOrDefaultAsync(sa => sa.Id == dto.Id);

        if (existLesson == null) return BadRequest<string>("this Assignment not exist");

        existLesson.DegreePercentage = dto.DegreePercentage;

        var result = _unitOfWork.Complete();

        return result > 0 ? Success("Updated degree success") : BadRequest<string>("error happen when try to save try letter");
    }
    #endregion
}