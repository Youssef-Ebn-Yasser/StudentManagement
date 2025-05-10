using Backend.DTOs.AssignmentDTO;
using Backend.Entities;

namespace Backend.Services.Implementation;

public class StudentAssignmentService : ResponseHandler, IStudentAssignmentService
{
    #region    Fields
    public IUnitOfWork _unitOfWork { get; }
    public IFileService _fileService { get; }
    public IMapper _mapper { get; }
    #endregion

    #region    Constructor
    public StudentAssignmentService(IUnitOfWork unitOfWork, IFileService fileService, IMapper Mapper)
    {
        _unitOfWork = unitOfWork;
        _fileService = fileService;
        _mapper = Mapper;
    }
    #endregion

    #region    Handle Methoods
    public async Task<Response<string>> UploadAssignment(UploadAssignmentDto assignment)
    {
        // check lesson id and student id is exist
        var student = await _unitOfWork.Repository<Student>().GetByIdAsync(assignment.StudentId);
        var lesson = await _unitOfWork.Repository<Lesson>().GetByIdAsync(assignment.LessonId);

        if (student == null || lesson == null)
            return NotFound<string>("Student or Lesson not found.");


        var path = await _fileService.UploadFileAsync(assignment.File);

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
                                      .FirstOrDefaultAsync(x => x.Title == CourseName);
        if (course == null)
            return NotFound<List<AssignmentOfLessonDto>>("Course not found.");
        var student = await _unitOfWork.Repository<Student>()
                                       .GetTableNoTracking()
                                       .Include(s => s.StudentCourses)
                                       .FirstOrDefaultAsync(x => x.Name == StudentName && x.StudentCourses.Any(c=> c.CourseId == course.Id));
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
    #endregion
}