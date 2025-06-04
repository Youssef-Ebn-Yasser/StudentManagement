using Backend.DTOs.PaymentDTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ManualPaymentsController : ControllerBase
    {
        private readonly IManualPaymentService _manualPaymentService;

        public ManualPaymentsController(IManualPaymentService manualPaymentService)
        {
            _manualPaymentService = manualPaymentService;
        }

        [HttpPost]
        [Authorize] // Only logged-in users can submit
        public async Task<IActionResult> SubmitManualPayment([FromForm] ManualPaymentDto dto)
        {
            var result = await _manualPaymentService.SubmitManualPaymentAsync(dto);
            if (!result.Success)
                return BadRequest(result.Message);

            return Ok(result.Message);
        }
    }
}
