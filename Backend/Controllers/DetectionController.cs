using CheatDetectionAPI.Hubs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using System.Net.Http;
using System.Net.Http.Headers;

namespace CheatDetectionAPI.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class DetectionController : ControllerBase
    {
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly ILogger<DetectionController> _logger;
        private readonly IHubContext<CheatAlertHub> _hubContext;

        // ✅ Constructor موحد
        public DetectionController(
            IHttpClientFactory httpClientFactory,
            ILogger<DetectionController> logger,
            IHubContext<CheatAlertHub> hubContext)
        {
            _httpClientFactory = httpClientFactory;
            _logger = logger;
            _hubContext = hubContext;
        }

        [HttpPost("detect")]
        public async Task<IActionResult> DetectCheating(IFormFile image)
        {
            // [ Call FastAPI and parse response... ]
            var cheating = true; // from FastAPI
            var reason = "4 face(s) detected"; // from FastAPI

            if (cheating)
            {
                await _hubContext.Clients.All.SendAsync("ReceiveAlert", new
                {
                    message = "Cheating detected!",
                    reason = reason
                });
            }

            return Ok(new { cheating, reason });
        }

        [HttpPost("analyze")]
        public async Task<IActionResult> Analyze(IFormFile image)
        {
            if (image == null || image.Length == 0)
                return BadRequest("No image uploaded.");

            try
            {
                var client = _httpClientFactory.CreateClient("FastAPI");

                using var content = new MultipartFormDataContent();
                using var imageStream = image.OpenReadStream();
                var imageContent = new StreamContent(imageStream);
                imageContent.Headers.ContentType = MediaTypeHeaderValue.Parse("image/jpeg");
                content.Add(imageContent, "file", image.FileName);

                var response = await client.PostAsync("analyze", content);

                if (!response.IsSuccessStatusCode)
                {
                    var error = await response.Content.ReadAsStringAsync();
                    return StatusCode((int)response.StatusCode, $"FastAPI Error: {error}");
                }

                var responseContent = await response.Content.ReadAsStringAsync();
                return Content(responseContent, "application/json");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal Error: {ex.Message}");
            }
        }
    }
}

