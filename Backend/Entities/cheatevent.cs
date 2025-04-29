namespace Backend.Entities
{
    public class CheatEvent
    {
        public int EventId { get; set; }
        public int UserId { get; set; }
        public int ExamId { get; set; }
        public DateTime Timestamp { get; set; }
        public string EventType { get; set; }
    }
}

