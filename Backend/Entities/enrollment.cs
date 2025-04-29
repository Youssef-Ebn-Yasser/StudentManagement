namespace Backend.Entities
{
    public class Enrollment
    {
        public int EnrollmentId { get; set; }
        public int UserId { get; set; }
        public int CourseEntityId { get; set; }

        public User User { get; set; }
        public CourseEntity CourseEntity { get; set; } // Ensure CourseEntity is defined in the correct namespace.
    }
}
