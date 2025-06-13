namespace Backend.Services.Interfaces
{
    public interface IPaymobService
    {

        Task<string> GetAuthTokenAsync();
        Task<int> CreateOrderAsync(string authToken, int amountCents);
        Task<string> GetPaymentKeyAsync(string token, int amountCents, int orderId, string firstName, string lastName, string email, string phone);
        Task<string> StartPaymentAsync(int amountInCents, string firstName, string lastName, string email, string phone);
    }
}
