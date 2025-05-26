using Microsoft.AspNetCore.Mvc;
using Backend.DataStructures;
using Backend.Services; // Assuming ProctoringService will be created here

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProctoringController : ControllerBase
    {
        private readonly ILogger<ProctoringController> _logger;
        // private readonly ProctoringService _proctoringService; // TODO: Inject the main service
        private readonly OnnxModelService _onnxModelService; // Temporarily inject this for testing loading

        public ProctoringController(ILogger<ProctoringController> logger, OnnxModelService onnxModelService /* TODO: Add ProctoringService injection */)
        {
            _logger = logger;
            _onnxModelService = onnxModelService; // TODO: Replace/add ProctoringService
            _logger.LogInformation("ProctoringController initialized.");
        }

        [HttpPost("analyze")]
        public IActionResult AnalyzeImage([FromBody] ImageInput input)
        {
            _logger.LogInformation("Received image analysis request.");

            if (input == null || string.IsNullOrEmpty(input.ImageBase64))
            {
                _logger.LogWarning("Received empty or invalid request body.");
                return BadRequest("Request body must contain ImageBase64 data.");
            }

            try
            {
                // TODO: Decode Base64 string to image bytes
                // TODO: Pass image bytes to ProctoringService for analysis
                // var result = _proctoringService.Analyze(input.ImageBase64);

                // Placeholder result until ProctoringService is implemented
                var placeholderResult = new ProctoringResult
                {
                    IsFaceDetected = false, // Default to false
                    FaceCount = 0,
                    IsLookingAway = false, // Default
                    Issues = { "Analysis logic not yet implemented." }
                };

                 // Simple test to ensure model service loaded
                if (_onnxModelService.GetFaceDetectionSession() != null)
                {
                     placeholderResult.Issues.Add("Face detection model loaded.");
                }
                 if (_onnxModelService.GetLandmarkDetectionSession() != null)
                {
                     placeholderResult.Issues.Add("Landmark detection model loaded.");
                }


                _logger.LogInformation("Image analysis request processed (placeholder).");
                return Ok(placeholderResult);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error processing image analysis request.");
                return StatusCode(500, "An internal server error occurred.");
            }
        }
    }
}

