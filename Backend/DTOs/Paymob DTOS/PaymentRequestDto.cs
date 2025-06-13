namespace Backend.DTOs.Paymob_DTOS
{
    public class PaymentRequestDto
    {
        public int AmountInCents { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string PhoneNumber { get; set; } = string.Empty;
    }
}
