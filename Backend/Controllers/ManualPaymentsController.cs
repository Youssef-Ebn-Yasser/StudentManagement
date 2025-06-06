using Backend.Context;
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
        private readonly ApplicationDbContext _db;

        public ManualPaymentsController(IManualPaymentService manualPaymentService, ApplicationDbContext db)
        {
            _manualPaymentService = manualPaymentService;
            _db = db;
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

        [HttpGet("manual-payments/number")]
        public async Task<IActionResult> GetVodafoneNumber()
        {
            var number = await _db.PaymentSettings.Select(x => x.VodafoneCashNumber).FirstOrDefaultAsync();
            return Ok(new { number });
        }

        [HttpPut("manual-payments/number")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> SetVodafoneNumber([FromBody] string number)
        {
            var settings = await _db.PaymentSettings.FirstOrDefaultAsync();
            if (settings == null)
            {
                settings = new PaymentSettings { VodafoneCashNumber = number };
                _db.PaymentSettings.Add(settings);
            }
            else
            {
                settings.VodafoneCashNumber = number;
                _db.PaymentSettings.Update(settings);
            }
            await _db.SaveChangesAsync();
            return Ok();
        }


    }
}
