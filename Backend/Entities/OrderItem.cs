namespace Backend.Entities;

public class OrderItem
{
    public int OrderItemId { get; set; }
    public int OrderId { get; set; }
    public string CourseName { get; set; } = string.Empty;
    public double CoursePrice { get; set; }
    public int CourseId { get; set; }
    public bool IsApplayedVoucher { get; set; }
    public double PriceAfterVoucher { get; set; }
    public double? DiscountAmount { get; set; }

    [ForeignKey("OrderId")]
    public OrderTable Order { get; set; }

    [ForeignKey("CourseId")]
    public Course Course { get; set; }
}