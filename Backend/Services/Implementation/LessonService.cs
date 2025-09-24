namespace Backend.Services.Implementation;

public class LessonService : ResponseHandler, ILessonService
{
    #region Fields
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly IStructuredLogger _logger;
    #endregion

    #region Constructor
    public LessonService(IUnitOfWork unitOfWork, IMapper mapper, IStructuredLogger logger)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _logger = logger;
    }
    #endregion

    #region Method
    public async Task<Response<List<ShowLessonDetailsPage>>> GetAll()
    {
        var lesson = await _unitOfWork.Repository<Lesson>()
                                                 .GetTableNoTracking()
                                                 .Where(s => s.IsDeleted == false)
                                                 .Include(l => l.materials)
                                                 .ToListAsync();
        if (lesson == null)
        {
            await _logger.LogInfo(new LogInfoData
            {
                Level = EnLevel.Error,
                Message = "No data in this lesson",
                LoghappenIn = EnLogHappenIn.Lession,
                LogsIn = "lession",
                TypeLog = EnLogType.Normal,
            });
            return NotFound<List<ShowLessonDetailsPage>>("Lessons Not Found");
        }

        var mappedLesson = _mapper.Map<List<ShowLessonDetailsPage>>(lesson);
        return Success(mappedLesson);
    }

    public async Task<Response<ShowLessonDetailsPage>> GetLessonAsync(int lessonId, int courseId)
    {
        var lesson = await _unitOfWork.Repository<Lesson>()
                                            .GetTableNoTracking()
                                            .Where(s => s.IsDeleted == false)
                                            .Include(l => l.materials)
                                            .FirstOrDefaultAsync(l => l.Id == lessonId && l.CourseId == courseId);

        if (lesson == null)
        {
            await _logger.LogInfo(new LogInfoData
            {
                Level = EnLevel.Error,
                Message = "No  lesson found when try get lession in course",
                LoghappenIn = EnLogHappenIn.Lession,
                LogsIn = "lession",
                TypeLog = EnLogType.Normal,
            });

            return NotFound<ShowLessonDetailsPage>("Lesson Not Found");
        }

        var mappedLesson = _mapper.Map<ShowLessonDetailsPage>(lesson);
        return Success(mappedLesson);
    }

    public async Task<Response<string>> CreateAsync(CreateLessonDto createLessonDto)
    {
        var isNameExist = await _isLessionNameExist(createLessonDto.Title);
        if (isNameExist)
        {
            await _logger.LogInfo(new LogInfoData
            {
                Level = EnLevel.Error,
                Message = $"new name {createLessonDto.Title} is already exist",
                LoghappenIn = EnLogHappenIn.Lession,
                LogsIn = "lesson",
                TypeLog = EnLogType.Normal,
            });

            return BadRequest<string>($"new name {createLessonDto.Title} is already exist");
        }

        var lesson = _mapper.Map<Lesson>(createLessonDto);

        await _unitOfWork.Repository<Lesson>().AddAsync(lesson);
        var successOperation = _unitOfWork.Complete();

        if (successOperation > 0)
        {
            await _logger.LogInfo(new LogInfoData
            {
                Level = EnLevel.Information,
                Message = $"Lesson Created Successfully with name {createLessonDto.Title}",
                LoghappenIn = EnLogHappenIn.Lession,
                LogsIn = "",
                TypeLog = EnLogType.Normal,
            });

            return Success("Lesson Created Successfully");
        }
        else
        {
            await _logger.LogInfo(new LogInfoData
            {
                Level = EnLevel.Error,
                Message = "can not create this Lesson",
                LoghappenIn = EnLogHappenIn.Lession,
                LogsIn = "lession",
                TypeLog = EnLogType.Normal,
            });

            return BadRequest<string>("can not create Lesson try later");
        }
    }
    public async Task<Response<string>> UpdateAsync(UpdateLessonDto updateLessonDto)
    {
        var isNewNameExist = await _isLessionNameExistExcludeitself(updateLessonDto.Title, updateLessonDto.Id);
        if (isNewNameExist)
        {
            await _logger.LogInfo(new LogInfoData
            {
                Level = EnLevel.Error,
                Message = $"new lession name {updateLessonDto.Title} is already exist",
                LoghappenIn = EnLogHappenIn.Lession,
                LogsIn = "lesson",
                TypeLog = EnLogType.Normal,
            });

            return BadRequest<string>($"new name {updateLessonDto.Title} is already exist");
        }


        var existingLesson = await _unitOfWork.Repository<Lesson>()
                                               .GetByIdAsync(updateLessonDto.Id);

        if (existingLesson == null)
        {
            await _logger.LogInfo(new LogInfoData
            {
                Level = EnLevel.Error,
                Message = $"Lesson Not found to Update with this id {updateLessonDto.Id}",
                LoghappenIn = EnLogHappenIn.Lession,
                LogsIn = "lesson",
                TypeLog = EnLogType.Normal,
            });

            return NotFound<string>("Lesson Not Found");
        }

        _mapper.Map(updateLessonDto, existingLesson);
        _unitOfWork.Repository<Lesson>().Update(existingLesson);
        var successOperation = _unitOfWork.Complete();
        if (successOperation > 0)
        {
            await _logger.LogInfo(new LogInfoData
            {
                Level = EnLevel.Information,
                Message = $"Lesson Updated Successfully with this id {updateLessonDto.Id}",
                LoghappenIn = EnLogHappenIn.Lession,
                LogsIn = "lesson",
                TypeLog = EnLogType.Normal,
            });

            return Success("Lesson Updated Successfully");
        }
        else
        {
            await _logger.LogInfo(new LogInfoData
            {
                Level = EnLevel.Error,
                Message = $"can not update Lesson with this id {updateLessonDto.Id}",
                LoghappenIn = EnLogHappenIn.Lession,
                LogsIn = "lesson",
                TypeLog = EnLogType.Normal,
            });

            return BadRequest<string>("can not update Lesson");
        }
    }
    public async Task<Response<string>> DeleteAsync(int lessonId)
    {
        var lesson = await _unitOfWork.Repository<Lesson>().GetByIdAsync(lessonId);
        if (lesson == null)
            return NotFound<string>("Lesson Not Found");

        lesson.IsDeleted = true;
        var successOperation = _unitOfWork.Complete();
        if (successOperation > 0)
        {
            await _logger.LogInfo(new LogInfoData
            {
                Level = EnLevel.Error,
                Message = $"Lesson Deleted Success with this id {lessonId}",
                LoghappenIn = EnLogHappenIn.Lession,
                LogsIn = "lesson",
                TypeLog = EnLogType.Normal,
            });

            return Success("Lesson Deleted Successfully");
        }
        else
        {
            await _logger.LogInfo(new LogInfoData
            {
                Level = EnLevel.Error,
                Message = $"can not Delete Lesson with this id {lessonId}",
                LoghappenIn = EnLogHappenIn.Lession,
                LogsIn = "lesson",
                TypeLog = EnLogType.Normal,
            });

            return BadRequest<string>("can not Delete Lesson");
        }
    }

    private async Task<bool> _isLessionNameExist(string title)
    {
        var isNameExist = await _unitOfWork.Repository<Lesson>()
                                            .GetTableNoTracking()
                                            .Where(l => l.IsDeleted == false)
                                            .AnyAsync(l => l.TitleEn == title || l.TitleAr == title);
        return isNameExist;
    }
    private async Task<bool> _isLessionNameExistExcludeitself(string title, int lessionId)
    {
        var isNameExist = await _unitOfWork.Repository<Lesson>()
                                            .GetTableNoTracking()
                                            .Where(l => l.Id != lessionId && l.IsDeleted == false)
                                            .AnyAsync(l => l.TitleEn == title || l.TitleAr == title);
        return isNameExist;
    }
    #endregion
}