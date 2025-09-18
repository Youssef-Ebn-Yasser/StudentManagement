namespace Backend.DTOs.Paymob_DTOS;

public class PaymentRequestDto
{
    public int Amount { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
}