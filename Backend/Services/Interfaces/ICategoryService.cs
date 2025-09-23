namespace Backend.Services.Interfaces;

public interface ICategoryService
{
    Task<Response<CategoryDto>> GetByIdAsync(int id);
    Task<Response<List<CategoryDto>>> GetAllAsync();
    Task<Response<string>> CreateAsync(CreateCategoryDto dto);
    Task<Response<string>> UpdateAsync(int id, UpdateCategoryDto dto);
    Task<Response<string>> DeleteAsync(int id);
    public Task Translate(string title, int categoryId, string language);
}