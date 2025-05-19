using Microsoft.EntityFrameworkCore.Metadata.Builders;
namespace Backend.Constraints
{
    public class StudentConstraints : IEntityTypeConfiguration<Student>
    {
        public void Configure(EntityTypeBuilder<Student> builder)
        {

            builder.Property(s=> s.PhoneNumber)
                   .HasMaxLength(11)
                   .IsRequired();

            builder.Property(s => s.GithubLink)
                     .IsRequired(false);

            builder.Property(s => s.LinkedInLink)
                        .IsRequired(false);

            builder.Property(s => s.TelegramLink)
                        .IsRequired(false);

            builder.HasMany(s => s.StudentCourses)
                   .WithOne(sc => sc.Student)
                   .HasForeignKey(sc => sc.StudentId)
                   .OnDelete(DeleteBehavior.Restrict);

            builder.HasMany(s => s.Payments)
                   .WithOne(p => p.Student)
                   .HasForeignKey(p => p.StudentId)
                   .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
