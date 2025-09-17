using Backend.Controllers;

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
        if (dto.DiscountPercentage != null || dto.DiscountPercentage > 100 || dto.DiscountPercentage < 0)
            return BadRequest<string>("this percentage must be equal or under 100 and more than 0");

        var userExist = _unitOfWork.Repository<User>()
                                       .GetTableNoTracking()
                                       .Any(s => s.Id == dto.CreatedById && !(bool)s.IsDeleted);

        if (!userExist)
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


    public async Task<Response<List<GetAllValidVouchersDto>>> GetAllValiableVouchers()
    {
        var vouchers = await _unitOfWork.Repository<Voucher>()
                                                 .GetTableNoTracking()
                                                 .Where(x => x.CreatedAt < DateTime.Now)
                                                 .Select(v => new GetAllValidVouchersDto
                                                 {
                                                     Code = v.Code,
                                                     DiscountType = v.DiscountType,
                                                     ExpireDate = v.ExpireDate,
                                                     Id = v.Id,
                                                     VoucherFor = v.VoucherFor,
                                                     VoucherCourseType = v.VoucherCourseType,
                                                     TargetCourses = v.TargetCourses,
                                                     CreatedByAdminName = _unitOfWork.Repository<User>()
                                                                                      .GetTableNoTracking()
                                                                                      .Where(u => u.Id == v.CreatedById)
                                                                                      .Select(u => u.NameEn)
                                                                                      .FirstOrDefault(),
                                                     DiscounValue = v.DiscountType == EnDiscountType.Amount
                                                     ? v.DiscountAmount : (decimal)v.DiscountPercentage!,
                                                 }).ToListAsync();

        return Success(vouchers);
    }


    public async Task<Response<CartAfterDiscountDto>> ApplayVoucher(applayCodeRequestDto dto)
    {
        // 1- validate this code Voucher
        var (errorVoucherMessage, voucher) = await ValidateVoucher(dto.code, dto.coursesIds);

        if (voucher == null)
            return BadRequest<CartAfterDiscountDto>(errorVoucherMessage);


        // if avaliable more than one id will take most big one
        var (errorCourseMessage, course) = await GetMostHighPriceCourse(dto.coursesIds);

        if (course == null)
            return BadRequest<CartAfterDiscountDto>(errorCourseMessage);


        var result = new CartAfterDiscountDto
        {
            courseAppliedId = course.Id,
            code = dto.code,
            DiscountType = voucher.DiscountType,
            DiscountValue = voucher.DiscountType == EnDiscountType.Amount ? (double)voucher.DiscountAmount! : voucher.DiscountPercentage,
        };

        return Success(result);
    }

    private async Task<(string?, Voucher?)> ValidateVoucher(string code, List<int>? coursesId)
    {
        var voucher = await _unitOfWork.Repository<Voucher>()
                                    .GetTableNoTracking()
                                    .FirstOrDefaultAsync(v => v.Code == code && !v.IsUsed);

        if (voucher == null)
        {
            return ("voucher not exist or already used", null);
        }

        if (voucher.ExpireDate < DateTime.Now)
        {
            return ("voucher is a expired", null);
        }


        if (voucher.TargetCourses == "all")
        {
            return (null, voucher);
        }

        var voucherAvaliableIds = JsonConvert.DeserializeObject<List<int>>(voucher.TargetCourses);
        var isAvaliableIds = voucherAvaliableIds?.Intersect(coursesId).Any();

        if (isAvaliableIds == null || isAvaliableIds == false)
        {
            return ("can not applay this vouchr on this course", null);
        }

        return (null, voucher);
    }

    private async Task<(string?, Course?)> GetMostHighPriceCourse(List<int> coursesId)
    {
        var maxPrice = await _unitOfWork.Repository<Course>()
                                              .GetTableNoTracking()
                                              .Where(c => coursesId.Contains(c.Id))
                                              .MaxAsync(c => c.Price);

        var course = await _unitOfWork.Repository<Course>()
                                            .GetTableNoTracking()
                                            .Where(c => coursesId.Contains(c.Id) && c.Price == maxPrice)
                                            .FirstOrDefaultAsync();

        if (course == null)
        {
            return ("this course not avaliable now", null);
        }

        return (null, course);
    }
    #endregion
}