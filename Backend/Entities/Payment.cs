namespace Backend.Entities;
public class Payment
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public int OrderID { get; set; }
    public bool IsCorrect { get; set; } = false;
    public EnOrderStatus PaymentStatus { get; set; }
    public double Amount { get; set; }
    public string Currency { get; set; } = string.Empty;
    public DateTime TransactionDate { get; set; }
    public string PaymentMethod { get; set; } = string.Empty;
    public EnPaymentProviderUsed PaymentProviderUsed { get; set; }

    [ForeignKey("UserId")]
    public User User { get; set; }

    [ForeignKey("OrderID")]
    public OrderTable Order { get; set; }
}