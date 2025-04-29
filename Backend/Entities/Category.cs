namespace Backend.Entities
{
    public class Category
    {
        public int Id { get; set; }

        public string? CategoryName {  get; set; }

        public bool IsDeleted { get; set; }

        public List<Course>? Courses { get; set; }

    }
}
