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
    #endregion

    #region   Handle Methods

    #endregion
}