using Backend.Settings;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using Stripe;
using Stripe.Checkout;

namespace Backend.Controllers;

[Route("api/[controller]")]
[ApiController]
public class PaymentsController : ControllerBase
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly StripeSettings _stripeSettings;
    private readonly IConfiguration _config;

    public PaymentsController(IUnitOfWork unitOfWork, IOptions<StripeSettings> stripeSettings, IConfiguration config)
    {
        _unitOfWork = unitOfWork;
        _stripeSettings = stripeSettings?.Value ?? throw new ArgumentNullException(nameof(stripeSettings));

        // Set the API key
        if (string.IsNullOrEmpty(_stripeSettings.SecretKey))
            throw new InvalidOperationException("Stripe SecretKey is not configured");

        StripeConfiguration.ApiKey = _stripeSettings.SecretKey;
        _config = config;
    }

    [HttpPost("create-payment-intent")]
    public async Task<ActionResult> CreatePaymentIntent([FromBody] PaymentIntentCreateRequest request)
    {
        try
        {
            var options = new SessionCreateOptions
            {
                SuccessUrl = $"http://localhost:5175/courses/course/{request.CourseId}?payment=success",
                CancelUrl = "http://127.0.0.1:5500/faild.html",
                LineItems = new List<SessionLineItemOptions>
                {
                    new SessionLineItemOptions
                    {
                        PriceData = new SessionLineItemPriceDataOptions
                        {
                            UnitAmount = (long)(request.Amount * 100), // Convert to cents
                            Currency = request.Currency.ToLower(),
                            ProductData = new SessionLineItemPriceDataProductDataOptions
                            {
                                Name = "Pay Course",
                            },
                        },
                        Quantity = 1,
                    },
                },
                Mode = "payment",
                Metadata = new Dictionary<string, string>
                {
                    { "amount", request.Amount.ToString() },
                    { "paymentDate", request.PaymentDate.ToString("o") },
                    { "currency", request.Currency },
                    { "studentId", request.StudentId?.ToString() ?? "" },
                    { "courseId", request.CourseId?.ToString() ?? "" }
                }
            };

            var service = new SessionService();
            var session = await service.CreateAsync(options);

            return Ok(new { url = session.Url });
        }
        catch (StripeException ex)
        {
            return StatusCode(500, new { error = ex.Message });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = "An unexpected error occurred" });
        }
    }

    [HttpPost("webhook")]
    public async Task<IActionResult> StripeWebhook()
    {
        if (string.IsNullOrEmpty(_stripeSettings.WebhookSecret))
        {
            return StatusCode(500, new { error = "Stripe webhook secret is not configured" });
        }

        var json = await new StreamReader(HttpContext.Request.Body).ReadToEndAsync();
        var stripeSignature = Request.Headers["Stripe-Signature"];

        if (string.IsNullOrEmpty(stripeSignature))
        {
            return BadRequest(new { error = "Missing Stripe-Signature header" });
        }

        try
        {
            var stripeEvent = EventUtility.ConstructEvent(
                json,
                stripeSignature,
                _stripeSettings.WebhookSecret
            );

            if (stripeEvent.Type == EventTypes.CheckoutSessionCompleted)
            {
                var session = stripeEvent.Data.Object as Session;

                if (session == null)
                {
                    return BadRequest(new { error = "Invalid session data" });
                }

                // Extract metadata from the session
                if (!session.Metadata.ContainsKey("amount") ||
                    !session.Metadata.ContainsKey("paymentDate") ||
                    !session.Metadata.ContainsKey("currency") ||
                    !session.Metadata.ContainsKey("studentId") ||
                    !session.Metadata.ContainsKey("courseId"))
                {
                    return BadRequest(new { error = "Missing required metadata in session" });
                }

                var amount = double.Parse(session.Metadata["amount"]);
                var paymentDate = DateTime.Parse(session.Metadata["paymentDate"]);
                var currency = session.Metadata["currency"];
                var studentId = int.Parse(session.Metadata["studentId"]);
                var courseId = int.Parse(session.Metadata["courseId"]);

                // Create payment record
                var payment = new Payment
                {
                    Amount = amount,
                    Status = "Completed",
                    PaymentDate = paymentDate,
                    CompleteDate = DateTime.UtcNow,
                    Currency = currency,
                    StudentId = studentId,
                    CourseId = courseId
                };

                // Save payment to database
                await _unitOfWork.Repository<Payment>().AddAsync(payment);
                var result = _unitOfWork.Complete();

                if (result > 0)
                {
                    return Ok(new { message = "Payment processed successfully" });
                }
                else
                {
                    return StatusCode(500, new { error = "Failed to save payment to database" });
                }
            }

            return Ok(new { message = "Webhook received" });
        }
        catch (StripeException ex)
        {
            return BadRequest(new { error = $"Stripe webhook error: {ex.Message}" });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = $"An unexpected error occurred: {ex.Message}" });
        }
    }
}

public class PaymentIntentCreateRequest
{
    [Required] public double Amount { get; set; }
    [Required] public DateTime PaymentDate { get; set; }
    [Required] public string Currency { get; set; } = string.Empty;
    [Required] public int? StudentId { get; set; }
    [Required] public int? CourseId { get; set; }
}