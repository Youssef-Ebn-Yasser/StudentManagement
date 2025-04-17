using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class StudentController : AppControllerBase
    {
        private readonly IStudentService _studentService;

        public StudentController(IStudentService studentService) 
        {
            _studentService = studentService;
        }
        [HttpGet("GetAll")]
        public async Task<IActionResult> GetAll()
        {
            var result = await _studentService.GetAllAsync();
            return NewResult(result);
        }

        [HttpGet("GetById/{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var result = await _studentService.GetByIdAsync(id);
            return NewResult(result);
        }

        [HttpGet("GetByName/{name}")]
        public async Task<IActionResult> GetByName(string name)
        {
            var result = await _studentService.GetByNameAsync(name);
            return NewResult(result);
        }

        [HttpGet("GetAllInCourseByCourseName/{courseName}")]
        public async Task<IActionResult> GetAllInCourseByCourseName(string courseName)
        {
            var result = await _studentService.GetAllInCourseByCourseNameAsync(courseName);
            return NewResult(result);
        }
    }
}
