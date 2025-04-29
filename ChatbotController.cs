using ElearningApi.Models; // Add this using directive

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/chatbot")]
    public class ChatbotController : ControllerBase
    {
        // Existing code...

        [HttpPost("query")]
        public async Task<ActionResult<AnswerDto>> Query([FromBody] QuestionDto dto)
        {
            // Existing code...
            return Ok(new AnswerDto { Answer = answer });
        }
    }
}
