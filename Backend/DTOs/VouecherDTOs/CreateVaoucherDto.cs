namespace Backend.DTOs.VouecherDTOs;

public class CreateVaoucherDto
{
    public EnVoucherCourseType VoucherCourseType { get; set; }
    public EnVoucherFor VoucherFor { get; set; }
    public List<int> TargetCoursesIds { get; set; } = new List<int>();
    public EnDiscountType DiscountType { get; set; }
    public decimal? DiscountAmount { get; set; }
    public double? DiscountPercentage { get; set; }
    public DateTime? ExpireDate { get; set; }
    public int CreatedById { get; set; }
}