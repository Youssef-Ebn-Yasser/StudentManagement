using Backend.Controllers;

namespace Backend.Services.Interfaces;

public interface IVoucherService
{
    public Task<Response<List<CreateVoucherDependenciesDto>>> GetCreateVoucherDependenciesDto(EnVoucherCourseType voucherCourseType);
    public Task<Response<string>> CreateVoucher(CreateVaoucherDto dto);
    public Task<Response<CartAfterDiscountDto>> ApplayVoucher(applayCodeRequestDto dto);
    public Task<Response<List<GetAllValidVouchersDto>>> GetAllValiableVouchers();
}