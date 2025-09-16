namespace Backend.DTOs.DependenciesDTOs;

public class ForAddCourseDependenciesDto
{
    public List<TeacherDependencies>? TeacherDependencies1 { get; set; }
    public List<CategoryDependencies>? CategoryDependencies { get; set; }
}

public class TeacherDependencies
{
    public int TeacherId { get; set; }
    public string? TeacherName { get; set; }

}

public class CategoryDependencies
{
    public int CategoryId { get; set; }
    public string? Categoryname { get; set; }
}