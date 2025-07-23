using ClosedXML.Excel;
using Microsoft.AspNetCore.Authorization;

namespace Backend.Controllers;

//[Route("api/[controller]/[action]")]
[ApiController]
public class StudentController : AppControllerBase
{
    #region Fields
    private readonly IStudentService _studentService;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IStructuredLogger _logger;
    private UserManager<User> _userManager;
    #endregion

    #region Constructor
    public StudentController(IStudentService studentService, IUnitOfWork unitOfWork, IStructuredLogger logger, UserManager<User> userManager)
    {
        _studentService = studentService;
        _unitOfWork = unitOfWork;
        _logger = logger;
        _userManager = userManager;
    }
    #endregion

    #region Method
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



    [Authorize(Roles = "Admin")]
    [HttpGet(Routing.StudentRouting.GetList)]
    public async Task<IActionResult> GetAll()
    {
        try
        {
            var result = await _studentService.GetAllAsync();
            return NewResult(result);
        }
        catch
        {
            _logger.LogInfo("Error happen when mapping or by network in GetAll Teacher");
            return NewResult(ErrorHappen.ErrorInServer());
        }
    }

    [Authorize]
    [HttpGet(Routing.StudentRouting.Prefix)]
    public async Task<IActionResult> GetById(int id)
    {
        try
        {
            var result = await _studentService.GetByIdAsync(id);
            return NewResult(result);
        }
        catch
        {
            _logger.LogInfo("Error happen when mapping or by network in GetAll Teacher");
            return NewResult(ErrorHappen.ErrorInServer());
        }
    }

    [Authorize]
    [HttpGet(Routing.StudentRouting.GetByName)]
    public async Task<IActionResult> GetByName(string name)
    {
        try
        {
            var result = await _studentService.GetByNameAsync(name);
            return NewResult(result);
        }
        catch
        {
            _logger.LogInfo("Error happen when mapping or by network in GetAll Teacher");
            return NewResult(ErrorHappen.ErrorInServer());
        }
    }

    [Authorize(Roles = "Admin,Teacher")]
    [HttpGet(Routing.StudentRouting.PagGetAllInCourseByCourseName)]
    public async Task<IActionResult> GetAllInCourseByCourseName(string courseName)
    {
        try
        {
            var result = await _studentService.GetAllInCourseByCourseNameAsync(courseName);
            return NewResult(result);
        }
        catch
        {
            _logger.LogInfo("Error happen when mapping or by network in GetAll Teacher");
            return NewResult(ErrorHappen.ErrorInServer());
        }

    }

    [Authorize(Roles = "Admin,Teacher")]
    [HttpGet(Routing.StudentRouting.GetPaginatedCourses)]
    public async Task<IActionResult> GetAllInCourseByCourseName(int pageNumber, int pageSize)
    {
        try
        {
            var result = await _studentService.GetPaginatedListOfStudentAsync(pageNumber, pageSize);
            return NewResult(result);
        }
        catch
        {
            _logger.LogInfo("Error happen when mapping or by network in GetAll Teacher");
            return NewResult(ErrorHappen.ErrorInServer());
        }
    }

    [Authorize(Roles = "Student")]
    [HttpGet(Routing.StudentRouting.GetAllEnrolledStudentCourses)]
    public async Task<IActionResult> GetAllEnrolledStudentCourses(int studentId)
    {
        try
        {
            var result = await _studentService.GetAllEnrolledStudentCourses(studentId);
            return NewResult(result);
        }
        catch
        {
            _logger.LogInfo("Error happen when mapping or by network in GetAll Teacher");
            return NewResult(ErrorHappen.ErrorInServer());
        }
    }

    [Authorize]
    [HttpGet(Routing.StudentRouting.Profile)]
    public async Task<IActionResult> GetStudentProfile(int studentId)
    {
        try
        {
            var result = await _studentService.GetStudentProfileAsync(studentId);
            return NewResult(result);
        }
        catch
        {
            _logger.LogInfo("Error happen when mapping or by network in GetAll Teacher");
            return NewResult(ErrorHappen.ErrorInServer());
        }
    }

    [HttpPost(Routing.StudentRouting.IsEnrolled)]
    public async Task<IActionResult> IsEnrolledInCourse(StudentEnrollDto studentEnrollDto)
    {
        try
        {
            var result = await _studentService.IsEnrolledInCourse(studentEnrollDto);
            return NewResult(result);
        }
        catch
        {
            _logger.LogInfo("Error happen when mapping or by network in GetAll Teacher");
            return NewResult(ErrorHappen.ErrorInServer());
        }
    }

    [Authorize(Roles = "Admin,Teacher")]
    [HttpPost(Routing.StudentRouting.EnrollToCourse)]
    public async Task<IActionResult> EnrollToCourse(StudentEnrollDto studentEnrollDto)
    {
        try
        {
            var result = await _studentService.EnrollToCourse(studentEnrollDto);
            return NewResult(result);
        }
        catch
        {
            _logger.LogInfo("Error happen when mapping or by network in GetAll Teacher");
            return NewResult(ErrorHappen.ErrorInServer());
        }
    }


    [HttpPost(Routing.StudentRouting.Prefix)]
    public async Task<IActionResult> Create(CreateStudentDto createStudentDto)
    {
        try
        {
            var result = await _studentService.CreateAsync(createStudentDto);
            return NewResult(result);
        }
        catch
        {
            _logger.LogInfo("Error happen when mapping or by network in GetAll Teacher");
            return NewResult(ErrorHappen.ErrorInServer());
        }
    }

    [Authorize]
    [HttpPut(Routing.StudentRouting.Prefix)]
    public async Task<IActionResult> Update(UpdateStudentDto updateStudentDto)
    {
        try
        {
            var result = await _studentService.UpdateAsync(updateStudentDto);
            return NewResult(result);
        }
        catch
        {
            _logger.LogInfo("Error happen when mapping or by network in GetAll Teacher");
            return NewResult(ErrorHappen.ErrorInServer());
        }
    }

    [Authorize(Roles = "Admin,Teacher")]
    [HttpDelete(Routing.StudentRouting.Prefix)]
    public async Task<IActionResult> Delete(int id)
    {
        try
        {
            var result = await _studentService.DeleteAsync(id);
            return NewResult(result);
        }
        catch
        {
            _logger.LogInfo("Error happen when mapping or by network in GetAll Teacher");
            return NewResult(ErrorHappen.ErrorInServer());
        }
    }

    [Authorize(Roles = "Admin,Teacher")]
    [HttpDelete(Routing.StudentRouting.DeleteStudentFromCourse)]
    public async Task<IActionResult> DeleteStudentFromCourse([FromBody] DeleteStudentFromCourseDto deleteStudentFromCourseDto)
    {
        try
        {
            var result = await _studentService.DeleteStudentFromCourseAsync(deleteStudentFromCourseDto);
            return NewResult(result);
        }
        catch
        {
            _logger.LogInfo("Error happen when mapping or by network in GetAll Teacher");
            return NewResult(ErrorHappen.ErrorInServer());
        }
    }


    [Authorize(Roles = "Admin")]
    [HttpGet(Routing.StudentRouting.DownloadSampleExcel)]
    public IActionResult DownloadExcel()
    {
        using var workbook = new XLWorkbook();
        var worksheet = workbook.Worksheets.Add("StudentsSample");

        // Add headers
        worksheet.Cell(1, 1).Value = "NameAr";
        worksheet.Cell(1, 2).Value = "NameEn";
        worksheet.Cell(1, 3).Value = "Email";
        worksheet.Cell(1, 4).Value = "NationalId";
        worksheet.Cell(1, 5).Value = "password";
        worksheet.Cell(1, 6).Value = "Phone"; worksheet.Cell(1, 1).Value = "Name";
        worksheet.Cell(1, 7).Value = "AddressAr";
        worksheet.Cell(1, 8).Value = "AddressEn";
        worksheet.Cell(1, 9).Value = "GovernmentAr";
        worksheet.Cell(1, 10).Value = "GovernmentEn";

        // Add data for first 3 rows
        // Row 2
        worksheet.Cell(2, 1).Value = "أحمد علي";
        worksheet.Cell(2, 2).Value = "Ahmed Ali";
        worksheet.Cell(2, 3).Value = "ahmed.ali@example.com";
        worksheet.Cell(2, 4).Value = "29807153400213";
        worksheet.Cell(2, 5).Value = "Pass123!";
        worksheet.Cell(2, 6).Value = "01012345678";
        worksheet.Cell(2, 7).Value = "شارع التحرير";
        worksheet.Cell(2, 8).Value = "Tahrir Street";
        worksheet.Cell(2, 9).Value = "القاهرة";
        worksheet.Cell(2, 10).Value = "Cairo";

        // Row 3
        worksheet.Cell(3, 1).Value = "سارة محمد";
        worksheet.Cell(3, 2).Value = "Sara Mohamed";
        worksheet.Cell(3, 3).Value = "sara.m@example.com";
        worksheet.Cell(3, 4).Value = "29901122300451";
        worksheet.Cell(3, 5).Value = "Welcome1!";
        worksheet.Cell(3, 6).Value = "01098765432";
        worksheet.Cell(3, 7).Value = "شارع النيل";
        worksheet.Cell(3, 8).Value = "Nile Street";
        worksheet.Cell(3, 9).Value = "الجيزة";
        worksheet.Cell(3, 10).Value = "Giza";

        // Export to memory stream
        var stream = new MemoryStream();
        workbook.SaveAs(stream);
        stream.Position = 0;

        var contentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
        var fileName = "StudentsSample.xlsx";

        return File(stream, contentType, fileName);
    }


    [Authorize(Roles = "Admin")]
    [HttpPost(Routing.StudentRouting.UploadAddStudentsExcel)]
    public async Task<IActionResult> UploadExcel(IFormFile file)
    {
        try
        {
            var result = await _studentService.SaveFromExcel(file);
            return NewResult(result);
        }
        catch
        {
            _logger.LogInfo("Error happen when mapping or by network in GetAll Teacher");
            return NewResult(ErrorHappen.ErrorInServer());
        }
    }
    #endregion
}