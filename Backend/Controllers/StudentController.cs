using Backend.DTOs.StudentDOs;
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

        // Get Student by Id
        [HttpGet("GetById/{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var result = await _studentService.GetByIdAsync(id);
            return NewResult(result);
        }

        // Get Student by Name
        [HttpGet("GetByName/{name}")]
        public async Task<IActionResult> GetByName(string name)
        {
            var result = await _studentService.GetByNameAsync(name);
            return NewResult(result);
        }

        // Get All Students in a Course by Course Name
        [HttpGet("GetAllInCourseByCourseName/{courseName}")]
        public async Task<IActionResult> GetAllInCourseByCourseName(string courseName)
        {
            var result = await _studentService.GetAllInCourseByCourseNameAsync(courseName);
            return NewResult(result);
        }

        // Create New Student
        [HttpPost("Create")]
        public async Task<IActionResult> Create([FromBody] CreateStudentDto createStudentDto)
        {
            var result = await _studentService.CreateAsync(createStudentDto);
            return NewResult(result);
        }

        // Update Student
        [HttpPut("Update")]
        public async Task<IActionResult> Update([FromBody] UpdateStudentDto updateStudentDto)
        {
            var result = await _studentService.UpdateAsync(updateStudentDto);
            return NewResult(result);
        }

        // Delete Student
        [HttpDelete("Delete/{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _studentService.DeleteAsync(id);
            return NewResult(result);
        }
    }
}
