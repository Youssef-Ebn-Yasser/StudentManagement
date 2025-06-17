namespace Backend.Entities
{
    public class ManualPayment
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string Email { get; set; } = string.Empty;
        public string TransactionId { get; set; } = string.Empty;
        public string ScreenshotPath { get; set; } = string.Empty;
        public PaymentStatus Status { get; set; } = PaymentStatus.Pending;
        public string? RejectionReasonEn { get; set; }
        public string? RejectionReasonAr { get; set; }

        public DateTime SubmittedAt { get; set; } = DateTime.UtcNow;
    }

    public enum PaymentStatus
    {
        Pending,
        Accepted,
        Rejected
    }
}
