
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

        if (string.IsNullOrWhiteSpace(createCourseDto.Title))
            return _responseHandler.BadRequest<string>("Course title is required");

        if (createCourseDto.Price == null || createCourseDto.Price <= 0)
            return _responseHandler.BadRequest<string>("Course price must be greater than 0");

        if (createCourseDto.TeacherId == null || createCourseDto.TeacherId <= 0)
            return _responseHandler.BadRequest<string>("Valid teacher ID is required");

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
        course.ImagePath = imagePath;

        await _unitOfWork.Repository<Course>().AddAsync(course);
        return _responseHandler.Created<string>("Course created successfully");
    }

    public async Task<Response<string>> DeleteAsync(int id)
    {
        var course = await _unitOfWork.Repository<Course>().GetByIdAsync(id);
        if (course == null)
            return _responseHandler.NotFound<string>("Course not found");

        if (!string.IsNullOrWhiteSpace(course.ImagePath))
        {
            var imageFullPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", course.ImagePath.TrimStart('/'));
            if (File.Exists(imageFullPath))
                File.Delete(imageFullPath);
        }

        _unitOfWork.Repository<Course>().Delete(course);
        return _responseHandler.Success("Course deleted successfully");
    }

    public async Task<Response<List<ShowAllCoursesDto>>> GetAllAsync()
    {
        var courses = await _unitOfWork.Repository<Course>()
         .GetTableNoTracking()
         .ToListAsync();

        var result = _mapper.Map<List<ShowAllCoursesDto>>(courses);
        return _responseHandler.Success(result);
    }

    public async Task<Response<ShowCourseDto>> GetCourseByIdAsync(int id)
    {
        var course = await _unitOfWork.Repository<Course>()
         .GetTableNoTracking()
         .Include(c => c.materials)
         .Include(c => c.Assignments)
         .Include(c => c.studentCourses).ThenInclude(sc => sc.Student)
         .FirstOrDefaultAsync(c => c.Id == id);

        if (course == null)
            return _responseHandler.NotFound<ShowCourseDto>("Course not found");

        var result = _mapper.Map<ShowCourseDto>(course);
        return _responseHandler.Success(result);
    }

    public async Task<Response<string>> UpdateAsync(UpdateCourseDto createCourseDto)
    {
        if (createCourseDto == null || string.IsNullOrWhiteSpace(createCourseDto.Id))
            return _responseHandler.BadRequest<string>("Invalid course data");

        var course = await _unitOfWork.Repository<Course>().GetByIdAsync(int.Parse(createCourseDto.Id));
        if (course == null)
            return _responseHandler.NotFound<string>("Course not found");

        string? newImagePath = course.ImagePath;

        if (createCourseDto.Image != null)
        {
            var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "Images");
            Directory.CreateDirectory(uploadsFolder);

            var fileName = Guid.NewGuid().ToString() + Path.GetExtension(createCourseDto.Image.FileName);
            var filePath = Path.Combine(uploadsFolder, fileName);   

            using var stream = new FileStream(filePath, FileMode.Create);
            await createCourseDto.Image.CopyToAsync(stream);

            newImagePath = $"/Images/{fileName}";

            if (!string.IsNullOrWhiteSpace(course.ImagePath))
            {
                var oldImagePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", course.ImagePath.TrimStart('/'));
                if (File.Exists(oldImagePath))
                    File.Delete(oldImagePath);
            }
        }

        _mapper.Map(createCourseDto, course);
        course.ImagePath = newImagePath;

        _unitOfWork.Repository<Course>().Update(course);
        return _responseHandler.Success("Course updated successfully");
    }

    #endregion
}