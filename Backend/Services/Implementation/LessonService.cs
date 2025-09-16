using Backend.DTOs.LessonDTOs;

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
            _logger.LogInfo("No data in this lesson");
            return NotFound<List<ShowLessonDetailsPage>>("Lesson Not Found");
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
            _logger.LogInfo("No lesson lesson found in GetLessonAsync");
            return NotFound<ShowLessonDetailsPage>("Lesson Not Found");
        }

        var mappedLesson = _mapper.Map<ShowLessonDetailsPage>(lesson);
        return Success(mappedLesson);
    }

    public async Task<Response<string>> CreateAsync(CreateLessonDto createLessonDto)
    {
        var lesson = _mapper.Map<Lesson>(createLessonDto);

        await _unitOfWork.Repository<Lesson>().AddAsync(lesson);
        var successOperation = _unitOfWork.Complete();

        if (successOperation > 0)
        {
            _logger.LogInfo("Lesson Created Successfully");
            return Success("Lesson Created Successfully");
        }
        else
        {
            _logger.LogInfo("can not create Lesson");
            return BadRequest<string>("can not create Lesson try later");
        }
    }
    public async Task<Response<string>> UpdateAsync(UpdateLessonDto updateLessonDto)
    {
        var existingLesson = await _unitOfWork.Repository<Lesson>()
                                               .GetByIdAsync(updateLessonDto.Id);
                                              
        if (existingLesson == null)
        {
            _logger.LogInfo("Lesson Not found to Update");
            return NotFound<string>("Lesson Not Found");
        }

        _mapper.Map(updateLessonDto, existingLesson);
        _unitOfWork.Repository<Lesson>().Update(existingLesson);
        var successOperation = _unitOfWork.Complete();
        if (successOperation > 0)
        {
            _logger.LogInfo("Lesson Updated Successfully");
            return Success("Lesson Updated Successfully");
        }
        else
        {
            _logger.LogInfo("can not update Lesson");
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
            _logger.LogInfo("Lesson Deleted Success");
            return Success("Lesson Deleted Successfully");
        }
        else
        {
            _logger.LogInfo("can not Delete Lesson");
            return BadRequest<string>("can not Delete Lesson");
        }
    }
}
#endregion