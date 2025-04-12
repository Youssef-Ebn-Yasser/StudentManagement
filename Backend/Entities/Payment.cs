namespace Backend.Entities;

public class Payment
{
    [Key] public int Id { get; set; }
    public double Amount { get; set; }
    public string Status { get; set; } = string.Empty;


    public Student Student { get; set; }
    [ForeignKey(nameof(Student))]
    public int StudentId { get; set; }
}