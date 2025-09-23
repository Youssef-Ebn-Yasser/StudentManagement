namespace Backend.Services.Interfaces;

public interface IBrochuresService
{
    public Task<Response<string>> CreateCourseBrouchers(CreateCourseBrochuresDto dto);
    public Task<Response<List<GetAllCourseBrochuresDto>>> GetAllCourseBrouchers();
    public Task<Response<List<GetAllCourseBrochuresDto>>> GetAllCourseBrouchers(int courseId);
    public Task<Response<string>> UpdateCourseBrouchers(UpdateCourseBrochuresDto dto);
    public Task<Response<string>> DeleteCourseBrouchers(int id);
}