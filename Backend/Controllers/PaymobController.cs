using Backend.DTOs.Paymob_DTOS;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PaymobController : ControllerBase
    {
        private readonly IPaymobService _paymobService;

        public PaymobController(IPaymobService paymobService)
        {
            _paymobService = paymobService;
        }

        [HttpPost("start-payment")]
        public async Task<IActionResult> StartPayment([FromBody] PaymentRequestDto request)
        {
            try
            {
                var paymentUrl = await _paymobService.StartPaymentAsync(
                    request.AmountInCents,
                    request.FirstName,
                    request.LastName,
                    request.Email,
                    request.PhoneNumber
                );

                return Ok(new { paymentUrl });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }
    }
}
