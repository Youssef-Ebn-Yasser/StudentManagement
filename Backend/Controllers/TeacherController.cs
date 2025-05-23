namespace Backend.Controllers;

[Route("api/[controller]")]
[ApiController]
public class TeacherController : AppControllerBase
{
    private readonly ITeacherService _teacherService;
    public TeacherController(ITeacherService teacherService)
    {
        _teacherService = teacherService;
    }
    [HttpGet("Teacher/ById/{id}")]
    public async Task<IActionResult> GetTeacherById(int id)
    {
        var result = await _teacherService.GetByIdAsync(id);

        return NewResult(result);
    }

    [HttpGet("Teacher/All")]
    public async Task<IActionResult> GetAll()
    {
        var result = await _teacherService.GetAllAsync();
        return NewResult(result);

    }
    [HttpGet("Teacher/ByName/{name}")]
    public async Task<IActionResult> GetTeacherByName(string name)
    {
        var result = await _teacherService.GetByNameAsync(name);

        return NewResult(result);
    }

    //[HttpPost("Teacher/Create")]
    //public async Task<IActionResult> Create(CreateTeacherDto createTeacherDto)
    //{
    //    var result = await _teacherService.CreateAsync(createTeacherDto);

    //    return NewResult(result);
    //}

    [HttpPut("Teacher/Update")]
    public async Task<IActionResult> Update(UpdateTeacherDto updateTeacherDto)
    {
        var result = await _teacherService.UpdateAsync(updateTeacherDto);

        return NewResult(result);
    }

    [HttpDelete("Teacher/Delete")]
    public async Task<IActionResult> DeleteAll(int id)
    {
        var result = await _teacherService.DeleteAsync(id);

        return NewResult(result);
    }
}