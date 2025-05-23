using System.Text.Json;

namespace Backend.Services.Implementation;

public class GeminiService
{
    private readonly HttpClient _httpClient;
    private readonly IConfiguration _config;
    private readonly string _apiKey;
    private readonly string _endpoint = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

    public GeminiService(HttpClient httpClient, IConfiguration config)
    {
        _httpClient = httpClient;
        _config = config;
        _apiKey = _config["Gemini:ApiKey"]!;
    }

    public async Task<string> GetResponseAsync(string prompt)
    {
        var requestBody = new
        {
            contents = new[]
            {
            new {
                parts = new[]
                {
                    new { text = prompt }
                }
            }
        }
        };

        var json = JsonSerializer.Serialize(requestBody);
        var content = new StringContent(json, Encoding.UTF8, "application/json");

        var response = await _httpClient.PostAsync($"{_endpoint}?key={_apiKey}", content);
        var responseJson = await response.Content.ReadAsStringAsync();

        if (!response.IsSuccessStatusCode)
            return $"Error: {responseJson}";

        using var doc = JsonDocument.Parse(responseJson);
        var text = doc.RootElement
            .GetProperty("candidates")[0]
            .GetProperty("content")
            .GetProperty("parts")[0]
            .GetProperty("text")
            .GetString();

        return text ?? "No response.";
    }
}