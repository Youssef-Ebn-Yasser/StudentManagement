using Backend.Context;
using Backend.DTOs.PaymentDTOs;

namespace Backend.Services.Implementation
{
    public class ManualPaymentService: IManualPaymentService
    {
        #region Fields
        private readonly IWebHostEnvironment _env;
        private readonly ApplicationDbContext _db;
        private readonly IStructuredLogger _logger;
        #endregion

        #region Constructor
        public ManualPaymentService(IWebHostEnvironment env, ApplicationDbContext db, IStructuredLogger logger)
        {
            _env = env;
            _db = db;
            _logger = logger;
        }
        #endregion

        #region Method
        public async Task<(bool Success, string Message)> SubmitManualPaymentAsync(ManualPaymentDto dto)
        {
            // Validate file
            var file = dto.Screenshot;
            var allowedExt = new[] { ".jpg", ".jpeg", ".png" };
            var ext = Path.GetExtension(file.FileName).ToLowerInvariant();
            if (!allowedExt.Contains(ext) || file.Length > 5_000_000)
                return (false, "Invalid file type or size.");

            // Generate a safe random file name
            var fileName = $"{Guid.NewGuid()}{ext}";
            var savePath = Path.Combine(_env.WebRootPath, "uploads", fileName);

            // Ensure uploads directory exists
            Directory.CreateDirectory(Path.GetDirectoryName(savePath)!);

            // Save file
            using (var stream = new FileStream(savePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            // Save payment record
            var payment = new ManualPayment
            {
                UserId = dto.UserId,
                Email = dto.Email,
                TransactionId = dto.TransactionId,
                ScreenshotPath = $"/uploads/{fileName}",
                Status = PaymentStatus.Pending,
                SubmittedAt = DateTime.UtcNow
            };
            _db.ManualPayments.Add(payment);
            await _db.SaveChangesAsync();

            return (true, "Manual payment submitted successfully.");
        }
    }
    #endregion
}
