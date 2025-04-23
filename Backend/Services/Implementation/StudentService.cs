using Backend.DTOs.StudentDOs;

namespace Backend.Services.Implementation
{
    public class StudentService : ResponseHandler, IStudentService
    {

        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public StudentService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }
        public async Task<Response<List<ShowStudentDto>>> GetAllAsync()
        {
            var students = await _unitOfWork.Repository<Student>().GetTableNoTracking().ToListAsync();
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
            var student = await _unitOfWork.Repository<Student>().GetTableNoTracking().FirstOrDefaultAsync(s => s.Name.ToLower() == name.ToLower());
            if (student == null)
                return NotFound<ShowStudentDto>("Student Not Found");

            var mappedStudent = _mapper.Map<ShowStudentDto>(student);
            return Success(mappedStudent);
        }
    }
}
