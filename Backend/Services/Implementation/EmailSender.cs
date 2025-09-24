using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;

namespace Backend.Services.Implementation;

public class EmailSender : IEmailSender
{
    #region Fields
    private readonly EmailSettings _emailSettings;
    private readonly IStructuredLogger _logger;
    #endregion

    #region Constructor
    public EmailSender(
        ILogger<EmailSender> logger,
        IOptions<EmailSettings> emailSettingsOptions,
        IStructuredLogger Logger)
    {
        _emailSettings = emailSettingsOptions.Value;
        _logger = Logger;
    }
    #endregion

    #region Method
    public async Task<bool> SendEmailAsync(string mailTo, string subject, string message)
    {
        try
        {
            var email = new MimeMessage()
            {
                Sender = MailboxAddress.Parse(_emailSettings.Email),
                Subject = subject
            };

            email.From.Add(new MailboxAddress(_emailSettings.DisplayName, _emailSettings.Email));
            email.To.Add(MailboxAddress.Parse(mailTo));

            var builder = new BodyBuilder();
            builder.HtmlBody = message;
            email.Body = builder.ToMessageBody();

            using var smtp = new SmtpClient();

            await _logger.LogInfo(new LogInfoData
            {
                Email = _emailSettings.Email,
                Level = EnLevel.Error,
                Message = $"email = {_emailSettings.Email} && pass = {_emailSettings.Password}",
            });

            await smtp.ConnectAsync("smtp.gmail.com", 587, SecureSocketOptions.StartTls);
            await smtp.AuthenticateAsync(_emailSettings.Email, "ucpf cylv nqfh awqc");


            var result = await smtp.SendAsync(email);

            await smtp.DisconnectAsync(true);

            return true;
        }
        catch (Exception ex)
        {
            await _logger.LogInfo(new LogInfoData
            {
                Email = _emailSettings.Email,
                Level = EnLevel.Error,
                Message = ex.Message,
            });
            return false;
        }
    }
    #endregion
}