namespace Backend.DTOs.AssignmentDTOs
{
    public class AssignmentSummaryDto
    {
        
            /// <summary>
            /// The primary key of the StudentAssignment record.
            /// </summary>
            public int StudentAssignmentId { get; set; }

            /// <summary>
            /// The student’s full name (e.g. “John Doe”).
            /// </summary>
            public string StudentName { get; set; } = null!;
        }
}
