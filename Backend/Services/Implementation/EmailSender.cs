using Backend.Settings;
using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Options;
using MimeKit;

namespace Backend.Services.Implementation;

public class EmailSender : IEmailSender
{
    private readonly ILogger<EmailSender> _logger;
    private readonly EmailSettings _emailSettings;

    public EmailSender(
        ILogger<EmailSender> logger,
        IOptions<EmailSettings> emailSettingsOptions)
    {
        _logger = logger;
        _emailSettings = emailSettingsOptions.Value;
    }

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
            await smtp.ConnectAsync(_emailSettings.Host, _emailSettings.Port, SecureSocketOptions.StartTls);

            await smtp.AuthenticateAsync(_emailSettings.Email, _emailSettings.Password);

            await smtp.SendAsync(email);

            await smtp.DisconnectAsync(true);

            _logger.LogInformation($"Email sent successfully to {mailTo}");
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Failed to send email to {mailTo}");
            return false;
        }
    }
}
