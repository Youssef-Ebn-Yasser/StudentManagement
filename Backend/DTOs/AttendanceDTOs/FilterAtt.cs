using static Backend.Services.Implementation.AttendanceSevice;

namespace Backend.DTOs.AttendanceDTOs;

public class FilterAtt
{
    public int CourseId { get; set; }
    public string CourseName { get; set; }
    public List<showLessionInfo> showLessionInfos { get; set; }
}