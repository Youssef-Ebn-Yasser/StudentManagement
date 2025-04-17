namespace Backend.Entities;
public class Payment
{
    [Key] public int Id { get; set; }
    public double Amount { get; set; }
    public string Status { get; set; } = string.Empty;
    public DateTime PaymentDate { get; set; } = DateTime.Now;
    public string TransactionId { get; set; } = string.Empty;
    public string Currency { get; set; } = string.Empty;
    public Student Student { get; set; }
    [ForeignKey(nameof(Student))]
    public int StudentId { get; set; }
}