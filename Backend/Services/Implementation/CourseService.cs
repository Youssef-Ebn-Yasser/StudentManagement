
using Backend.BaseResponse;
using Backend.DTOs.CourseDTO;

namespace Backend.Services.Implementation;

public class CourseService : ResponseHandler, ICourseService
{
    #region   Fields
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly ResponseHandler _responseHandler;
    #endregion

    #region   Counstructor
    public CourseService(IUnitOfWork unitOfWork, IMapper mapper, ResponseHandler responseHandler)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _responseHandler = responseHandler;
    }


    #endregion

    #region   Handle Methods
    public async Task<Response<string>> CreateAsync(CreateCourseDto createCourseDto)
    {
        if (createCourseDto == null)
            return _responseHandler.BadRequest<string>("Course data is required");

        
        string? imagePath = null;
        if (createCourseDto.Image != null)
        {
            var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "Images");
            Directory.CreateDirectory(uploadsFolder);
            var fileName = Guid.NewGuid().ToString() + Path.GetExtension(createCourseDto.Image.FileName);
            var filePath = Path.Combine(uploadsFolder, fileName);

            using var stream = new FileStream(filePath, FileMode.Create);
            await createCourseDto.Image.CopyToAsync(stream);

            imagePath = $"/Images/{fileName}";
        }
        
      
        var course = _mapper.Map<Course>(createCourseDto);
       // course.Image=imagePath;  ERRORRRRR

        
      

      
        await _unitOfWork.Repository<Course>().AddAsync(course);
       

        return _responseHandler.Created<string>("Course created successfully");
    }

    public async Task<Response<string>> DeleteAsync(int id)
    {
        var course = await _unitOfWork.Repository<Course>().GetByIdAsync(id);
        if (course == null)
        {
            return _responseHandler.NotFound<string>("Course not found");
        }

        
        _unitOfWork.Repository<Course>().Delete(course);

       

        return _responseHandler.Success("Course deleted successfully");
    }

    public async Task<Response<List<ShowAllCoursesDto>>> GetAllAsync()
    {
        var courses = await _unitOfWork.Repository<Course>().GetTableNoTracking().ToListAsync();
        var result = _mapper.Map<List<ShowAllCoursesDto>>(courses);
        return _responseHandler.Success(result);
    }

    public async Task<Response<ShowCourseDto>> GetCourseByIdAsync(int id)
    {
        var course =  _unitOfWork.Repository<Course>().GetTableNoTracking();

        if (course == null)
            return _responseHandler.NotFound<ShowCourseDto>("Course not found");

        var result = _mapper.Map<ShowCourseDto>(course);
        return _responseHandler.Success(result);
    }

    public async Task<Response<string>> UpdateAsync(UpdateCourseDto createCourseDto)
    {
        var course = await _unitOfWork.Repository<Course>() .GetByIdAsync(int.Parse( createCourseDto.Id));
        if (course == null)
        {
            return _responseHandler.NotFound<string>("Course not found");
        }

        
        _mapper.Map(createCourseDto, course);

        
        _unitOfWork.Repository<Course>().Update(course);

        

        return _responseHandler.Success("Course updated successfully");
    }

    #endregion
}