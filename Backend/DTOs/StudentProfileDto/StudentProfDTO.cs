using Backend.DTOs.StudentDOs;

namespace Backend.DTOs.StudentProfileDto
{
    public class StudentProfDTO
    {
        public ShowStudentDto StudentInfo { get; set; }
        public List<StudentAssignmentDto> Assignments { get; set; }
        public List<StudentQuizDto> Quizzes { get; set; }
        public List<StudentAttendanceDto> Attendance { get; set; }
    }
}
