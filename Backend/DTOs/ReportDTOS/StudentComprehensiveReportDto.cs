using Backend.DTOs.StudentProfileDto;

namespace Backend.DTOs.ReportDTOS
{
    public class StudentComprehensiveReportDto
    {
        // Basic Student Information
        public int StudentId { get; set; }
        public string StudentName { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }

        // Course Information
        public List<CourseReportDto> EnrolledCourses { get; set; }

        // Attendance Summary
        public AttendanceSummaryDto AttendanceSummary { get; set; }

        // Academic Performance
        public AcademicPerformanceDto AcademicPerformance { get; set; }

        // Quiz Performance
        public QuizPerformanceDto QuizPerformance { get; set; }
    }

    public class CourseReportDto
    {
        public int CourseId { get; set; }
        public string CourseName { get; set; }
        public DateTime EnrollmentDate { get; set; }
        public double CourseProgress { get; set; }
        public double AssignmentCompletionRate { get; set; }
        public double QuizCompletionRate { get; set; }
        public double OverallGrade { get; set; }
    }

    public class AttendanceSummaryDto
    {
        public int TotalMeetings { get; set; }
        public int AttendedMeetings { get; set; }
        public int AbsentMeetings { get; set; }
        public double AttendanceRate { get; set; }
        public List<StudentAttendanceDto> RecentAttendance { get; set; }
    }

    public class AcademicPerformanceDto
    {
        public int TotalAssignments { get; set; }
        public int CompletedAssignments { get; set; }
        public double AverageAssignmentScore { get; set; }
        public List<StudentProfileDto.StudentAssignmentDto> RecentAssignments { get; set; }
    }

    public class QuizPerformanceDto
    {
        public int TotalQuizzes { get; set; }
        public int CompletedQuizzes { get; set; }
        public int PassedQuizzes { get; set; }
        public double AverageQuizScore { get; set; }
        public double PassRate { get; set; }
        public List<StudentQuizDto> RecentQuizzes { get; set; }
    }
} 