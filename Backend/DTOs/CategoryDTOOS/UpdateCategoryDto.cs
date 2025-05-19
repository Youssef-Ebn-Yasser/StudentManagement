namespace Backend.DTOs.CategoryDTOOS
{
    public class UpdateCategoryDto
    {
        [Required]
        public string Name { get; set; }

        public bool IsDeleted { get; set; } = false;
    }
}
