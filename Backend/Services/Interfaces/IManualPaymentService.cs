using Backend.DTOs.PaymentDTOs;

namespace Backend.Services.Interfaces
{
    public interface IManualPaymentService
    {
        Task<(bool Success, string Message)> SubmitManualPaymentAsync(ManualPaymentDto dto);
    }
}
