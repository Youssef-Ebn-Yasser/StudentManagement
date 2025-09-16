namespace Backend.Services.Implementation;

public class VoucherService : ResponseHandler, IVoucherService
{
    #region   Fields
    private readonly IUnitOfWork _unitOfWork;
    #endregion

    #region   Constructors
    public VoucherService(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }
    #endregion

    #region   Handle Methods
    public async Task<Response<List<CreateVoucherDependenciesDto>>> GetCreateVoucherDependenciesDto(EnVoucherCourseType voucherCourseType)
    {
        var result = new List<CreateVoucherDependenciesDto>();
        switch (voucherCourseType)
        {
            case EnVoucherCourseType.Live:
                result = await _unitOfWork.Repository<Course>()
                                      .GetTableNoTracking()
                                      .Where(c => c.CourseType == EnCourseType.liveSessions && !(bool)c.IsDeleted)
                                      .Select(c => new CreateVoucherDependenciesDto
                                      {
                                          Id = c.Id,
                                          Name = c.TitleEn,
                                      })
                                      .ToListAsync();
                break;
            case EnVoucherCourseType.Recorded:
                result = await _unitOfWork.Repository<Course>()
                                      .GetTableNoTracking()
                                      .Where(c => c.CourseType == EnCourseType.recorded && !(bool)c.IsDeleted)
                                      .Select(c => new CreateVoucherDependenciesDto
                                      {
                                          Id = c.Id,
                                          Name = c.TitleEn,
                                      })
                                      .ToListAsync();
                break;
            case EnVoucherCourseType.Both:
                result = await _unitOfWork.Repository<Course>()
                                      .GetTableNoTracking()
                                      .Where(c => !(bool)c.IsDeleted)
                                      .Select(c => new CreateVoucherDependenciesDto
                                      {
                                          Id = c.Id,
                                          Name = c.TitleEn,
                                      })
                                      .ToListAsync();
                break;

        }


        if (result.Count < 0)
        {
            return BadRequest<List<CreateVoucherDependenciesDto>>("No data founded");
        }

        return Success(result);
    }

    public async Task<Response<string>> CreateVoucher(CreateVaoucherDto dto)
    {
        var userExist = _unitOfWork.Repository<User>()
                                       .GetTableNoTracking()
                                       .Any(s => s.Id == dto.CreatedById && !(bool)s.IsDeleted);

        if (userExist)
            return BadRequest<string>("this created user id not exist");

        foreach (var courseId in dto.TargetCoursesIds)
        {
            var isExist = _unitOfWork.Repository<Course>()
                                                    .GetTableNoTracking()
                                                    .Any(c => c.Id == courseId && !(bool)c.IsDeleted);
            if (!isExist)
            {
                return BadRequest<string>("there is an course Id not exist");
            }
        }

        var voucher = new Voucher()
        {
            CreatedAt = DateTime.Now,
            ExpireDate = dto.ExpireDate,
            CreatedById = dto.CreatedById,
            DiscountType = dto.DiscountType,
            VoucherCourseType = dto.VoucherCourseType,
        };

        if (dto.DiscountType == EnDiscountType.Amount)
            voucher.DiscountAmount = dto.DiscountAmount;

        else if (dto.DiscountType == EnDiscountType.Percentage)
            voucher.DiscountPercentage = dto.DiscountPercentage;

        if (dto.VoucherFor == EnVoucherFor.General)
            voucher.TargetCourses = "all";

        else if (dto.VoucherFor == EnVoucherFor.Course)
            voucher.TargetCourses = dto.TargetCoursesIds.First().ToString();

        else if (dto.VoucherFor == EnVoucherFor.More)
            voucher.TargetCourses = JsonConvert.SerializeObject(dto.TargetCoursesIds);

        voucher.Code = CodeGenerator.GenerateUniqueCode(12);

        await _unitOfWork.Repository<Voucher>().AddAsync(voucher);
        var response = _unitOfWork.Complete();

        return response > 0 ? Success("Added Successfully") :
                              BadRequest<string>("can not add this voucher");
    }

    // Deserialize JSON back to list<int>
    // List<int> courses = JsonSerializer.Deserialize<List<int>>(voucher.TargetCourses);
    #endregion
}
