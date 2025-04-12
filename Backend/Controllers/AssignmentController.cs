namespace Backend.Controllers;


[ApiController]
public class AssignmentController : AppControllerBase
{
    private readonly IAssignmentServices _assignmentServices;
    public AssignmentController(IAssignmentServices assignmentServices)
    {
        _assignmentServices = assignmentServices;
    }
    [HttpPost("Assignment/Create")]

    public async Task<IActionResult> Create(CreateAssignDto createAssignDto)
    {
        var result = await _assignmentServices.CreateAsync(createAssignDto);
        return NewResult(result);
    }
}