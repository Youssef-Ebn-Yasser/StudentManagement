using Backend.DTOs.MeetingDTOs;
using Backend.Entities.Meetings;

namespace Backend.Services.Interfaces;

public interface IMeetingService
{
    public string Authorize();
    public Task<string> Callback(string code);
    public Task<Response<string>> CreateMeeting(MeetingRequestDto request);
    public (bool, string) CheckAuth();
    public Task<Response<List<MeetingDetailsResponse>>> GetMeetingsForCourse(int courseId);

}

public class MeetingDetailsResponse
{
    public EnMeetingType Type { get; set; }
    public DateTime? StartTime { get; set; }
    public int? Duration { get; set; } = 30;
    public string ZoomMeetingId { get; set; } = string.Empty;
    public string Topic { get; set; } = string.Empty;
    public string JoinUrl { get; set; } = string.Empty;
    public string? Password { get; set; }
    // if type 8
    public int RepeatInterval { get; set; } = 1;  // daily/weekly/monthly
    public int[]? WeeklyDays { get; set; } // For weekly recurrence (1-7, Sun-Sat)
    public int? MonthlyDay { get; set; } // For monthly recurrence by day of month
    public int? MonthlyWeek { get; set; } // For monthly recurrence by week (1-5)
    public int? MonthlyWeekDay { get; set; } // For monthly recurrence by weekday (1-7)

    public Dictionary<string, string>? WeeklyDaysWithDate { get; set; }
}