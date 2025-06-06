using Backend.Wrapper;
using static Backend.Services.Interfaces.ITeacherService;

namespace Backend.Services.Implementation;

public class TeacherService : ResponseHandler, ITeacherService
{
    #region   Fields
    public IUnitOfWork _unitOfWork { get; }
    private readonly IPhysicalFileUpload _physicalFileUpload;
    public IMapper _mapper { get; }
    public IAuthenticationService _authenticationService { get; }
    #endregion

    #region   Constructor
    public TeacherService(IUnitOfWork unitOfWork,
                          IPhysicalFileUpload physicalFileUpload,
                          IMapper mapper,
                          IAuthenticationService authenticationService)
    {
        _unitOfWork = unitOfWork;
        _physicalFileUpload = physicalFileUpload;
        _mapper = mapper;
        _authenticationService = authenticationService;
    }
    #endregion

    #region   Handle Methods


    public async Task<PaginateResult<ShowAllTeacherDto>> GetAllPaginatedAsync(int pageNumber, int pageSize, enTeacherOrderBy? orderBy = null)
    {
        var query = _unitOfWork.Repository<Teacher>()
                               .GetTableNoTracking()
                               .Where(t => !t.IsDeleted);

        if (orderBy == enTeacherOrderBy.Name)
            query = query.OrderBy(t => t.Name);
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
            return NotFound<TeacherProfileDto>($"this teacher with this {id} not exist");

        var teacherProfile = _mapper.Map<TeacherProfileDto>(teacher);

        return Success(teacherProfile);
    }

    public async Task<Response<GetTeacherDto>> GetByNameAsync(string name)
    {
        var teacher = await _unitOfWork.Repository<Teacher>()
                                              .GetTableNoTracking()
                                              .FirstOrDefaultAsync(t => t.Name == name && t.IsDeleted == false);

        if (teacher == null)
            return NotFound<GetTeacherDto>($"this teacher {name} not exist");

        var newTeacher = _mapper.Map<GetTeacherDto>(teacher);

        return Success(newTeacher);
    }

    public async Task<Response<List<ShowAllTeacherDto>>> GetAllAsync()
    {
        var teachers = await _unitOfWork.Repository<Teacher>()
                                                    .GetTableNoTracking()
                                                    .Where(t => !t.IsDeleted)
                                                    .ToListAsync();
        if (teachers == null)
            return NotFound<List<ShowAllTeacherDto>>($"there is no teacher");

        var newTeachers = _mapper.Map<List<ShowAllTeacherDto>>(teachers);
        return Success(newTeachers);
    }

    public async Task<Response<string>> CreateAsync(CreateTeacherDto createTeacherDto)
    {
        // check if exist by name
        var exist = await _isTeacherExistByNameAsync(createTeacherDto.Name);
        if (exist) return BadRequest<string>($"this teacher is already exist");

        var teacher = _mapper.Map<Teacher>(createTeacherDto);

        if (createTeacherDto.Image is not null)
        {
            var ImageUrl = await _physicalFileUpload.UploadFileAsync("Teachers", createTeacherDto.Image);
            teacher.ProfileImagePath = ImageUrl;
        }

        await _unitOfWork.Repository<Teacher>().AddAsync(teacher);
        var result = _unitOfWork.Complete();

        return result > 0 ? Success<string>("Created Teacher Successfully") :
                            BadRequest<string>($"can not add this teacher");
    }

    public async Task<Response<string>> UpdateAsync(UpdateTeacherDto updateTeacherDto)
    {
        var exist = await _isTeacherExistByIdAsync(updateTeacherDto.Id);
        if (!exist) return BadRequest<string>($"this teacher is not exist");

        var nameExist = await _isTeacherNameExistBeforeAsync(updateTeacherDto.Name, updateTeacherDto.Id);
        if (nameExist) return BadRequest<string>($"this teacher name is not valid is already exist");


        var teacher = await _unitOfWork.Repository<Teacher>()
                                              .GetTableAsTracking()
                                              .FirstOrDefaultAsync(t => t.Id == updateTeacherDto.Id);

        var newTeacher = _mapper.Map(updateTeacherDto, teacher);

        if (updateTeacherDto.Image is not null)
        {
            var newImageUrl = await _physicalFileUpload.UploadFileAsync("Teachers", updateTeacherDto.Image);

            newTeacher!.ProfileImagePath = newImageUrl;
        }
        else
        {
            newTeacher.ProfileImagePath = string.Empty;
        }
        _unitOfWork.Repository<Teacher>().Update(newTeacher!);

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
                                              .FirstOrDefaultAsync(t => t.Id == id);

        teacher!.IsDeleted = true;
        var result = _unitOfWork.Complete();

        return result > 0 ? Delete<string>() :
                            BadRequest<string>($"can not delete this teacher");
    }


    private async Task<bool> _isTeacherExistByNameAsync(string? name)
    {
        var isExist = await _unitOfWork.Repository<Teacher>()
                                .GetTableNoTracking()
                                .AnyAsync(t => t.Name == name && t.IsDeleted == false);
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
                                           .AnyAsync(t => t.Name == name && t.IsDeleted == false && t.Id != id);
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