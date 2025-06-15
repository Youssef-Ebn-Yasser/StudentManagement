namespace Backend.Entities.Meetings;

public class ZoomParticipant
{
    public int Id { get; set; }
    public string NameEn { get; set; }
    public string NameAr { get; set; }
    public string Email { get; set; }
    public DateTime JoinTime { get; set; }
    public DateTime LeaveTime { get; set; }
    public int Duration { get; set; }

    public int MeetingId { get; set; }
    public Meeting Meeting { get; set; }
}