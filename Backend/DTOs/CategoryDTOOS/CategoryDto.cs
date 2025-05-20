namespace Backend.DTOs.CategoryDTOOS;

public class CategoryDto
{
    public int Id { get; set; }
    [Required]
    public string Name { get; set; }
}