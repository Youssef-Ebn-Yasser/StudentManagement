namespace Backend.DTOs.ChatDTOs;

public class StudntChatForTeacherDto
{
    public string courseName { get; set; }
    public Dictionary<int, string> keyValuePairs { get; set; } = new();
}