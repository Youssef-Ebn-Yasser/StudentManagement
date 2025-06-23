using Backend.Wrapper;

namespace Backend.Services.Interfaces;

public interface ITeacherService
{
    public Task<PaginateResult<ShowAllTeacherDto>> GetAllPaginatedAsync(int pageNumber, int pageSize, enTeacherOrderBy? orderBy);
    public Task<PaginateResult<ShowAllTeacherWithDetailsDto>> GetAllDeletedPaginatedAsync(int pageNumber, int pageSize);
    public Task<Response<TeacherProfileDto>> GetByIdAsync(int id);
    public Task<Response<GetTeacherDto>> GetByNameAsync(string name);
    public Task<Response<List<ShowAllTeacherDto>>> GetAllAsync();
    public Task<Response<string>> DeleteAsync(int id);
    public Task<Response<string>> UpdateAsync(UpdateTeacherDto createTeacherDto);
    public enum enTeacherOrderBy
    {
        noOrder = 0,
        Name = 1,
        CreatedAt = 2
    }
}