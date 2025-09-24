namespace Backend.Services.Interfaces;

public interface IStudentService
{
    public Task<Response<ShowStudentDto>> GetByIdAsync(int id);
    //public Task<Response<ShowStudentDto>> GetByNameAsync(string name);
    public Task<Response<List<ShowStudentDto>>> GetAllAsync();
    public Task<Response<ForAddStudentToCourseDependenciesDto>> GetAddStudentCourseDependenciesDto();
    //public Task<Response<List<ShowStudentWithCoursesDto>>> GetAllInCourseByCourseNameAsync(string courseName);
    public Task<Response<PaginateResult<ShowStudentDto>>> GetPaginatedListOfStudentAsync(int pageNumber, int pageSize);
    public Task<Response<List<ShowStudentCourseDto>>> GetAllEnrolledStudentCourses(int studentId);

    public Task<Response<string>> EnrollToCourse(StudentEnrollDto studentEnrollDto);
    public Task<Response<bool>> IsEnrolledInCourse(StudentEnrollDto studentEnrollDto);

    public Task<Response<string>> SaveFromExcel(IFormFile file);
    public Task<Response<string>> UpdateAsync(UpdateStudentDto updateStudentDto);
    public Task<Response<string>> DeleteAsync(int id);
    public Task<Response<string>> DeleteStudentFromCourseAsync(DeleteStudentFromCourseDto deleteStudent);
    public Task<Response<StudentProfDTO>> GetStudentProfileAsync(int studentId);


    // enroll to course
    // first should check in payment table
}

