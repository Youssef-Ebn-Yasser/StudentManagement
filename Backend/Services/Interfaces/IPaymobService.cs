namespace Backend.Services.Interfaces;

public interface IPaymobService
{
    public Task<(string, int)> StartPaymentAsync(int amount, string firstName, string lastName, string email, string phone);
}