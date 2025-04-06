namespace Backend.Controllers;

[ApiController]
public class CourseController : AppControllerBase
{
    [HttpPost("Course/Create")]

    public IActionResult Craete()
    {
        var result = new Response<string>();
        return Ok(result);
    }
}