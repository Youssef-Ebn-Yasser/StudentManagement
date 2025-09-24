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
            await _logger.LogInfo(new LogInfoData()
            {
                LoghappenIn = EnLogHappenIn.Course,
                Message = "try get All Courses and No Courses found",
                LogsIn = "Courses",
                Level = EnLevel.Warnning,
            });
            BadRequest<List<ShowAllCoursesDto>>("Courses is null");
        }

        var result = _mapper.Map<List<ShowAllCoursesDto>>(courses);
        return Success(result);
    }

    public async Task<Response<ForAddCourseDependenciesDto>> GetDependenciesForAddCourse()
    {
        var teacherDependencies = await _unitOfWork.Repository<Teacher>()
                                                                        .GetTableNoTracking()
                                                                        .Where(t => !t.IsDeleted)
                                                                        .Select(t => new TeacherDependencies
                                                                        {
                                                                            TeacherId = t.Id,
                                                                            TeacherName = t.NameEn
                                                                        }).ToListAsync();

        var Categoryependencies = await _unitOfWork.Repository<Category>()
                                                                         .GetTableNoTracking()
                                                                         .Where(c => !c.IsDeleted)
                                                                         .Select(c => new CategoryDependencies
                                                                         {
                                                                             CategoryId = c.Id,
                                                                             Categoryname = c.CategoryNameEn
                                                                         }).ToListAsync();

        var response = new ForAddCourseDependenciesDto()
        {
            CategoryDependencies = Categoryependencies,
            TeacherDependencies1 = teacherDependencies
        };


        return Success(response);
    }
    public async Task<Response<List<HomeCourses>?>> GetAllByCategoryAsync(int categoryId)
    {
        var courses = await _unitOfWork.Repository<Course>()
                                                      .GetTableNoTracking()
                                                      .Include(c => c.Category)
                                                      .Where(c => c.Category.Id == categoryId && c.IsDeleted == false)
                                                      .Select(c => new HomeCourses
                                                      {
                                                          Id = c.Id,
                                                          Title = GeneralLocalizableEntity.Localized(c.TitleAr, c.TitleEn) ?? "no title",
                                                          Description = GeneralLocalizableEntity.Localized(c.DescriptionAr, c.DescriptionEn),
                                                          Level = GeneralLocalizableEntity.Localized(c.LevelAr, c.LevelEn),
                                                          Price = c.Price,
                                                          ImagePath = c.ImagePath,
                                                      })
                                                      .ToListAsync();
        if (courses == null)
        {
            await _logger.LogInfo(new LogInfoData()
            {
                LoghappenIn = EnLogHappenIn.Course,
                Message = "try get All Courses by category and No Courses found",
                LogsIn = "Courses",
                Level = EnLevel.Warnning,
            });

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
            await _logger.LogInfo(new LogInfoData()
            {
                LoghappenIn = EnLogHappenIn.Course,
                Message = $"try get All Courses for teacher and No Courses found for this teacher with id {teacherId}",
                LogsIn = "Courses",
                Level = EnLevel.Warnning,
            });

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
            await _logger.LogInfo(new LogInfoData()
            {
                LoghappenIn = EnLogHappenIn.Course,
                Message = $"No Course with this id => {id} in GetCourseByIdAsync",
                LogsIn = "Courses",
                Level = EnLevel.Warnning,
            });

            return NotFound<ShowCourseDto>("Course not found");
        }
        if (cultureInfo.TwoLetterISOLanguageName.ToLower() == "ar" && course.LevelAr == null)
        {
            course.LevelAr = await _translator.TranslateObjectAsync<string>(course.LevelEn ?? course.LevelAr ?? "no name", "English", "Arabic");
            course.TitleAr = await _translator.TranslateObjectAsync<string>(course.TitleEn, "English", "Arabic");
            course.DescriptionAr = await _translator.TranslateObjectAsync<string>(course.DescriptionEn ?? course.DescriptionAr ?? "no name", "English", "Arabic");
        }

        course.lessons = course.lessons?.Where(l => !l.IsDeleted).ToList();

        var result = _mapper.Map<ShowCourseDto>(course);

        await _logger.LogInfo(new LogInfoData()
        {
            LoghappenIn = EnLogHappenIn.Course,
            Message = $"get this course with name {course.TitleEn}",
            HappenInId = course.Id,
            LogsIn = "Course",
        });


        return Success(result);
    }

    public async Task<Response<PaginateResult<HomeCourses>>> GetPaginatedCourse(int pageNumber, int pageSize, enOrderBy? orderBy = null,
    EnFilterBy? filterBy = null, string? value = null)
    {
        var querable = GetCourseQuerable();

        if (querable == null)
        {
            await _logger.LogInfo(new LogInfoData()
            {
                LoghappenIn = EnLogHappenIn.Course,
                Message = $"No Courses in GetPaginatedCourse in this page",
                LogsIn = "Course",
                Level = EnLevel.Warnning,
            });

            return NotFound<PaginateResult<HomeCourses>>("Course not found");
        }

        if (filterBy != null && value != null)
        {
            switch (filterBy)
            {
                case EnFilterBy.name:
                    querable = querable.Where(c => c.TitleEn.Contains(value) || c.TitleAr!.Contains(value));
                    break;
                case EnFilterBy.duration:
                    querable = querable.Where(c => c.DurationBDays.ToString() == value);
                    break;
                case EnFilterBy.content:
                    querable = querable.OrderBy(c => c.DescriptionEn!.Contains(value) || c.DescriptionAr!.Contains(value));
                    break;
                default:
                    break;
            }
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
        var course = _unitOfWork.Repository<Course>().GetTableAsTracking().FirstOrDefault(c => c.Id == courseId);

        if (course == null) return;

        await _logger.LogInfo(new LogInfoData()
        {
            LoghappenIn = EnLogHappenIn.Course,
            Message = $"Start hangfire service to translate course with id {courseId} and name {title}",
            LogsIn = "Courses",
            HappenInId = courseId,
        });

        if (language == "en")
        {
            level = await _translator.TranslateObjectAsync<string>(level, "English", "Arabic") ?? "can not translate";
            title = await _translator.TranslateObjectAsync<string>(title, "English", "Arabic") ?? "can not translate";
            desc = await _translator.TranslateObjectAsync<string>(desc, "English", "Arabic") ?? "can not translate";


            course.LevelAr = level;
            course.TitleAr = title;
            course.DescriptionAr = desc;
        }
        else
        {
            level = await _translator.TranslateObjectAsync<string>(level, "Arabic", "English") ?? "can not translate";
            title = await _translator.TranslateObjectAsync<string>(title, "Arabic", "English") ?? "can not translate";
            desc = await _translator.TranslateObjectAsync<string>(desc, "Arabic", "English") ?? "can not translate";
            course.LevelEn = level;
            course.TitleEn = title;
            course.DescriptionEn = desc;
        }
        _unitOfWork.Repository<Course>().Update(course);
        var result = _unitOfWork.Complete();

        await _logger.LogInfo(new LogInfoData()
        {
            LoghappenIn = EnLogHappenIn.Course,
            Message = $"end hangfire service to translate course with id {courseId} and name {title} with status {result > 0}",
            LogsIn = "Courses",
            HappenInId = courseId,
        });
    }

    public async Task<Response<string>> CreateAsync(CreateCourseDto createCourseDto)
    {
        if (createCourseDto == null)
            return BadRequest<string>("Course data is required");

        if (string.IsNullOrWhiteSpace(createCourseDto.Title))
            return BadRequest<string>("Course title is required");

        if (createCourseDto.Price <= 0)
            return BadRequest<string>("Course price must be greater than 0");

        if (createCourseDto.TeacherId <= 0)
            return BadRequest<string>("Valid teacher ID is required");

        string? imageUrl = null;

        if (createCourseDto.Image != null)
        {
            await _logger.LogInfo(new LogInfoData()
            {
                LoghappenIn = EnLogHappenIn.Course,
                Message = $"start upload physical image for course with title {createCourseDto.Title}",
                LogsIn = "Courses",
            });

            imageUrl = await _physicalFileUpload.UploadFileAsync("Courses", createCourseDto.Image);

            if (imageUrl == null)
            {
                await _logger.LogInfo(new LogInfoData()
                {
                    LoghappenIn = EnLogHappenIn.Course,
                    Message = $"Can not upload physical image course with title {createCourseDto.Title}",
                    Level = EnLevel.Warnning,
                    LogsIn = "Courses",
                });

                return BadRequest<string>("Image upload failed");
            }
        }

        var course = _mapper.Map<Course>(createCourseDto);
        course.ImagePath = imageUrl;

        await _unitOfWork.Repository<Course>().AddAsync(course);
        var isSuccessAdd = _unitOfWork.Complete();

        if (isSuccessAdd > 0)
        {
            BackgroundJob.Enqueue<ICourseService>(x =>
                x.Translate(createCourseDto.Level, createCourseDto.Title, createCourseDto.Description,
                    course.Id, cultureInfo.TwoLetterISOLanguageName.ToLower()));


            await _logger.LogInfo(new LogInfoData()
            {
                LoghappenIn = EnLogHappenIn.Course,
                Message = $"Course Added Successfully with id {course.Id}",
                LogsIn = "Courses",
                HappenInId = course.Id,
            });

            return Created<string>("Course created successfully");
        }

        await _logger.LogInfo(new LogInfoData()
        {
            LoghappenIn = EnLogHappenIn.Course,
            Message = $"faild add course with name {createCourseDto.Title}",
            Level = EnLevel.Warnning,
            LogsIn = "Courses",
        });

        return BadRequest<string>("can not crate course try later");
    }

    public async Task<Response<string>> UpdateAsync(UpdateCourseDto updateCourseDto)
    {
        if (updateCourseDto == null)
            return BadRequest<string>("Invalid course data");

        var course = await _unitOfWork.Repository<Course>().GetByIdAsync(updateCourseDto.Id);
        if (course == null)
            return NotFound<string>("Course not found");

        string? imageUrl = null;

        _mapper.Map(updateCourseDto, course);

        if (updateCourseDto.Image != null)
        {
            await _logger.LogInfo(new LogInfoData()
            {
                LoghappenIn = EnLogHappenIn.Course,
                Message = $"start upload physical image in update with course id {updateCourseDto.Id}",
                LogsIn = "Courses",
                HappenInId = course.Id,
            });

            imageUrl = await _physicalFileUpload.UploadFileAsync("Courses", updateCourseDto.Image);

            if (string.IsNullOrEmpty(imageUrl))
            {
                await _logger.LogInfo(new LogInfoData()
                {
                    LoghappenIn = EnLogHappenIn.Course,
                    Message = $"faild upload physical image in update with course id {updateCourseDto.Id}",
                    Level = EnLevel.Warnning,
                    LogsIn = "Courses",
                    HappenInId = course.Id,
                });

            }
            await _logger.LogInfo(new LogInfoData()
            {
                LoghappenIn = EnLogHappenIn.Course,
                Message = $"Success upload physical image in update with course id {updateCourseDto.Id}",
                LogsIn = "Courses",
                HappenInId = course.Id,
            });

            course.ImagePath = imageUrl;
        }

        _unitOfWork.Repository<Course>().Update(course);
        var result = _unitOfWork.Complete();

        await _logger.LogInfo(new LogInfoData()
        {
            LoghappenIn = EnLogHappenIn.Course,
            Message = $"update  course with id has status =>  {result > 0}",
            LogsIn = "Courses",
            HappenInId = course.Id,
        });

        return Success("Course updated successfully");
    }

    public async Task<Response<string>> DeleteAsync(int id)
    {
        var course = await _unitOfWork.Repository<Course>()
                                       .GetTableAsTracking()
                                       .Include(c => c.lessons)
                                       .FirstOrDefaultAsync(c => c.Id == id);

        if (course == null)
            return NotFound<string>("Course not found");

        if (course.IsDeleted)
            return BadRequest<string>("Course is already deleted");

        if (course.lessons != null && course.lessons.Any())
        {
            await _logger.LogInfo(new LogInfoData()
            {
                LoghappenIn = EnLogHappenIn.Course,
                Message = $"try to delete this course with id {id} but can not because he have lessions",
                LogsIn = "Courses",
                Level = EnLevel.Warnning,
                HappenInId = id,
            });

            return BadRequest<string>("this course has lession can not deleted");
        }

        course.IsDeleted = true;

        _unitOfWork.Repository<Course>().Update(course);
        var result = _unitOfWork.Complete();

        await _logger.LogInfo(new LogInfoData()
        {
            LoghappenIn = EnLogHappenIn.Course,
            Message = $"try to delete this course with id {id} with status {result > 0}",
            LogsIn = "Courses",
            HappenInId = id,
        });

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

    public async Task<Response<List<ShowStudentAndCourse>>> GetAllStudentAndCourse()
    {
        // all students that pay for the course ant the course that they pay for it
        var studentCourses = await _unitOfWork.Repository<StudentCourse>()
            .GetTableNoTracking()
            .Include(sc => sc.Student)
            .Include(sc => sc.Course)
            .Where(sc => sc.IsDeleted == false)
            .Select(sc => new ShowStudentAndCourse
            {
                StudentId = sc.Student.Id,
                StudentName = sc.Student.NameEn ?? "no student title",
                CourseId = sc.Course.Id,
                CourseTitle = GeneralLocalizableEntity.Localized(sc.Course.TitleAr, sc.Course.TitleEn) ?? "no course title",

            })
            .ToListAsync();
        if (studentCourses == null || !studentCourses.Any())
        {
            await _logger.LogInfo(new LogInfoData()
            {
                LoghappenIn = EnLogHappenIn.Course,
                Message = $"no student with courses",
                Level = EnLevel.Warnning,
                LogsIn = "Courses",
            });
            return NotFound<List<ShowStudentAndCourse>>("No students and courses found");
        }
        return Success(studentCourses);
    }

    private IQueryable<Course> GetCourseQuerable()
    {
        var result = _unitOfWork.Repository<Course>().GetTableNoTracking().Where(c => c.IsDeleted == false);

        return result;
    }
    #endregion
}