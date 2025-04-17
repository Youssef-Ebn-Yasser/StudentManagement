namespace Backend.Entities
{
    public class Comment:BaseEntity
    {
        public string? Content { get; set; } 
        public DateTime CreatedAt { get; set; } = DateTime.Now;

        public bool IsDeleted { get; set; } = false;

        public Student? Student { get; set; }
        [ForeignKey(nameof(Student))]
        public int StudentId { get; set; }

        //public Lesson Lesson { get; set; }
        //[ForeignKey(nameof(Lesson))]
        //public int LessonId { get; set; }
    }
}
