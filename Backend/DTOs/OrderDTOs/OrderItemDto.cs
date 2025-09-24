namespace Backend.DTOs.OrderDTOs;

public class OrderItemDto
{
    public string CourseName { get; set; } = string.Empty;
    public int CourseId { get; set; }
    public double CoursePrice { get; set; }
    public double? PriceAfterVoucher { get; set; }
    public double? DiscountAmount { get; set; }
    public bool IsApplayedVoucher { get; set; }
}