using Backend.Wrapper;
using static Backend.Services.Interfaces.ITeacherService;

namespace Backend.Services.Implementation;

public class TeacherService : ResponseHandler, ITeacherService
{
    #region   Fields
    private IUnitOfWork _unitOfWork { get; }
    private readonly IPhysicalFileUpload _physicalFileUpload;
    private IAuthenticationService _authenticationService { get; }
    private IMapper _mapper { get; }
    private readonly IStructuredLogger _logger;
    #endregion

    #region   Constructor
    public TeacherService(IUnitOfWork unitOfWork,
                          IPhysicalFileUpload physicalFileUpload,
                          IMapper mapper,
                          IAuthenticationService authenticationService,
                          IStructuredLogger logger)
    {
        _unitOfWork = unitOfWork;
        _physicalFileUpload = physicalFileUpload;
        _mapper = mapper;
        _authenticationService = authenticationService;
        _logger = logger;
    }
    #endregion

    #region   Handle Methods
    public async Task<PaginateResult<ShowAllTeacherDto>> GetAllPaginatedAsync(int pageNumber, int pageSize, enTeacherOrderBy? orderBy = null)
    {
        var query = _unitOfWork.Repository<Teacher>()
                                               .GetTableNoTracking()
                                               .Where(t => !t.IsDeleted);

        _logger.LogInfo($"Send to GetAllPaginatedAsync with order by number => {orderBy}");

        if (orderBy == enTeacherOrderBy.Name)
            query = query.OrderBy(t => GeneralLocalizableEntity.Localized(t.NameAr, t.NameEn));
        else if (orderBy == enTeacherOrderBy.CreatedAt)
            query = query.OrderBy(t => t.CreatedAt);
        else
            query = query.OrderBy(t => t.Id);

        return await _mapper.ProjectTo<ShowAllTeacherDto>(query)
                            .ToPaginatedListAsync(pageNumber, pageSize);
    }
    public async Task<PaginateResult<ShowAllTeacherWithDetailsDto>> GetAllDeletedPaginatedAsync(int pageNumber, int pageSize)
    {
        var query = _unitOfWork.Repository<Teacher>()
                                               .GetTableNoTracking()
                                               .Where(t => t.IsDeleted);

        return await _mapper.ProjectTo<ShowAllTeacherWithDetailsDto>(query)
                            .ToPaginatedListAsync(pageNumber, pageSize);
    }
    public async Task<Response<TeacherProfileDto>> GetByIdAsync(int id)
    {
        var teacher = await _unitOfWork.Repository<Teacher>()
                                              .GetTableNoTracking()
                                              .Include(t => t.Courses)
                                              .FirstOrDefaultAsync(t => t.Id == id && t.IsDeleted == false);

        if (teacher == null)
        {
            _logger.LogInfo("try found teacher 'GetByIdAsync' but not found");
            return NotFound<TeacherProfileDto>($"this teacher with this {id} not exist");
        }
        var teacherProfile = _mapper.Map<TeacherProfileDto>(teacher);
        _logger.LogInfo("Map Success and return teacher profile");
        return Success(teacherProfile);
    }
    public async Task<Response<GetTeacherDto>> GetByNameAsync(string name)
    {
        var teacher = await _unitOfWork.Repository<Teacher>()
                                              .GetTableNoTracking()
                                              .FirstOrDefaultAsync(t => GeneralLocalizableEntity.Localized(t.NameAr, t.NameEn) == name && t.IsDeleted == false);

        if (teacher == null)
        {
            _logger.LogInfo("Search for a teacher with his name but not found");
            return NotFound<GetTeacherDto>($"this teacher {name} not exist");
        }
        var newTeacher = _mapper.Map<GetTeacherDto>(teacher);

        return Success(newTeacher);
    }
    public async Task<Response<List<ShowAllTeacherDto>>> GetAllAsync()
    {
        var teachers = await _unitOfWork.Repository<Teacher>()
                                                    .GetTableNoTracking()
                                                    .Include(t => t.Courses)
                                                    .Where(t => !t.IsDeleted)
                                                    .ToListAsync();
        if (teachers == null)
        {
            _logger.LogInfo("try get all teachers but no data found");
            return NotFound<List<ShowAllTeacherDto>>($"there is no teacher");
        }

        var newTeachers = _mapper.Map<List<ShowAllTeacherDto>>(teachers);
        _logger.LogInfo("Map Success and return");
        return Success(newTeachers);
    }
    public async Task<Response<string>> UpdateAsync(UpdateTeacherDto updateTeacherDto)
    {
        var exist = await _isTeacherExistByIdAsync(updateTeacherDto.Id);
        if (!exist)
        {
            _logger.LogInfo("try Update Teacher not exist");
            return BadRequest<string>($"this teacher is not exist");
        }

        var teacher = await _unitOfWork.Repository<Teacher>()
                                              .GetTableAsTracking()
                                              .FirstOrDefaultAsync(t => t.Id == updateTeacherDto.Id);

        _mapper.Map(updateTeacherDto, teacher);

        if (updateTeacherDto.Image is not null)
        {
            var newImageUrl = await _physicalFileUpload.UploadFileAsync("Teachers", updateTeacherDto.Image);
            if (string.IsNullOrEmpty(newImageUrl)) _logger.LogInfo("upload Image Success");
            else _logger.LogInfo("Faild iin Upload Image");

            teacher!.ProfileImagePath = newImageUrl;
        }
        else
        {
            _logger.LogInfo("no Image to upload ");
            teacher.ProfileImagePath = string.Empty;
        }

        var result = _unitOfWork.Complete();

        return result > 0 ? Success<string>("Teacher Updated Successfully") :
                            BadRequest<string>($"can not delete this teacher");
    }
    public async Task<Response<string>> DeleteAsync(int id)
    {
        var exist = await _isTeacherExistByIdAsync(id);
        if (!exist) return BadRequest<string>($"this teacher is not exist");

        var teacher = await _unitOfWork.Repository<Teacher>()
                                              .GetTableAsTracking()
                                              .Include(t => t.Courses)
                                              .ThenInclude(c => c.Select(c => c.lessons))
                                              .FirstOrDefaultAsync(t => t.Id == id);

        teacher!.IsDeleted = true;

        if (teacher != null && teacher.Courses != null)
        {
            _logger.LogInfo("Start delete All releated Courses with this teacher");
            teacher.Courses.ForEach(c => c.IsDeleted = true);

            foreach (var course in teacher.Courses)
            {
                if (course.lessons != null)
                    course.lessons.ForEach(c => c.IsDeleted = true);
            }
            _logger.LogInfo("Finish deleteing All releated Courses with this teacher");
        }

        var result = _unitOfWork.Complete();

        return result > 0 ? Delete<string>() :
                            BadRequest<string>($"can not delete this teacher");
    }


    private async Task<bool> _isTeacherExistByNameAsync(string? name)
    {
        var isExist = await _unitOfWork.Repository<Teacher>()
                                .GetTableNoTracking()
                                .AnyAsync(t => GeneralLocalizableEntity.Localized(t.NameAr, t.NameEn) == name && t.IsDeleted == false);
        return isExist;
    }
    private async Task<bool> _isTeacherExistByIdAsync(int id)
    {
        var isExist = await _unitOfWork.Repository<Teacher>()
                                .GetTableNoTracking()
                                .AnyAsync(t => t.Id == id && t.IsDeleted == false);
        return isExist;
    }
    private async Task<bool> _isTeacherNameExistBeforeAsync(string name, int id)
    {
        var isExist = await _unitOfWork.Repository<Teacher>()
                                           .GetTableNoTracking()
                                           .AnyAsync(t => GeneralLocalizableEntity.Localized(t.NameAr, t.NameEn) == name && t.IsDeleted == false && t.Id != id);
        return isExist;
    }
    private async Task<bool> _isTeacherEmailExistBeforeAsync(string email, int id)
    {
        var isExist = await _unitOfWork.Repository<Teacher>()
                                           .GetTableNoTracking()
                                           .AnyAsync(t => t.Email == email && t.IsDeleted == false && t.Id != id);
        return isExist;
    }
    #endregion
}