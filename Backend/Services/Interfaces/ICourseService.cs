namespace Backend.Services.Interfaces;

public interface ICourseService
{

    Task Translate(string level, string title, string desc, int courseId, string language);
    public Task<Response<ShowCourseDto>> GetCourseByIdAsync(int id);
    public Task<Response<List<ShowAllCoursesDto>>> GetAllAsync();
    public Task<Response<List<HomeCourses>>> GetAllByCategoryAsync(int categoryId);

    public Task<Response<PaginateResult<HomeCourses>>> GetPaginatedCourse(int pageNumber, int pageSize, enOrderBy? orderBy = null);
    public Task<Response<string>> CreateAsync(CreateCourseDto createCourseDto);
    public Task<Response<string>> UpdateAsync(UpdateCourseDto createCourseDto);
    public Task<Response<string>> DeleteAsync(int id);
    public Task<Response<List<ShowCourseInfoByCategoryDto>>> GetCourseInfoByCategoryAsync(string category);

    public Task<Response<List<ShowCourseDto>>> GetAllCoursesOfTeacherAsync(int teacherId);
}

public enum enOrderBy { noOrder = 0, Price = 1, CreatedAt = 2, }