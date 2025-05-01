using Backend.Wrapper;

namespace Backend.Services.Interfaces;

public interface ICourseService
{
    public Task<Response<ShowCourseDto>> GetCourseByIdAsync(int id);
    public Task<Response<List<ShowAllCoursesDto>>> GetAllAsync();
    public Task<Response<PaginateResult<HomeCourses>>> GetPaginatedCourse(int pageNumber, int pageSize, enOrderBy? orderBy = null);

    public Task<Response<string>> CreateAsync(CreateCourseDto createCourseDto);
    public Task<Response<string>> UpdateAsync(UpdateCourseDto createCourseDto);
    public Task<Response<string>> DeleteAsync(int id);
}

public enum enOrderBy { noOrder = 0, Price = 1, CreatedAt = 2, }