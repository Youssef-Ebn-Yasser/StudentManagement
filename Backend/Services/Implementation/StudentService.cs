using Backend.DTOs.StudentDOs;
using Backend.Wrapper;

namespace Backend.Services.Implementation;

public class StudentService : ResponseHandler, IStudentService
{
    #region   Fields
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    #endregion

    #region Constructor
    public StudentService(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
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
                                                    .Where(s => s.StudentCourses.Any(sc => sc.Course.Title.ToLower().Contains(courseName.ToLower())))
                                                    .Include(s => s.StudentCourses)
                                                    .ThenInclude(sc => sc.Course)
                                                    .ToListAsync();

        var mappedStudents = _mapper.Map<List<ShowStudentWithCoursesDto>>(students);
        return Success(mappedStudents);
    }

    public async Task<Response<ShowStudentDto>> GetByIdAsync(int id)
    {
        var student = await _unitOfWork.Repository<Student>().GetTableNoTracking().FirstOrDefaultAsync(s => s.Id == id);
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
                                                 .GetTableNoTracking();


        var mapper = await _mapper.ProjectTo<ShowStudentDto>(student)
                                                          .ToPaginatedListAsync(pageNumber, pageSize);
        return Success(mapper);
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
    public Task<Response<string>> UpdateAsync(UpdateStudentDto updateStudentDto)
    {
        throw new NotImplementedException();
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
    #endregion
}