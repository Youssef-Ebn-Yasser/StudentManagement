namespace Backend.DTOs.MeetingDTOs;

public class MeetingRequestDto
{
    public string Topic { get; set; } = "My Meeting";
    public int Type { get; set; } // 1: Instant, 2: Scheduled, 8: Recurring fixed time
    public DateTime? StartTime { get; set; } // Nullable for instant meetings
    public int Duration { get; set; } = 30; // In minutes

    // Meeting Settings
    public string? Password { get; set; }
    public bool MuteParticipantsUponEntry { get; set; } = false;
    public string? AutoRecording { get; set; } // "local", "cloud", or null

    // For Type 8 (Recurring Meetings)
    public Recurrence? Recurrence { get; set; } = new Recurrence();

    //course id
    public int CourseId { get; set; }
}

public class Recurrence
{
    public int Type { get; set; } // 1: Daily, 2: Weekly, 3: Monthly
    public int RepeatInterval { get; set; } = 1; // For daily/weekly/monthly
    public int? EndTimes { get; set; } // Number of occurrences
    public string? EndDate { get; set; } // End date for recurrence (yyyy-MM-dd)
    public int[]? WeeklyDays { get; set; } // For weekly recurrence (1-7, Sun-Sat)
    public Dictionary<string, string>? WeeklyDaysWithDate { get; set; }
    public int? MonthlyDay { get; set; } // For monthly recurrence by day of month
    public int? MonthlyWeek { get; set; } // For monthly recurrence by week (1-5)
    public int? MonthlyWeekDay { get; set; } // For monthly recurrence by weekday (1-7)
}