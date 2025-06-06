namespace Backend.DTOs.PaymentDTOs
{
    public class ManualPaymentDto
    {
        [Required]
        public int UserId { get; set; }
        [Required,EmailAddress]
        public string Email { get; set; } = string.Empty;
        [Required]
        public string TransactionId { get; set; } = string.Empty;
        [Required]
        public IFormFile Screenshot { get; set; }
    }
}
