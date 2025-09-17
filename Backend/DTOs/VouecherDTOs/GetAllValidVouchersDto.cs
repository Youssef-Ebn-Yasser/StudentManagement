namespace Backend.DTOs.VouecherDTOs;

public class GetAllValidVouchersDto
{
    public int Id { get; set; }
    public EnVoucherCourseType VoucherCourseType { get; set; }
    public string Code { get; set; } = string.Empty;
    public EnVoucherFor VoucherFor { get; set; }
    public string TargetCourses { get; set; } = string.Empty;
    public EnDiscountType DiscountType { get; set; }
    public decimal? DiscounValue { get; set; }
    public DateTime? ExpireDate { get; set; }
    public string? CreatedByAdminName { get; set; }
}