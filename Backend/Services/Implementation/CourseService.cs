using Hangfire;


namespace Backend.Services.Implementation;

public class CourseService : ResponseHandler, ICourseService
{
    #region   Fields
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly IPhysicalFileUpload _physicalFileUpload;
    private readonly IStructuredLogger _logger;
    private readonly IGeminiObjectTranslator _translator;
    CultureInfo cultureInfo = Thread.CurrentThread.CurrentCulture;
    #endregion

    #region   Counstructor
    public CourseService(IUnitOfWork unitOfWork,
                         IMapper mapper,
                         IPhysicalFileUpload physicalFileUpload,
                         IStructuredLogger logger,
                         IGeminiObjectTranslator translator)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _physicalFileUpload = physicalFileUpload;
        _logger = logger;
        _translator = translator;
    }
    #endregion

    #region   Handle Methods

    public async Task<Response<List<ShowAllCoursesDto>>> GetAllAsync()
    {
        var courses = await _unitOfWork.Repository<Course>()
                                                  .GetTableNoTracking()
                                                  .Where(c => c.IsDeleted == false)
                                                  .Include(c => c.Category)
                                                  .Include(c => c.Teacher)
                                                  .ToListAsync();
        if (courses == null)
        {
            _logger.LogInfo("No Courses");
            BadRequest<List<ShowAllCoursesDto>>("Courses is null");
        }

        var result = _mapper.Map<List<ShowAllCoursesDto>>(courses);
        return Success(result);
    }
    public async Task<Response<List<HomeCourses>>> GetAllByCategoryAsync(int categoryId)
    {
        var courses = await _unitOfWork.Repository<Course>()
                                                      .GetTableNoTracking()
                                                      .Include(c => c.Category)
                                                      .Where(c => c.Category.Id == categoryId && c.IsDeleted == false)
                                                      .Select(c => new HomeCourses
                                                      {
                                                          Id = c.Id,
                                                          Title = GeneralLocalizableEntity.Localized(c.TitleAr, c.TitleEn),
                                                          Description = GeneralLocalizableEntity.Localized(c.DescriptionAr, c.DescriptionEn),
                                                          Level = GeneralLocalizableEntity.Localized(c.LevelAr, c.LevelEn),
                                                          Price = c.Price,
                                                          ImagePath = c.ImagePath,
                                                      })
                                                      .ToListAsync();
        if (courses == null)
        {
            _logger.LogInfo("No Courses in GetAllByCategoryAsync");
            BadRequest<List<ShowAllCoursesDto>>("Courses is null in this category");
        }

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

        if (courses == null)
        {
            _logger.LogInfo($"No Courses in GetAllCoursesOfTeacherAsync");
            return NotFound<List<ShowCourseDto>>("Course not found");
        }

        var result = _mapper.Map<List<ShowCourseDto>>(courses);
        return Success(result);
    }
    public async Task<Response<ShowCourseDto>> GetCourseByIdAsync(int id)
    {
        var course = await _unitOfWork.Repository<Course>()
                                                       .GetTableNoTracking()
                                                       .Where(c => c.IsDeleted == false)
                                                       .Include(c => c.Category)!
                                                       .Include(c => c.Teacher)
                                                       .Include(c => c.lessons)!
                                                       .Include(c => c.StudentCourses)!
                                                       .ThenInclude(sc => sc.Student)!
                                                       .FirstOrDefaultAsync(c => c.Id == id);

        if (course == null)
        {
            _logger.LogInfo($"No Course with this id => {id} in GetCourseByIdAsync");
            return NotFound<ShowCourseDto>("Course not found");
        }
        var result = _mapper.Map<ShowCourseDto>(course);
        return Success(result);
    }
    public async Task<Response<PaginateResult<HomeCourses>>> GetPaginatedCourse(int pageNumber, int pageSize, enOrderBy? orderBy = null)
    {
        var querable = GetCourseQuerable();

        if (querable == null)
        {
            _logger.LogInfo($"No Courses in GetPaginatedCourse in this page");
            return NotFound<PaginateResult<HomeCourses>>("Course not found");
        }
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


    public async Task Translate(string level, string title, string desc, int courseId, string language)
    {
        var course = await _unitOfWork.Repository<Course>().GetByIdAsync(courseId);
        _logger.LogInfo("Start hangfire service");
        if (language == "en")
        {
            level = await _translator.TranslateObjectAsync<string>(level, "English", "Arabic");
            title = await _translator.TranslateObjectAsync<string>(title, "English", "Arabic");
            desc = await _translator.TranslateObjectAsync<string>(desc, "English", "Arabic");


            course.LevelAr = level;
            course.TitleAr = title;
            course.DescriptionAr = desc;
        }
        else
        {
            level = await _translator.TranslateObjectAsync<string>(level, "Arabic", "English");
            title = await _translator.TranslateObjectAsync<string>(title, "Arabic", "English");
            desc = await _translator.TranslateObjectAsync<string>(desc, "Arabic", "English");
            course.LevelEn = level;
            course.TitleEn = title;
            course.DescriptionEn = desc;
        }
        _unitOfWork.Repository<Course>().Update(course);
        _unitOfWork.Complete();
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
            _logger.LogInfo("start upload physical image");
            imageUrl = await _physicalFileUpload.UploadFileAsync("Courses", createCourseDto.Image);

            if (imageUrl == null)
            {
                _logger.LogInfo("Can not upload physical image");
                return BadRequest<string>("Image upload failed");
            }
        }

        var course = _mapper.Map<Course>(createCourseDto);
        course.ImagePath = imageUrl;

        await _unitOfWork.Repository<Course>().AddAsync(course);
        var isSuccessAdd = _unitOfWork.Complete();

        if (isSuccessAdd > 0)
        {
            BackgroundJob.Enqueue(() => Translate(createCourseDto.Level, createCourseDto.Title, createCourseDto.Description, course.Id, cultureInfo.TwoLetterISOLanguageName.ToLower()));
            _logger.LogInfo("Course Added Successfully");
            return Created<string>("Course created successfully");
        }
        _logger.LogInfo("Error when try add course");
        return Created<string>("can not crate course try later");
    }

    public async Task<Response<string>> UpdateAsync(UpdateCourseDto updateCourseDto)
    {
        if (updateCourseDto == null)
            return BadRequest<string>("Invalid course data");

        var course = await _unitOfWork.Repository<Course>().GetByIdAsync(updateCourseDto.Id);
        if (course == null)
            return NotFound<string>("Course not found");


        string? imageUrl = null;

        if (updateCourseDto.Image != null)
        {
            _logger.LogInfo("start upload physical image in update");
            imageUrl = await _physicalFileUpload.UploadFileAsync("Courses", updateCourseDto.Image);
        }

        _mapper.Map(updateCourseDto, course);
        course.ImagePath = imageUrl;

        _unitOfWork.Repository<Course>().Update(course);
        _unitOfWork.Complete();
        return Success("Course updated successfully");
    }

    public async Task<Response<string>> DeleteAsync(int id)
    {
        var course = await _unitOfWork.Repository<Course>().GetByIdAsync(id);
        if (course == null)
            return NotFound<string>("Course not found");

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
            .Where(c => GeneralLocalizableEntity.Localized(c.Category!.CategoryNameAr, c.Category!.CategoryNameEn) == category && c.IsDeleted == false)
            .Select(c => new ShowCourseInfoByCategoryDto
            {
                Description = GeneralLocalizableEntity.Localized(c.DescriptionAr, c.DescriptionEn),
                Price = c.Price,
                CreatedAt = c.CreatedAt,
                ImagePath = c.ImagePath,
                Level = GeneralLocalizableEntity.Localized(c.LevelAr, c.LevelEn),
                Hours = c.Hours
            })
            .ToListAsync();
        return Success(courses);
    }
    private IQueryable<Course> GetCourseQuerable()
    {
        var result = _unitOfWork.Repository<Course>().GetTableNoTracking().Where(c => c.IsDeleted == false);

        return result;
    }
    #endregion
}