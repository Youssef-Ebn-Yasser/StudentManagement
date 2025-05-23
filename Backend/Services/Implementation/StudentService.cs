using Backend.DTOs.StudentDOs;
using Backend.Wrapper;

namespace Backend.Services.Implementation;

public class StudentService : ResponseHandler, IStudentService
{
    #region   Fields
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly IFileService _fileService;
    #endregion

    #region Constructor
    public StudentService(IUnitOfWork unitOfWork, IMapper mapper, IFileService fileService)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _fileService = fileService;
    }
    #endregion

    #region Handle Methods
    public async Task<Response<List<ShowStudentDto>>> GetAllAsync()
    {
        var students = await _unitOfWork.Repository<Student>()
                                                    .GetTableNoTracking()
                                                    .Where(s => s.IsDeleted == false)
                                                    .ToListAsync();

        var mappedStudents = _mapper.Map<List<ShowStudentDto>>(students);
        return Success(mappedStudents);
    }

    public async Task<Response<List<ShowStudentWithCoursesDto>>> GetAllInCourseByCourseNameAsync(string courseName)
    {
        var students = await _unitOfWork.Repository<Student>()
                                                    .GetTableNoTracking()
                                                    .Where(s => s.StudentCourses.Any(sc => sc.Course.Title.ToLower().Contains(courseName.ToLower())) && s.IsDeleted == false)
                                                    .Include(s => s.StudentCourses)
                                                    .ThenInclude(sc => sc.Course)
                                                    .ToListAsync();

        var mappedStudents = _mapper.Map<List<ShowStudentWithCoursesDto>>(students);
        return Success(mappedStudents);
    }

    public async Task<Response<ShowStudentDto>> GetByIdAsync(int id)
    {
        var student = await _unitOfWork.Repository<Student>().GetTableNoTracking().FirstOrDefaultAsync(s => s.Id == id && s.IsDeleted == false);
        if (student == null)
            return NotFound<ShowStudentDto>("Student Not Found");

        var mappedStudent = _mapper.Map<ShowStudentDto>(student);
        return Success(mappedStudent);
    }

    public async Task<Response<ShowStudentDto>> GetByNameAsync(string name)
    {
        var student = await _unitOfWork.Repository<Student>()
                                              .GetTableNoTracking()
                                              .FirstOrDefaultAsync(s => s.Name == name && s.IsDeleted == false);
        if (student == null)
            return NotFound<ShowStudentDto>("Student Not Found");

        var mappedStudent = _mapper.Map<ShowStudentDto>(student);
        return Success(mappedStudent);
    }

    public async Task<Response<PaginateResult<ShowStudentDto>>> GetPaginatedListOfStudentAsync(int pageNumber, int pageSize)
    {
        var student = _unitOfWork.Repository<Student>()
                                                 .GetTableNoTracking()
                                                    .Where(s => !s.IsDeleted)
                                                 ;


        var mapper = await _mapper.ProjectTo<ShowStudentDto>(student)
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
                       Title = _.Course.Title,
                       Description = _.Course.Description,
                       Level = _.Course.Level,
                       CategoryName = _.Course.Category.CategoryName,
                       ImagePath = _.Course.ImagePath,
                   })
                   .ToListAsync();

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
            return BadRequest<string>($"this student Already in this course");

        var mapper = _mapper.Map<StudentCourse>(studentEnrollDto);

        await _unitOfWork.Repository<StudentCourse>().AddAsync(mapper);
        var result = _unitOfWork.Complete();

        return result > 0 ? Success("Enroll Success") :
                            BadRequest<string>("Can not enroll to course");
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

    public async Task<Response<string>> DeleteAsync(int id)
    {
        var isNameExist = await _isExistById(id);
        if (!isNameExist) return NotFound<string>($"Student with this id = {id} not exist");

        var student = await _unitOfWork.Repository<Student>()
                                              .GetTableAsTracking()
                                              .FirstOrDefaultAsync(s => s.Id == id);

        student!.IsDeleted = true;
        _unitOfWork.Repository<Student>().Update(student);
        var result = _unitOfWork.Complete();

        return result > 0 ? Success("Student Deleted Successfully") :
                            BadRequest<string>("can not delete this student error happen when try deleting");
    }

    public async Task<Response<String>> DeleteStudentFromCourseAsync(DeleteStudentFromCourseDto deleteStudent)
    {
        var StudentExist = await _studentExistByName(deleteStudent.StudentName);
        if (StudentExist == null) return NotFound<string>($"Student with this name = {deleteStudent.StudentName} not exist");

        var CourseExist = await _courseExistByName(deleteStudent.CourseName);
        if (CourseExist == null) return NotFound<string>($"Course with this name = {deleteStudent.CourseName} not exist");



        var studentCourse = await _unitOfWork.Repository<StudentCourse>()
                                                        .GetTableAsTracking()
                                                        .Where(sc => sc.StudentId == StudentExist.Id && sc.CourseId == CourseExist.Id)
                                                        .FirstOrDefaultAsync();

        if (studentCourse == null) return NotFound<string>($"Student with this name = {deleteStudent.StudentName} not enroll in this course");


        studentCourse.IsDeleted = true;

        _unitOfWork.Repository<StudentCourse>().Update(studentCourse);
        var result = _unitOfWork.Complete();

        return result > 0 ? Success("Student Deleted From Course Successfully") :
                            BadRequest<string>("can not delete this student from course error happen when try deleting");
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
            if (student.ImageUrl != null)
                await _fileService.DeleteImageByUrlAsync(student.ImageUrl);

            var path = await _fileService.UploadFileAsync(updateStudentDto.Image);
            student.ImageUrl = path;
        }
        _unitOfWork.Repository<Student>().Update(student);
        var result = _unitOfWork.Complete();

        return result > 0 ? Success("Student Updated Successfully") :
                            BadRequest<string>("can not Updated this student error happen when trying");
    }

    private async Task<bool> _isNameExist(string name)
    {
        var exist = await _unitOfWork.Repository<Student>()
                                           .GetTableNoTracking()
                                           .AnyAsync(s => s.Name == name && s.IsDeleted == false);

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
    private async Task<Course> _courseExistByName(string Name) =>
   await _unitOfWork.Repository<Course>().GetTableNoTracking().FirstOrDefaultAsync(c => c.Title == Name);
    private async Task<Student> _studentExistByName(string name) =>
    await _unitOfWork.Repository<Student>().GetTableNoTracking().FirstOrDefaultAsync(s => s.Name == name);
    private async Task<Student> _studentExistById(int id) =>
await _unitOfWork.Repository<Student>().GetTableNoTracking().FirstOrDefaultAsync(s => s.Id == id);
    #endregion
}