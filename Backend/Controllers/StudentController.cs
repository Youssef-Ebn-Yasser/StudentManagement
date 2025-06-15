using Backend.DTOs.StudentDOs;

namespace Backend.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class StudentController : AppControllerBase
    {
        private readonly IStudentService _studentService;
        private readonly IUnitOfWork _unitOfWork;

        public StudentController(IStudentService studentService, IUnitOfWork unitOfWork)
        {
            _studentService = studentService;
            _unitOfWork = unitOfWork;
        }

        [HttpGet("forTest")]
        public async Task<IActionResult> get(int studentId)
        {

            var s = _unitOfWork.Repository<Student>()
       .GetTableNoTracking()
       .Include(sa => sa.StudentCourses)
       .ThenInclude(l => l.Course)
       .ThenInclude(c => c.lessons)
       .ThenInclude(l => l.materials)
       .Include(s => s.StudentCourses)
       .ThenInclude(sc => sc.Course)
       .ThenInclude(c => c.lessons)
       .ThenInclude(l => l.Quizs)
       .ThenInclude(q => q.StudentQuizeAnswers)
       .Include(s => s.StudentAssignments)
       .Where(s => s.Id == studentId)
       .Select(s => new
       {

           ImageUrl = s.ImageUrl,
           Phone = s.PhoneNumber,
           Id = s.Id,
           Name = s.NameEn,
           Email = s.Email,
           CourseDetails = s.StudentCourses.Where(sc => sc.Student.Id == s.Id)
                              .Select(c => c.Course)
                            .Select(c => new
                            {
                                CourseName = c.TitleEn,
                                CourseId = c.Id,
                                AssignmentCountInCourse = c.lessons.SelectMany(l => l.materials).Where(m => m.Type == MaterialTypeId.Assignment).Count(),
                                TotalPercentageDegreeInCourse = c.lessons.SelectMany(l => l.StudentAssignments).Where(sa => sa.Id == s.Id).Sum(sa => sa.DegreePercentage),
                                NumberOfDeliverAssignment = c.lessons.SelectMany(l => l.StudentAssignments).Where(sa => sa.Id == s.Id).Count(),
                                TotalPercentage = (c.lessons.SelectMany(l => l.materials).Where(m => m.Type == MaterialTypeId.Assignment).Count() == 0 ? 0
                                                : (c.lessons.SelectMany(l => l.StudentAssignments).Where(sa => sa.Id == s.Id).Sum(sa => sa.DegreePercentage)
                                                / (c.lessons.SelectMany(l => l.materials).Where(m => m.Type == MaterialTypeId.Assignment).Count() * 100))),



                                TotalDegreeQuizInCourse = c.lessons.SelectMany(l => l.Quizs).Sum(q => q.PossiblePoints),
                                TotalStudentDegreeInCourse = c.lessons.SelectMany(l => l.Quizs).SelectMany(q => q.StudentQuizeAnswers).Sum(s => s.GradingRating),
                                TotalQuizPercentage = (c.lessons.SelectMany(l => l.Quizs).Sum(q => q.PossiblePoints) == 0 ? 0
                                                     : c.lessons.SelectMany(l => l.Quizs).SelectMany(q => q.StudentQuizeAnswers).Sum(s => s.GradingRating)
                                                     / c.lessons.SelectMany(l => l.Quizs).Sum(q => q.PossiblePoints)),


                                x = c.lessons.Select(l => new
                                {
                                    LessonId = l.Id,
                                    AssignmentDetails = l.StudentAssignments.Where(sa => sa.LessonId == l.Id)
                                   .Select(sa => new
                                   {
                                       StudentDegreePercentage = sa.DegreePercentage,
                                       StudentAssignmentId = sa.Id,
                                       AssignmentName = l.materials.Where(m => m.LessonId == l.Id)
                                                                   .Select(m => m.TitleEn)
                                                                   .FirstOrDefault(),
                                   }).FirstOrDefault(),

                                    NumberOfQuizesInLesson = l.Quizs.Where(q => q.LessonId == l.Id).Count(),
                                    TotalQuizesDegreeInLessons = l.Quizs.Where(q => q.LessonId == l.Id).Sum(q => q.PossiblePoints),
                                    StudentDegreeOfQuizesInLessons = l.Quizs.SelectMany(q => q.StudentQuizeAnswers).Sum(qa => qa.GradingRating),
                                    quizLestDetails = l.Quizs.SelectMany(q => q.StudentQuizeAnswers).Select(qa => new
                                    {
                                        QuizId = qa.QuizId,
                                        StudentQuizAnswerId = qa.Id,
                                        QuizPercentageDegree = qa.GradingRating,
                                        IsPass = qa.IsPassed,
                                        PossiblePoints = qa.Quiz.PossiblePoints,
                                        NumberOfAswered = qa.NumberOfAswered,
                                        QuizName = qa.Quiz.TitleEn,

                                    })
                                })
                            })

       });
            return Ok(s);

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
        [HttpGet("profile/{studentId}")]
        public async Task<IActionResult> GetStudentProfile(int studentId)
        {
            var result = await _studentService.GetStudentProfileAsync(studentId);
            return NewResult(result);
        }
    }
}