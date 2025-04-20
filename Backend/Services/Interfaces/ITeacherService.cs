namespace Backend.Services.Interfaces;

public interface ITeacherService
{
    public Task<Response<List<ShowAllTeacherDto>>> GetAllAsync();
    public Task<Response<List<ShowAllTeacherWithDetailsDto>>> GetAllDeletedAsync();
    public Task<Response<TeacherProfileDto>> GetByIdAsync(int id);
    public Task<Response<GetTeacherDto>> GetByNameAsync(string name);

    public Task<Response<string>> CreateAsync(CreateTeacherDto createTeacherDto);
    public Task<Response<string>> DeleteAsync(int id);
    public Task<Response<string>> UpdateAsync(UpdateTeacherDto createTeacherDto);
}