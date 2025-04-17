using Backend.DTOs.StudentDOs;

namespace Backend.Services.Interfaces;

public interface IStudentService
{
    Task<Response<ShowStudentDto>> GetByIdAsync(int id);
    Task<Response<ShowStudentDto>> GetByNameAsync(string name);
    Task<Response<List<ShowStudentDto>>> GetAllAsync();
    Task<Response<List<ShowStudentWithCoursesDto>>> GetAllInCourseByCourseNameAsync(string courseName);

    // enroll to course
    // first should check in payment table
}