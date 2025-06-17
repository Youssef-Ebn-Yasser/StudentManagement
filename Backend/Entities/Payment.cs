namespace Backend.Entities;
public class Payment
{
    [Key] public int Id { get; set; }
    public double Amount { get; set; }
    public string StatusEn { get; set; } = string.Empty;
    public string StatusAr { get; set; } = string.Empty;
    public DateTime PaymentDate { get; set; }
    public DateTime CompleteDate { get; set; } = DateTime.Now;
    public string Currency { get; set; } = string.Empty;

    [ForeignKey("StudentId")]
    public Student? Student { get; set; }
    public int? StudentId { get; set; }

    [ForeignKey("CourseId")]
    public Course? Course { get; set; }
    public int? CourseId { get; set; }
}