using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers

{
    [ApiController]
    [Route("api/recommend")]
    public class RecommendController : ControllerBase
    {
        private static readonly List<Course> Courses = new()
        {
            new() { Id = 1, Title = "Intro to C#",  Description = "Programming" },
            new() { Id = 2, Title = "ASP.NET Core Basics", Description = "Programming" },
            new() { Id = 3, Title = "Linear Algebra",  Description = "Mathematics" },
        };

        [HttpGet("{userId}")]
        public ActionResult<Course[]> Get()
        {
            var userPref = "Programming";  // Hard-coded for now
            var recs = Courses.Where(c => c.Description == userPref).ToArray();
            return Ok(recs);
        }
    }
}
