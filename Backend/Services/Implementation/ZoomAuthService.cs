using System.Text.Json;

namespace Backend.Services.Implementation;

public class ZoomAuthService
{
    private readonly string clientId = "YOUR_CLIENT_ID";
    private readonly string clientSecret = "YOUR_CLIENT_SECRET";
    private readonly string accountId = "YOUR_ACCOUNT_ID";

    public async Task<string> GetAccessTokenAsync()
    {
        using var client = new HttpClient();

        var byteArray = Encoding.ASCII.GetBytes($"{clientId}:{clientSecret}");
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Basic", Convert.ToBase64String(byteArray));

        var data = new Dictionary<string, string>
        {
            {"grant_type", "account_credentials"},
            {"account_id", accountId}
        };

        var response = await client.PostAsync("https://zoom.us/oauth/token", new FormUrlEncodedContent(data));
        var content = await response.Content.ReadAsStringAsync();
        var token = JsonSerializer.Deserialize<JsonElement>(content).GetProperty("access_token").GetString();
        return token!;
    }
}
