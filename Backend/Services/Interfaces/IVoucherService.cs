namespace Backend.Services.Interfaces;

public interface IVoucherService
{
    public Task<Response<List<CreateVoucherDependenciesDto>>> GetCreateVoucherDependenciesDto(EnVoucherCourseType voucherCourseType);
    public Task<Response<string>> CreateVoucher(CreateVaoucherDto dto);
}