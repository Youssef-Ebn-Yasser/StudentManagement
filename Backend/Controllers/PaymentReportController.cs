namespace Backend.Controllers;

[Route("api/[controller]")]
[ApiController]
public class PaymentReportController : AppControllerBase
{
    #region    Fields
    public IPaymentReportingService _reportServices { get; set; }
    #endregion

    #region    Constructor
    public PaymentReportController(IPaymentReportingService reportServices)
    {
        _reportServices = reportServices;
    }
    #endregion

    #region    Handle Methods
    [HttpGet("studentPerCourse")]
    public async Task<IActionResult> GetStudentPerCourse(int courseId)
    {
        try
        {
            var result = await _reportServices.GetStudentsPaymentPerCourse(courseId);

            return NewResult(result);
        }
        catch
        {
            return BadRequest("error happen in server");
        }
    }
    [HttpGet("paymentPerStudent")]
    public async Task<IActionResult> GetpaymentPerStudent(int studentId)
    {
        try
        {
            var result = await _reportServices.GetPaymentsPerStudents(studentId);

            return NewResult(result);
        }
        catch
        {
            return BadRequest("error happen in server");
        }
    }
    #endregion
}