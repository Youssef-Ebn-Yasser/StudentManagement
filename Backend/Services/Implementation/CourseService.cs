
namespace Backend.Services.Implementation;

public class CourseService : ResponseHandler, ICourseService
{
    #region   Fields
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    #endregion

    #region   Counstructor
    public CourseService(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public Task<Response<string>> CreateAsync(CreateCourseDto createCourseDto)
    {
        throw new NotImplementedException();
    }

    public Task<Response<string>> DeleteAsync(int id)
    {
        throw new NotImplementedException();
    }

    public Task<Response<List<ShowAllCoursesDto>>> GetAllAsync()
    {
        throw new NotImplementedException();
    }

    public Task<Response<ShowCourseDto>> GetCourseByIdAsync(int id)
    {
        throw new NotImplementedException();
    }

    public Task<Response<string>> UpdateAsync(UpdateCourseDto createCourseDto)
    {
        throw new NotImplementedException();
    }
    #endregion

    #region   Handle Methods

    #endregion
}