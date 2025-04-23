using Backend.DTOs.TeacherDTOs;

namespace Backend.Services.Interfaces;

public interface ITeacherService
{
    public Task<Response<ShowAllTeacherDto>> GetAllAsync();
    public Task<Response<TeacherProfileDto>> GetByIdAsync(int id);
    public Task<Response<GetTeacherDto>> GetByNameAsync(string name);

    public Task<Response<string>> CreateAsync(CreateTeacherDto createTeacherDto);
    public Task<Response<string>> DeleteAsync(int id);
    public Task<Response<string>> UpdateAsync(UpdateTeacherDto createTeacherDto);
}