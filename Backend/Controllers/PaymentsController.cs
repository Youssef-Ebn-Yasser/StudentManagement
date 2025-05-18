using Newtonsoft.Json;
using Stripe;
using Stripe.Checkout;


namespace Backend.Controllers;

[Route("api/[controller]")]
[ApiController]
public class PaymentsController(IUnitOfWork _unitOfWork) : ControllerBase
{


    [HttpPost("create-payment-intent")]
    public async Task<ActionResult> CreatePaymentIntent([FromBody] PaymentIntentCreateRequest request)
    {

        StripeConfiguration.ApiKey = "sk_test_51RJpFnB0P8973q3AzgMnEJMwwftSTNwmgWtXKm9i6a1Gvc6yWW1dgzI6E05YkCJNaGEIcMTlPLaZ4FgKZozeKQzM00yzQxpeH1";

        var options = new Stripe.Checkout.SessionCreateOptions
        {
            SuccessUrl = "http://127.0.0.1:5500/index.html",
            CancelUrl = "http://127.0.0.1:5500/faild.html",

            LineItems = new List<SessionLineItemOptions>
            {
              new Stripe.Checkout.SessionLineItemOptions
              {
                  PriceData = new SessionLineItemPriceDataOptions
                  {
                      UnitAmount = (long?)request.Amount,
                      Currency = "usd",
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
                { "paymentDate", request.PaymentDate.ToString("o") }, // ISO 8601 format
                { "currency", request.Currency },
                { "studentId", request.StudentId?.ToString() ?? "" },
                { "courseId", request.CourseId?.ToString() ?? "" }
            }
        };
        var service = new Stripe.Checkout.SessionService();
        Stripe.Checkout.Session session = service.Create(options);

        return Ok(new { url = session.Url });

    }

    [HttpPost("webhook")]
    public async Task<IActionResult> StripeWebhook()
    {
        // Read the request body
        var json = await new StreamReader(HttpContext.Request.Body).ReadToEndAsync();
        if (string.IsNullOrEmpty(json))
        {
            return BadRequest("Empty request body.");
        }

        // Get the Stripe-Signature header
        var stripeSignature = Request.Headers["Stripe-Signature"];
        if (string.IsNullOrEmpty(stripeSignature))
        {
            return BadRequest("Missing Stripe-Signature header.");
        }

        try
        {
            // Your secret key from the Stripe Dashboard
            string webhookSecret = "whsec_SLg9RylDCXwrnh095nEjExd6N25j5tMt"; // Replace with your actual webhook secret
            // Construct the Stripe event
            var stripeEvent = EventUtility.ConstructEvent(
                json,
                stripeSignature,
                webhookSecret
            );

            if (stripeEvent.Type == EventTypes.CheckoutSessionCompleted)
            {
                var session = stripeEvent.Data.Object as Session;

                // Handle the successful payment
                string customerEmail = session.CustomerDetails.Email;
                string paymentIntentId = session.PaymentIntentId;

                // Process the payment and save to DB here...

                return Ok();
            }

            return Ok();
        }
        catch (StripeException e)
        {
            return BadRequest($"⚠️ Stripe webhook error: {e.Message}");
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