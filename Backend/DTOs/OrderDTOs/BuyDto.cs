namespace Backend.DTOs.OrderDTOs;

public class BuyDto
{
    public int UserId { get; set; }
    public List<int> CoursesIds { get; set; } = new List<int>();
    public string? Code { get; set; }
}