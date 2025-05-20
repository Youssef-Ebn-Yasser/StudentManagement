using Backend.DTOs.StudentDOs;

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
        [HttpGet("GetPaginatedCourses/{pageNumber}/{pageSize}")]
        public async Task<IActionResult> GetAllInCourseByCourseName(int pageNumber, int pageSize)
        {
            var result = await _studentService.GetPaginatedListOfStudentAsync(pageNumber, pageSize);
            return NewResult(result);
        }

        [HttpGet("GetAllEnrolledStudentCourses")]
        public async Task<IActionResult> GetAllEnrolledStudentCourses(int studentId)
        {
            var result = await _studentService.GetAllEnrolledStudentCourses(studentId);
            return NewResult(result);
        }

        [HttpPost("IsEnrolled")]
        public async Task<IActionResult> IsEnrolledInCourse(StudentEnrollDto studentEnrollDto)
        {
            var result = await _studentService.IsEnrolledInCourse(studentEnrollDto);
            return NewResult(result);
        }

        [HttpPost("EnrollToCourse")]
        public async Task<IActionResult> EnrollToCourse(StudentEnrollDto studentEnrollDto)
        {
            var result = await _studentService.EnrollToCourse(studentEnrollDto);
            return NewResult(result);
        }


        [HttpPost("Create")]
        public async Task<IActionResult> Create(CreateStudentDto createStudentDto)
        {
            var result = await _studentService.CreateAsync(createStudentDto);
            return NewResult(result);
        }


        [HttpPut("Update")]
        public async Task<IActionResult> Update(UpdateStudentDto updateStudentDto)
        {
            var result = await _studentService.UpdateAsync(updateStudentDto);
            return NewResult(result);
        }


        [HttpDelete("Delete/{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _studentService.DeleteAsync(id);
            return NewResult(result);
        }

        // Delete Student from Course
        [HttpDelete("DeleteStudentFromCourse")]
        public async Task<IActionResult> DeleteStudentFromCourse([FromBody] DeleteStudentFromCourseDto deleteStudentFromCourseDto)
        {
            var result = await _studentService.DeleteStudentFromCourseAsync(deleteStudentFromCourseDto);
            return NewResult(result);
        }
    }
}