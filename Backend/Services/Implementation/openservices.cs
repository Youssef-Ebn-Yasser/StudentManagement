using Newtonsoft.Json.Linq;
using System.Net.Http.Headers;

namespace Backend.Services.Implementation
{
    public class OpenAIService : IChatbotService
    {
        private readonly HttpClient _httpClient;
        private readonly string _apiKey;

        public OpenAIService(IHttpClientFactory httpFactory, IConfiguration config)
        {
            _httpClient = httpFactory.CreateClient();
            _apiKey = config["OpenAI:ApiKey"];
        }

        public async Task<string> AskAsync(string question)
        {
            var payload = new
            {
                model = "gpt-3.5-turbo",
                messages = new[] { new { role = "user", content = question } }
            };

            var request = new HttpRequestMessage(HttpMethod.Post, "https://api.openai.com/v1/chat/completions")
            {
                Content = new StringContent(JObject.FromObject(payload).ToString(), Encoding.UTF8, "application/json")
            };
            request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", _apiKey);

            var response = await _httpClient.SendAsync(request);

            if (!response.IsSuccessStatusCode)
                throw new Exception($"OpenAI API error: {response.StatusCode}");

            var responseBody = await response.Content.ReadAsStringAsync();
            var json = JObject.Parse(responseBody);
            var answer = json["choices"]?[0]?["message"]?["content"]?.ToString();

            // Ensure a non-null value is returned
            return answer ?? string.Empty;
        }
    }
}
