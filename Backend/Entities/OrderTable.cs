namespace Backend.Entities;

public class OrderTable
{
    public int OrderTableId { get; set; }
    public DateTime OrderDate { get; set; }
    public int NumberOfTotalItems { get; set; }

    [Column(TypeName = "decimal(10, 2)")]
    public decimal TotalPrice { get; set; }

    [Column(TypeName = "decimal(10, 2)")]
    public decimal? DiscountAmount { get; set; }

    [Column(TypeName = "decimal(10, 2)")]
    public decimal FinalPrice { get; set; }
    public string? CodeDiscount { get; set; }
    public int? VoucherId { get; set; }
    public string UserName { get; set; } = string.Empty;
    public int UserId { get; set; }
    public EnOrderStatus OrderStatus { get; set; }
    public bool IsCompleted { get; set; } = false;

    public int ServiceOrderID { get; set; }

    public List<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
}