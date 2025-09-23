namespace Backend.Controllers;

[Route("api/[controller]")]
[ApiController]
public class EmailController : AppControllerBase
{
    #region      Fields
    private IEmailSender _emailSender;
    #endregion

    #region    Constructor
    public EmailController(IEmailSender emailSender)
    {
        _emailSender = emailSender;
    }
    #endregion

    #region    Handle Methods
    [HttpGet("test/mail")]
    public async Task<IActionResult> UploadFile(string mailTo, string subject, string HtmlMessage)
    {
        var result = await _emailSender.SendEmailAsync(mailTo, subject, HtmlMessage);
        return Ok(result);
    }
    #endregion
}