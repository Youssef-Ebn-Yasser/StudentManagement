namespace Backend.Controllers;

[Route("api/[controller]")]
[ApiController]
public class PaymobController : AppControllerBase
{
    #region Fields
    private readonly IOrderService _orderService;
    private readonly IPaymobService _paymobService;
    private readonly IStructuredLogger _logger;
    private readonly IStudentService _studentService;
    private readonly IEmailSender _emailSender;

    private readonly ApplicationDbContext _context;
    private const string HmacSecret = "egy_sk_test_6e674b01b710684cbba3a043f7e3b2c0f3c294f59485aafb902d4281c466c959";
    #endregion

    #region Constructor
    public PaymobController(IPaymobService paymobService,
                            IStructuredLogger logger,
                            ApplicationDbContext context,
                            IOrderService orderService,
                            IStudentService studentService,
                            IEmailSender emailSender)
    {
        _paymobService = paymobService;
        _logger = logger;
        _context = context;
        _orderService = orderService;
        _studentService = studentService;
        _emailSender = emailSender;
    }
    #endregion

    #region Method
    [HttpPost("start-payment")]
    public async Task<IActionResult> StartPayment([FromBody] BuyDto dto)
    {
        try
        {
            var result = await _orderService.BuyOrder(dto);
            return NewResult(result);
        }
        catch (Exception ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }
    [HttpPost("test")]

    public async Task<IActionResult> getAll()
    {
        try
        {
            var result = await _context.SystemLogs.ToListAsync();
            return Ok(result);
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

        //get order
        var order = await _context.Orders
                                            .Where(o => o.ServiceOrderID == payload.Obj.Order.Id)
                                            .Include(o => o.OrderItems)
                                            .FirstOrDefaultAsync();
        order.IsCompleted = true;


        var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == order.UserId);
        // log payment info
        var paymentDetails = new Payment()
        {
            Amount = payload.Obj.AmountCents,
            Currency = payload.Obj.Currency,
            PaymentMethod = "card",
            TransactionDate = DateTime.Now,
            PaymentProviderUsed = EnPaymentProviderUsed.paymob,
            UserId = order.UserId,
            OrderID = order.OrderTableId,
        };


        if (payload.Obj.Success)
        {
            order.OrderStatus = EnOrderStatus.success;
            paymentDetails.PaymentStatus = EnOrderStatus.success;
            paymentDetails.IsCorrect = true;


            // login user to course

            foreach (var course in order.OrderItems)
            {
                var dto = new StudentEnrollDto()
                {
                    CourseId = course.CourseId,
                    StudentId = order.UserId,
                };

                await _studentService.EnrollToCourse(dto);
            }
            string message = @"
<!DOCTYPE html>
<html lang='en'>
<head>
  <meta charset='UTF-8'>
  <title>Payment Successful</title>
</head>
<body style='font-family: Arial, sans-serif; background-color: #f9f9f9; margin: 0; padding: 0;'>
  <table align='center' border='0' cellpadding='0' cellspacing='0' width='600' 
         style='border-collapse: collapse; background-color: #ffffff; box-shadow: 0 2px 8px rgba(0,0,0,0.1);'>
    <tr>
      <td align='center' bgcolor='#4CAF50' style='padding: 20px 0; color: #ffffff; font-size: 24px; font-weight: bold;'>
        Payment Successful
      </td>
    </tr>
    <tr>
      <td style='padding: 30px;'>
        <p style='font-size: 18px; margin: 0 0 15px 0;'>Dear {{StudentName}},</p>
        <p style='font-size: 16px; line-height: 1.5; margin: 0 0 20px 0;'>
          Thank you for your payment! 🎉<br>
          Your transaction was successful, and you now have full access to your course.
        </p>
        <p style='font-size: 16px; margin: 0 0 20px 0;'>
          You can start learning right away by clicking the button below:
        </p>
        <table cellspacing='0' cellpadding='0'>
          <tr>
            <td align='center' bgcolor='#4CAF50' style='border-radius: 5px;'>
              <a href='{{RedirectLink}}' 
                 target='_blank' 
                 style='display: inline-block; padding: 12px 25px; font-size: 16px; 
                        color: #ffffff; text-decoration: none; border-radius: 5px; font-weight: bold;'>
                Access Course
              </a>
            </td>
          </tr>
        </table>
        <p style='font-size: 14px; color: #666666; margin-top: 30px;'>
          If you have any questions, feel free to contact our support team at 
          <a href='mailto:support@yourwebsite.com'>support@yourwebsite.com</a>.
        </p>
      </td>
    </tr>
    <tr>
      <td bgcolor='#f1f1f1' style='padding: 15px; text-align: center; font-size: 12px; color: #999999;'>
        &copy; 2025 Your Company Name. All rights reserved.
      </td>
    </tr>
  </table>
</body>
</html>";

            // send mail to user for success payment
            await _emailSender.SendEmailAsync(user.Email, "Congratulation", message);
        }
        else
        {
            order.OrderStatus = EnOrderStatus.faild;
            paymentDetails.PaymentStatus = EnOrderStatus.faild;
            paymentDetails.IsCorrect = false;

        }
        if (payload.Obj.Pending)
        {
            order.OrderStatus = EnOrderStatus.pending;
            paymentDetails.PaymentStatus = EnOrderStatus.pending;
            paymentDetails.IsCorrect = false;


        }

        _context.Payments.Add(paymentDetails);

        await _context.SaveChangesAsync();
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