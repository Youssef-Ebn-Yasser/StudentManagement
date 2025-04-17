using Microsoft.EntityFrameworkCore.Metadata.Builders;
namespace Backend.Constraints
{
    public class StudentCourseConstraints : IEntityTypeConfiguration<StudentCourse>
    {
        public void Configure(EntityTypeBuilder<StudentCourse> builder)
        {
            builder.HasKey(sc => sc.Id);

            //builder.Property(sc => sc.EnrollmentDate)
            //       .HasDefaultValue("GETDATE()");

            builder.Property(sc=> sc.IsDeleted)
                   .HasDefaultValue(false);

            builder.HasOne(sc => sc.Student)
                   .WithMany(s => s.StudentCourses)
                   .HasForeignKey(sc => sc.StudentId)
                   .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(sc => sc.Course)
                   .WithMany(c => c.studentCourses)
                   .HasForeignKey(sc => sc.CourseId)
                   .OnDelete(DeleteBehavior.Restrict);
        }

        
    }
    
    
}
