using System;
namespace Backend.DTOs
{
    public class Attendance
    {
     
            [Required]
            public int StudentId { get; set; }

            [Required]
            public DateTime Date { get; set; }

            [Required]
            public bool IsPresent { get; set; }
        
    }

}


