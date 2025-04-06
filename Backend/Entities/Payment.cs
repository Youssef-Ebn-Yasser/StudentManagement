namespace Backend.Entities;

public class Payment
{
    [Key] public string Id { get; set; } = string.Empty;
    public double Amount { get; set; }
    public string Status { get; set; } = string.Empty;


    public Student Student { get; set; } = new Student();
    [ForeignKey(nameof(Student))]
    public string StudentId { get; set; } = string.Empty;
}