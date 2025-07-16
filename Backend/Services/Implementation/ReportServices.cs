using Backend.DTOs.ReportDTOS;
using StudentAssignmentDto = Backend.DTOs.StudentProfileDto.StudentAssignmentDto;
namespace Backend.Services.Implementation
{
    public class ReportServices : IReportServices
    {
        private readonly ApplicationDbContext _context;
        private readonly IUnitOfWork _unitOfWork;

        public ReportServices(ApplicationDbContext context, IUnitOfWork unitOfWork)
        {
            _context = context;
            _unitOfWork = unitOfWork;
        }

        public async Task<List<AverageAssignmentScoreDto>> GetAverageStudentScoresAsync()
        {
            var data = await _context.StudentAssignments
                                     .GroupBy(s => new { s.StudentId, s.Student.NameEn })
                                     .Select(g => new AverageAssignmentScoreDto
                                     {
                                         StudentId = g.Key.StudentId,
                                         StudentName = $"{g.Key.NameEn}",
                                         AverageScore = g.Average(x => x.DegreePercentage)
                                     })
        .ToListAsync();

            return data;
        }
        public async Task<List<CourseEnrollmentReportDto>> GetCourseEnrollmentStatsAsync(bool isArabic = false)
        {
            var report = await _context.Courses
                .Select(c => new CourseEnrollmentReportDto
                {
                    CourseId = c.Id,
                    CourseName = isArabic ? c.TitleAr : c.TitleEn,
                    StudentsCount = c.StudentCourses.Count(sc => !sc.IsDeleted)
                })
                .ToListAsync();

            return report;
        }



        public async Task<List<CourseRevenueReportDto>> GetCourseRevenuesAsync(bool isArabic = false)
        {
            var data = await _context.Payments
                .Where(p => p.StatusEn == "Paid")
                .GroupBy(p => new
                {
                    p.CourseId,
                    Title = isArabic ? p.Course.TitleAr : p.Course.TitleEn
                })
                .Select(g => new CourseRevenueReportDto
                {
                    CourseId = g.Key.CourseId ?? 0,
                    CourseName = g.Key.Title,
                    TotalRevenue = g.Sum(x => (decimal)x.Amount),
                    PaymentsCount = g.Count()
                })
                .ToListAsync();

            return data;
        }


        public async Task<DashboardSummaryDto> GetSummaryAsync()
        {
            var now = DateTime.Now;
            var last7Days = now.AddDays(-7);
            var firstDayOfMonth = new DateTime(now.Year, now.Month, 1);

            var totalUsers = await _context.Users.CountAsync();
            var totalStudents = await _context.Students.CountAsync();
            var totalTeachers = await _context.Teachers.CountAsync();
            var newUsersLast7Days = await _context.Users.CountAsync(u => u.CreatedAt >= last7Days);

            var totalCourses = await _context.Courses.CountAsync();
            var totalPayments = await _context.Payments.CountAsync();

            var revenueThisMonth = await _context.Payments
                .Where(p => p.PaymentDate >= firstDayOfMonth && p.StatusEn == "Success")
                .SumAsync(p => (decimal?)p.Amount) ?? 0;

            return new DashboardSummaryDto
            {
                TotalUsers = totalUsers,
                TotalStudents = totalStudents,
                TotalTeachers = totalTeachers,
                NewUsersLast7Days = newUsersLast7Days,
                TotalCourses = totalCourses,
                TotalPayments = totalPayments,
                RevenueThisMonth = revenueThisMonth
            };
        }



        public async Task<List<WeeklyStudentEnrollmentDto>> GetWeeklyNewStudentsAsync()
        {
            var startDate = DateTime.Today.AddDays(-28);

            var students = await _context.Users
                .Where(u => u is Student && u.CreatedAt >= startDate)
                .ToListAsync();

            var grouped = students
                .GroupBy(u =>
                {
                    var weekStart = u.CreatedAt.Date.AddDays(-(int)u.CreatedAt.DayOfWeek);
                    return weekStart;
                })
                .OrderBy(g => g.Key)
                .Select(g => new WeeklyStudentEnrollmentDto
                {
                    Week = $"{g.Key:dd MMM} - {g.Key.AddDays(6):dd MMM}",
                    StudentCount = g.Count()
                })
                .ToList();

            return grouped;
        }

        public async Task<StudentComprehensiveReportDto> GetStudentComprehensiveReportAsync(int studentId)
        {
            var student = await _unitOfWork.Repository<Student>()
            .GetTableNoTracking()
                .Include(s => s.StudentCourses)
                    .ThenInclude(sc => sc.Course)
                .FirstOrDefaultAsync(s => s.Id == studentId);

            if (student == null)
                throw new Exception($"Student with ID {studentId} not found");

            // Get basic student info
            var report = new StudentComprehensiveReportDto
            {
                StudentId = student.Id,
                StudentName = student.NameEn,
                Email = student.Email,
                Phone = student.PhoneNumber,
                EnrolledCourses = new List<CourseReportDto>(),
                AttendanceSummary = new AttendanceSummaryDto(),
                AcademicPerformance = new AcademicPerformanceDto(),
                QuizPerformance = new QuizPerformanceDto()
            };

            // Get course information
            foreach (var studentCourse in student.StudentCourses.Where(sc => !sc.IsDeleted))
            {
                var course = studentCourse.Course;
                var courseReport = new CourseReportDto
                {
                    CourseId = course.Id,
                    CourseName = course.TitleEn,
                    EnrollmentDate = studentCourse.EnrollmentDate
                };

                // Calculate course progress
                var totalLessons = await _context.Lessons
                    .Where(l => l.CourseId == course.Id && !l.IsDeleted)
                    .CountAsync();

                var completedLessons = await _context.Lessons
                    .Where(l => l.CourseId == course.Id && !l.IsDeleted)
                    .SelectMany(l => l.StudentAssignments)
                    .Where(sa => sa.StudentId == studentId)
                    .CountAsync();

                courseReport.CourseProgress = totalLessons > 0 ? (double)completedLessons / totalLessons * 100 : 0;

                // Calculate assignment completion rate
                var totalAssignments = await _context.Lessons
                    .Where(l => l.CourseId == course.Id && !l.IsDeleted)
                    .SelectMany(l => l.materials)
                    .Where(m => m.Type == MaterialTypeId.Assignment)
                    .CountAsync();

                var completedAssignments = await _context.StudentAssignments
                    .Where(sa => sa.StudentId == studentId &&
                           sa.Lesson.CourseId == course.Id)
                    .CountAsync();

                courseReport.AssignmentCompletionRate = totalAssignments > 0 ?
                    (double)completedAssignments / totalAssignments * 100 : 0;

                // Calculate quiz completion rate
                var totalQuizzes = await _context.Lessons
                    .Where(l => l.CourseId == course.Id && !l.IsDeleted)
                    .SelectMany(l => l.Quizs)
                    .CountAsync();

                var completedQuizzes = await _context.studentQuizeAnswers
                    .Where(sqa => sqa.StudentId == studentId &&
                           sqa.Quiz.Lesson.CourseId == course.Id)
                    .CountAsync();

                courseReport.QuizCompletionRate = totalQuizzes > 0 ?
                    (double)completedQuizzes / totalQuizzes * 100 : 0;

                // Calculate overall grade
                var assignmentGrades = await _context.StudentAssignments
                    .Where(sa => sa.StudentId == studentId &&
                           sa.Lesson.CourseId == course.Id)
                    .Select(sa => sa.DegreePercentage)
                    .ToListAsync();

                var quizGrades = await _context.studentQuizeAnswers
                    .Where(sqa => sqa.StudentId == studentId &&
                           sqa.Quiz.Lesson.CourseId == course.Id)
                    .Select(sqa => sqa.GradingRating)
                    .ToListAsync();

                //var totalGrades = assignmentGrades.Count + quizGrades.Count;
                //courseReport.OverallGrade = totalGrades > 0 ? 
                //    (assignmentGrades.Sum()+ quizGrades.Sum()) / totalGrades : 0;

                report.EnrolledCourses.Add(courseReport);
            }

            // Get attendance information
            var attendance = await _context.MeetingAttendances
                .Include(ma => ma.Meeting)
                .Where(ma => ma.StudentId == studentId)
                .ToListAsync();

            report.AttendanceSummary = new AttendanceSummaryDto
            {
                TotalMeetings = attendance.Count,
                AttendedMeetings = attendance.Count(a => a.Attended),
                AbsentMeetings = attendance.Count(a => !a.Attended),
                AttendanceRate = attendance.Count > 0 ?
                    (double)attendance.Count(a => a.Attended) / attendance.Count * 100 : 0,
                RecentAttendance = attendance
                    .OrderByDescending(a => a.AttendanceDate)
                    .Take(5)
                    .Select(a => new StudentAttendanceReportDto
                    {
                        Id = a.Id,
                        MeetingTopic = a.Meeting.TopicEn,
                        MeetingDate = a.AttendanceDate,
                        Attended = a.Attended
                    })
                    .ToList()
            };

            // Get academic performance
            var assignments = await _context.StudentAssignments
                .Include(sa => sa.Lesson)
                .Where(sa => sa.StudentId == studentId)
                .ToListAsync();

            report.AcademicPerformance = new AcademicPerformanceDto
            {
                TotalAssignments = assignments.Count,
                CompletedAssignments = assignments.Count,
                AverageAssignmentScore = assignments.Any() ?
                    assignments.Average(a => a.DegreePercentage) : 0,
                RecentAssignments = assignments
                    .Take(5)
                    .Select(a => new StudentAssignmentDto
                    {
                        Id = a.Id,
                        CourseName = a.Lesson.Course.TitleEn,
                        LessonName = a.Lesson.TitleEn,
                        Path = a.Path,
                        DegreePercentage = a.DegreePercentage
                    })
                    .ToList()
            };

            // Get quiz performance
            var quizzes = await _context.studentQuizeAnswers
                .Include(sqa => sqa.Quiz)
                .Where(sqa => sqa.StudentId == studentId)
                .ToListAsync();

            report.QuizPerformance = new QuizPerformanceDto
            {
                TotalQuizzes = quizzes.Count,
                CompletedQuizzes = quizzes.Count,
                PassedQuizzes = quizzes.Count(q => (bool)q.IsPassed),
                AverageQuizScore = (double)(quizzes.Any() ?
                    quizzes.Average(q => q.GradingRating) : 0),
                PassRate = quizzes.Any() ?
                    (double)quizzes.Count(q => (bool)q.IsPassed) / quizzes.Count * 100 : 0,
                RecentQuizzes = quizzes
                    .Take(5)
                    .Select(q => new StudentQuizDto
                    {
                        QuizId = q.Id,
                        QuizTitle = q.Quiz.TitleEn,
                        GradingRating = q.GradingRating,
                        IsPassed = q.IsPassed
                    })
                    .ToList()
            };

            return report;
        }
    }
}
