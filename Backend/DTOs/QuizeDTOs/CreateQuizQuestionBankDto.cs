namespace Backend.DTOs.QuizeDTOs
{
    public class CreateQuizQuestionBankDto
    {
        public int CourseId { get; set; }
        public List<QuestionListDto> QuestionListDtos { get; set; } = new();
    }
}
