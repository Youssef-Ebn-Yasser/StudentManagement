namespace Backend.DTOs.StudentDOs;

public class ForAddStudentToCourseDependenciesDto
{
    public List<CourseDependencies>? CourseDependencies { get; set; }
    public List<StudentDependencies>? StudentDependencies { get; set; }
}

public class StudentDependencies
{
    public int StudentId { get; set; }
    public string StudentName { get; set; } = string.Empty;

}

public class CourseDependencies
{
    public int CourseId { get; set; }
    public string Coursename { get; set; } = string.Empty;
}