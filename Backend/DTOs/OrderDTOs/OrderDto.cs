namespace Backend.DTOs.OrderDTOs;

public class OrderDto
{
    public decimal FinalPrice { get; set; }
    public decimal TotalPrice { get; set; }
    public EnOrderStatus OrderStatus { get; set; }
    public DateTime OrderDate { get; set; }
    public decimal? DiscountAmount { get; set; }
    public int NumberOfTotalItems { get; set; }
    public string? CodeDiscount { get; set; }
    public bool IsCompleted { get; set; }
    public int ServiceOrderID { get; set; }

    public List<OrderItemDto> Items { get; set; } = new();
}