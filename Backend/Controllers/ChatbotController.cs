using Backend.DTOs;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using System.Net.Http.Headers;
namespace ElearningApi.Controllers
{
    [ApiController]
    [Route("api/chatbot")]
    public class ChatbotController : ControllerBase
    {
        private readonly HttpClient _http;
        private readonly string _apiKey;

        public ChatbotController(IHttpClientFactory httpFactory, IConfiguration cfg)
        {
            _http = httpFactory.CreateClient();
            _apiKey = cfg["OpenAI:ApiKey"];
        }

        [HttpPost("query")]
        public async Task<ActionResult<AnswerDto>> Query([FromBody] QuestionDto dto)
        {
            var payload = new
            {
                model = "gpt-3.5-turbo",
                messages = new[] { new { role = "user", content = dto.Question } }
            };

            var req = new HttpRequestMessage(HttpMethod.Post, "https://api.openai.com/v1/chat/completions")
            {
                Content = new StringContent(JObject.FromObject(payload).ToString(), Encoding.UTF8, "application/json")
            };
            req.Headers.Authorization = new AuthenticationHeaderValue("Bearer", _apiKey);

            var resp = await _http.SendAsync(req);
            if (!resp.IsSuccessStatusCode)
                return StatusCode((int)resp.StatusCode, "OpenAI error");

            var body = await resp.Content.ReadAsStringAsync();
            var j = JObject.Parse(body);
            var answer = j["choices"]?[0]?["message"]?["content"]?.ToString();

            if (string.IsNullOrEmpty(answer))
                return StatusCode(StatusCodes.Status500InternalServerError, "No valid response from OpenAI");

            return Ok(new AnswerDto { Answer = answer });
        }
    }
}

