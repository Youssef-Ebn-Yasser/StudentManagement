using Backend.DTOs.StudentDOs;
using Backend.Wrapper;

namespace Backend.Services.Interfaces;

public interface IStudentService
{
    public Task<Response<ShowStudentDto>> GetByIdAsync(int id);
    public Task<Response<ShowStudentDto>> GetByNameAsync(string name);
    public Task<Response<List<ShowStudentDto>>> GetAllAsync();
    public Task<Response<List<ShowStudentWithCoursesDto>>> GetAllInCourseByCourseNameAsync(string courseName);
    public Task<Response<PaginateResult<ShowStudentDto>>> GetPaginatedListOfStudentAsync(int pageNumber, int pageSize);
    public Task<Response<List<ShowStudentCourseDto>>> GetAllEnrolledStudentCourses(int studentId);

    public Task<Response<string>> EnrollToCourse(StudentEnrollDto studentEnrollDto);
    public Task<Response<bool>> IsEnrolledInCourse(StudentEnrollDto studentEnrollDto);

    public Task<Response<string>> CreateAsync(CreateStudentDto createStudent);
    public Task<Response<string>> UpdateAsync(UpdateStudentDto updateStudentDto);
    public Task<Response<string>> DeleteAsync(int id);
    // enroll to course
    // first should check in payment table
}