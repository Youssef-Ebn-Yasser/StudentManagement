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
    public async Task<Response<string>> CreateAsync(CreateCourseDto createCourseDto)
    {
        if (createCourseDto == null)
            return BadRequest<string>("Course data is required");

        if (string.IsNullOrWhiteSpace(createCourseDto.Title))
            return BadRequest<string>("Course title is required");

        if (createCourseDto.Price == null || createCourseDto.Price <= 0)
            return BadRequest<string>("Course price must be greater than 0");

        if (createCourseDto.TeacherId == null || createCourseDto.TeacherId <= 0)
            return BadRequest<string>("Valid teacher ID is required");

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
        return Created<string>("Course created successfully");
    }

    public async Task<Response<string>> DeleteAsync(int id)
    {
        var course = await _unitOfWork.Repository<Course>().GetByIdAsync(id);
        if (course == null)
            return NotFound<string>("Course not found");

        // Get all lessons associated with this course
        var lessons = await _unitOfWork.Repository<Lesson>()
            .GetTableNoTracking()
            .Where(l => l.CourseId == id)
            .ToListAsync();

        // Delete all materials associated with each lesson
        foreach (var lesson in lessons)
        {
            var materials = await _unitOfWork.Repository<Material>()
                .GetTableNoTracking()
                .Where(m => m.LessonId == lesson.Id)
                .ToListAsync();

            foreach (var material in materials)
            {
                // Delete material files if they exist
                if (!string.IsNullOrWhiteSpace(material.Path))
                {
                    var materialPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", material.Path.TrimStart('/'));
                    if (File.Exists(materialPath))
                        File.Delete(materialPath);
                }
                _unitOfWork.Repository<Material>().Delete(material);
            }

            // Delete the lesson
            _unitOfWork.Repository<Lesson>().Delete(lesson);
        }

        // Delete course image if it exists
        if (!string.IsNullOrWhiteSpace(course.ImagePath))
        {
            var imageFullPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", course.ImagePath.TrimStart('/'));
            if (File.Exists(imageFullPath))
                File.Delete(imageFullPath);
        }

        // Delete the course
        _unitOfWork.Repository<Course>().Delete(course);
        await _unitOfWork.CompleteAsync();
        return Success("Course and all associated content deleted successfully");
    }

    public async Task<Response<List<ShowAllCoursesDto>>> GetAllAsync()
    {
        var courses = await _unitOfWork.Repository<Course>()
         .GetTableNoTracking()
         .ToListAsync();

        var result = _mapper.Map<List<ShowAllCoursesDto>>(courses);
        return Success(result);
    }

    public async Task<Response<ShowCourseDto>> GetCourseByIdAsync(int id)
    {
        var course = await _unitOfWork.Repository<Course>()
         .GetTableNoTracking()
         .FirstOrDefaultAsync(c => c.Id == id);

        if (course == null)
            return NotFound<ShowCourseDto>("Course not found");

        var result = _mapper.Map<ShowCourseDto>(course);
        return Success(result);
    }

    public async Task<Response<string>> UpdateAsync(UpdateCourseDto createCourseDto)
    {
        if (createCourseDto == null || string.IsNullOrWhiteSpace(createCourseDto.Id))
            return BadRequest<string>("Invalid course data");

        var course = await _unitOfWork.Repository<Course>().GetByIdAsync(int.Parse(createCourseDto.Id));
        if (course == null)
            return NotFound<string>("Course not found");

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
        return Success("Course updated successfully");
    }
    #endregion
}