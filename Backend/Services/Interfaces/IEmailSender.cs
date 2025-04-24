namespace Backend.Services.Interfaces;

public interface IEmailSender
{
    Task<bool> SendEmailAsync(string mailTo, string subject, string message);
}