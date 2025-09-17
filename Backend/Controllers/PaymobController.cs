
using Backend.DTOs.Paymob_DTOS;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PaymobController : ControllerBase
    {
        #region Fields
        private readonly IPaymobService _paymobService;
        private readonly IStructuredLogger _logger;
        private readonly ApplicationDbContext _context;
        private const string HmacSecret = "egy_sk_test_6e674b01b710684cbba3a043f7e3b2c0f3c294f59485aafb902d4281c466c959";
        #endregion

        #region Constructor
        public PaymobController(IPaymobService paymobService, IStructuredLogger logger, ApplicationDbContext context)
        {
            _paymobService = paymobService;
            _logger = logger;
            _context = context;
        }
        #endregion

        #region Method
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



        [HttpPost("weebHook")]
        public async Task<IActionResult> Webhook()
        {
            var rawPayloadString = await new StreamReader(Request.Body).ReadToEndAsync();

            var payload = JsonConvert.DeserializeObject<PaymobWebhookPayload>(rawPayloadString);

            if (payload.Obj.Success)
            {

            }
            else
            {

            }
            if (payload.Obj.Pending)
            {

            }

            return Ok();

        }

        [HttpGet("weebHook")]
        public IActionResult PaymentResponse([FromQuery] Dictionary<string, string> query)
        {
            if (query["success"] == "true")
            {

                return Redirect("http://127.0.0.1:5500/localtest.html");

            }
            else
            {
                return Redirect("http://127.0.0.1:5500/onlinetest.html");
            }
        }
        #endregion
    }
}