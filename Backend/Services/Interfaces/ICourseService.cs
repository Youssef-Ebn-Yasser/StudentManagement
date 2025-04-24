namespace Backend.Services.Interfaces;

public interface ICourseService
{
    public Task<Response<ShowCourseDto>> GetCourseByIdAsync(int id);
    public Task<Response<List<ShowAllCoursesDto>>> GetAllAsync();

    public Task<Response<string>> CreateAsync(CreateCourseDto createCourseDto);
    public Task<Response<string>> UpdateAsync(UpdateCourseDto createCourseDto);
    public Task<Response<string>> DeleteAsync(int id);
}