namespace Backend.Entities.Meetings;

public class Meeting
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public string ZoomMeetingId { get; set; } = string.Empty;
    public string TopicEn { get; set; } = string.Empty;
    public string TopicAr { get; set; }
    public string JoinUrl { get; set; } = string.Empty;
    public string? Password { get; set; }
    public EnMeetingType Type { get; set; }

    // For Type 2 (Scheduled)
    public DateTime? StartTime { get; set; }
    public int? Duration { get; set; }

    // For Type 8 (Recurring) - Storing the full recurrence object as JSON
    public string? RecurrenceDetailsJson { get; set; }
    public int? Occurrences { get; set; } // Number of times it will occur (from EndTimes in Recurrence)
    public string? DaysThatRepeat { get; set; } // e.g., "Daily", "Weekly: Mon, Wed, Fri"
    public string? WeeklyDaysWithDateSerialized { get; set; }

    // Meeting Settings
    public bool MuteParticipantsUponEntry { get; set; }
    public string? AutoRecording { get; set; } // "local", "cloud", or null
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public int CourseID { get; set; }
    public Course Course { get; set; }
}

public enum EnMeetingType { Imidiate = 1, Scheduled = 2, ReusableLink = 8 }