using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FooterController : ControllerBase
    {
        [HttpGet("features")]
        public IActionResult Features() => Ok("Features page content");

        [HttpGet("pricing")]
        public IActionResult Pricing() => Ok("Pricing page content");

        [HttpGet("blog")]
        public IActionResult Blog() => Ok("Blog page content");

        [HttpGet("user-guides")]
        public IActionResult UserGuides() => Ok("User Guides content");

        [HttpGet("webinars")]
        public IActionResult Webinars() => Ok("Webinars content");

        [HttpGet("about")]
        public IActionResult About() => Ok("About page content");

        [HttpGet("join-us")]
        public IActionResult JoinUs() => Ok("Join Us page content");

        [HttpGet("privacy")]
        public IActionResult Privacy() => Ok("Privacy Policy content");

        [HttpGet("terms")]
        public IActionResult Terms() => Ok("Terms and Conditions content");

        [HttpGet("sitemap")]
        public IActionResult Sitemap() => Ok("Sitemap content");

        [HttpPost("subscribe-newsletter")]
        public IActionResult SubscribeNewsletter([FromBody] string email)
        {
            // Add logic to save the email or send to a newsletter service
            return Ok($"Subscribed {email} to the newsletter!");
        }
    }
} 