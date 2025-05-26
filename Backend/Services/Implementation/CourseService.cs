using Backend.Wrapper;


namespace Backend.Services.Implementation;

public class CourseService : ResponseHandler, ICourseService
{
    #region   Fields
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly IFileService _fileService;
    #endregion

    #region   Counstructor
    public CourseService(IUnitOfWork unitOfWork, IMapper mapper, IFileService fileService)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _fileService = fileService;
    }


    #endregion

    #region   Handle Methods

    public async Task<Response<List<ShowAllCoursesDto>>> GetAllAsync()
    {
        var courses = await _unitOfWork.Repository<Course>()
        .GetTableNoTracking()
        .Where(c => c.IsDeleted == false)
        .Include(c => c.Category)
        .ToListAsync();

        var result = _mapper.Map<List<ShowAllCoursesDto>>(courses);
        return Success(result);
    }

    public async Task<Response<List<HomeCourses>>> GetAllByCategoryAsync(string categoryName)
    {
        var courses = await _unitOfWork.Repository<Course>()
                                                      .GetTableNoTracking()
                                                      .Include(c => c.Category)
                                                      .Where(c => c.Category!.CategoryName == categoryName && c.IsDeleted == false)
                                                      .Select(c => new HomeCourses
                                                      {
                                                          Id = c.Id,
                                                          Title = c.Title,
                                                          Description = c.Description,
                                                          Level = c.Level,
                                                          Price = c.Price,
                                                          ImagePath = c.ImagePath,
                                                      })
                                                      .ToListAsync();


        return Success(courses);
    }

    public async Task<Response<ShowCourseDto>> GetCourseByIdAsync(int id)
    {
        var course = await _unitOfWork.Repository<Course>()
                                                       .GetTableNoTracking()
                                                       .Where(c => c.IsDeleted == false)
                                                       .Include(c => c.Category)
                                                       .Include(c => c.Teacher)
                                                       .Include(c => c.lessons)
                                                       .Include(c => c.StudentCourses)
                                                       .ThenInclude(sc => sc.Student)
                                                       .ThenInclude(s => s.Comments)
                                                       .ThenInclude(c => c.Lesson)
                                                       .FirstOrDefaultAsync(c => c.Id == id);

        if (course == null)
            return NotFound<ShowCourseDto>("Course not found");

        var result = _mapper.Map<ShowCourseDto>(course);
        return Success(result);
    }

    private IQueryable<Course> GetCourseQuerable()
    {
        var result = _unitOfWork.Repository<Course>().GetTableNoTracking().Where(c => c.IsDeleted == false);

        return result;
    }
    public async Task<Response<PaginateResult<HomeCourses>>> GetPaginatedCourse(int pageNumber, int pageSize, enOrderBy? orderBy = null)
    {
        var querable = GetCourseQuerable();

        switch (orderBy)
        {
            case enOrderBy.Price:
                querable = querable.OrderBy(c => c.Price);
                break;
            case enOrderBy.CreatedAt:
                querable = querable.OrderBy(x => x.CreatedAt);
                break;
            case enOrderBy.noOrder:
            default:
                querable = querable.OrderBy(x => x.Id);
                break;
        }

        var result = await _mapper.ProjectTo<HomeCourses>(querable)
                                                        .ToPaginatedListAsync(pageNumber, pageSize);
        return Success(result);
    }

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

        string? imageUrl = null;

        if (createCourseDto.Image != null)
        {
            imageUrl = await _fileService.UploadFileAsync(createCourseDto.Image);

            if (imageUrl == null)
                return BadRequest<string>("Image upload failed");
        }

        var course = _mapper.Map<Course>(createCourseDto);
        course.ImagePath = imageUrl;

        await _unitOfWork.Repository<Course>().AddAsync(course);
        _unitOfWork.Complete();

        return Created<string>("Course created successfully");
    }

    public async Task<Response<string>> UpdateAsync(UpdateCourseDto updateCourseDto)
    {
        if (updateCourseDto == null || string.IsNullOrWhiteSpace(updateCourseDto.Id))
            return BadRequest<string>("Invalid course data");

        var course = await _unitOfWork.Repository<Course>().GetByIdAsync(int.Parse(updateCourseDto.Id));
        if (course == null)
            return NotFound<string>("Course not found");

        string? newImagePath = course.ImagePath;

        if (updateCourseDto.Image != null)
        {
            var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "Images");
            Directory.CreateDirectory(uploadsFolder);

            var fileName = Guid.NewGuid().ToString() + Path.GetExtension(updateCourseDto.Image.FileName);
            var filePath = Path.Combine(uploadsFolder, fileName);

            using var stream = new FileStream(filePath, FileMode.Create);
            await updateCourseDto.Image.CopyToAsync(stream);

            newImagePath = $"/Images/{fileName}";

            if (!string.IsNullOrWhiteSpace(course.ImagePath))
            {
                var oldImagePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", course.ImagePath.TrimStart('/'));
                if (File.Exists(oldImagePath))
                    File.Delete(oldImagePath);
            }
        }

        _mapper.Map(updateCourseDto, course);
        course.ImagePath = newImagePath;

        _unitOfWork.Repository<Course>().Update(course);
        _unitOfWork.Complete();
        return Success("Course updated successfully");
    }

    public async Task<Response<string>> DeleteAsync(int id)
    {
        var course = await _unitOfWork.Repository<Course>().GetByIdAsync(id);
        if (course == null)
            return NotFound<string>("Course not found");

        if (!string.IsNullOrWhiteSpace(course.ImagePath))
        {
            var deleteResult = await _fileService.DeleteImageByUrlAsync(course.ImagePath);
            if (!deleteResult.Success)
                return BadRequest<string>($"Failed to delete image: {deleteResult.Message}");
        }

        //soft delete using IsDeleted flag and checking if the course is already deleted and there is lessons in the course make them Isdeleted true
        if (course.lessons != null && course.lessons.Any())
        {
            foreach (var lesson in course.lessons)
            {
                lesson.IsDeleted = true;
            }
        }
        course.IsDeleted = true;


        _unitOfWork.Repository<Course>().Update(course);
        _unitOfWork.Complete();

        return Success("Course deleted successfully");
    }
    public async Task<Response<List<ShowCourseInfoByCategoryDto>>> GetCourseInfoByCategoryAsync(string category)
    {
        var courses = await _unitOfWork.Repository<Course>()
            .GetTableNoTracking()
            .Where(c => c.Category!.CategoryName == category && c.IsDeleted == false)
            .Select(c => new ShowCourseInfoByCategoryDto
            {
                Description = c.Description,
                Price = c.Price,
                CreatedAt = c.CreatedAt,
                ImagePath = c.ImagePath,
                Level = c.Level,
                Hours = c.Hours
            })
            .ToListAsync();
        return Success(courses);
    }

    public async Task<Response<List<ShowCourseDto>>> GetAllCoursesOfTeacherAsync(int teacherId)
    {
        var courses = await _unitOfWork.Repository<Course>()
            .GetTableNoTracking()
            .Where(c => c.TecherId == teacherId && c.IsDeleted == false)
            .Include(c => c.Teacher)
            .Include(c => c.Category)
            .Include(c => c.lessons)
            .ToListAsync();
        var result = _mapper.Map<List<ShowCourseDto>>(courses);
        return Success(result);
    }


    #endregion
}