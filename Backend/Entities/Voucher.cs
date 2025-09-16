namespace Backend.Entities;

public class Voucher
{
    public int Id { get; set; }
    public EnVoucherCourseType VoucherCourseType { get; set; }
    public string Code { get; set; }
    public EnVoucherFor VoucherFor { get; set; }
    public string TargetCourses { get; set; }
    public EnDiscountType DiscountType { get; set; }
    public decimal? DiscountAmount { get; set; }
    public double? DiscountPercentage { get; set; }
    public DateTime? ExpireDate { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public bool IsUsed { get; set; } = false;
    public int? isUsedById { get; set; }
    public int CreatedById { get; set; }
    public DateTime? UsedAt { get; set; }

    [ForeignKey("CreatedById")]
    public User User { get; set; }

    [ForeignKey("isUsedById")]
    public Student? Student { get; set; }
}