namespace Backend.DTOs.StudentProfileDto
{
    public class StudentQuizDto
    {
        public int QuizId { get; set; }
        public string QuizTitle { get; set; }
        public string CourseName { get; set; }
        public decimal? Score { get; set; }
        public bool? IsPassed { get; set; }
        public int TotalQuestions { get; set; }
        public int CorrectAnswers { get; set; }
        public decimal? GradingRating { get; set; }
    }
}
