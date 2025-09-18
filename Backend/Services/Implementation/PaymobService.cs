namespace Backend.Services.Implementation;

public class PaymobService : IPaymobService
{
    #region Fields
    private readonly HttpClient _httpClient;
    private readonly string _apiKey;
    private readonly int _integrationId;
    private readonly int _iframeId;
    private readonly IStructuredLogger _logger;
    #endregion

    #region Constructor
    public PaymobService(HttpClient httpClient, IConfiguration config, IStructuredLogger logger)
    {
        _httpClient = httpClient;
        _apiKey = config["Paymob:ApiKey"] ?? throw new ArgumentNullException("Paymob:ApiKey");
        _integrationId = int.Parse(config["Paymob:IntegrationId"] ?? throw new ArgumentNullException("Paymob:IntegrationId"));
        _iframeId = int.Parse(config["Paymob:IframeId"] ?? throw new ArgumentNullException("Paymob:IframeId"));
        _logger = logger;
    }
    #endregion

    #region Method
    private async Task<string> GetAuthTokenAsync()
    {
        var request = new { api_key = _apiKey };
        var json = JsonConvert.SerializeObject(request);
        var content = new StringContent(json, Encoding.UTF8, "application/json");

        var response = await _httpClient.PostAsync("https://accept.paymob.com/api/auth/tokens", content);
        var responseBody = await response.Content.ReadAsStringAsync();

        if (!response.IsSuccessStatusCode)
            throw new Exception("Auth Token Error: " + responseBody);


        var result = JObject.Parse(responseBody);

        return result["token"]?.ToString() ?? throw new Exception("Auth token not received");
    }

    private async Task<int> CreateOrderAsync(string authToken, int amount)
    {
        var request = new
        {
            auth_token = authToken,
            delivery_needed = false,
            amount_cents = amount,
            currency = "EGP",
            items = new object[] { }
        };

        var json = JsonConvert.SerializeObject(request);
        var content = new StringContent(json, Encoding.UTF8, "application/json");

        var response = await _httpClient.PostAsync("https://accept.paymob.com/api/ecommerce/orders", content);
        var responseBody = await response.Content.ReadAsStringAsync();

        if (!response.IsSuccessStatusCode)
            throw new Exception("Create Order Failed: " + responseBody);

        var result = JObject.Parse(responseBody);
        return result["id"]?.Value<int>() ?? throw new Exception("Order ID not received");
    }

    private async Task<string> GetPaymentKeyAsync(string token, int amount, int orderId, string firstName, string lastName, string email, string phone)
    {
        var request = new
        {
            auth_token = token,
            amount_cents = amount,
            expiration = 3600,
            order_id = orderId,
            billing_data = new
            {
                apartment = "NA",
                email = email,
                floor = "NA",
                first_name = firstName,
                street = "NA",
                building = "NA",
                phone_number = phone,
                shipping_method = "NA",
                postal_code = "12345",
                city = "Cairo",
                country = "EG",
                last_name = lastName,
                state = "Cairo"
            },
            currency = "EGP",
            integration_id = _integrationId
        };

        var json = JsonConvert.SerializeObject(request);
        var content = new StringContent(json, Encoding.UTF8, "application/json");

        var response = await _httpClient.PostAsync("https://accept.paymob.com/api/acceptance/payment_keys", content);
        var responseBody = await response.Content.ReadAsStringAsync();

        if (!response.IsSuccessStatusCode)
            throw new Exception("Payment Key creation failed: " + responseBody);

        var result = JObject.Parse(responseBody);
        return result["token"]?.ToString() ?? throw new Exception("Payment key not received");
    }

    public async Task<(string, int)> StartPaymentAsync(int amount, string firstName, string lastName, string email, string phone)
    {
        var token = await GetAuthTokenAsync();
        var orderId = await CreateOrderAsync(token, amount);
        var paymentToken = await GetPaymentKeyAsync(token, amount, orderId, firstName, lastName, email, phone);
        return ($"https://accept.paymob.com/api/acceptance/iframes/{_iframeId}?payment_token={paymentToken}", orderId);
    }
}
#endregion
