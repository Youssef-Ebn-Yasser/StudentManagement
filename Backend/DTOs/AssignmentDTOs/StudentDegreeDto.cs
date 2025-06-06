namespace Backend.DTOs.AssignmentDTOs
{
    public class StudentDegreeDto
    {
        public int StudentId { get; set; }

        /// <summary>
        /// The student’s numeric grade (0 if not yet graded).
        /// </summary>
        public int Degree { get; set; }
    }
}
