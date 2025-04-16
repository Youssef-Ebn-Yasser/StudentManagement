using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Backend.Constraints;

public class CourseConstraints : IEntityTypeConfiguration<Course>
{
    public void Configure(EntityTypeBuilder<Course> builder)
    { 
        builder.Property(c => c.Description)
               .HasMaxLength(250);

        builder.Property(c => c.Price)
               .IsRequired()
               .HasMaxLength(10);

        builder.Property(c => c.IsDeleted)
                .IsRequired();

        builder.Property(c => c.CreatedAt)
               .IsRequired();

        builder.Property(c => c.ImagePath)
               .HasMaxLength(250);

        builder.HasMany(c => c.lessons)
               .WithOne(l => l.Course)
               .HasForeignKey(l => l.CourseId);

      //  builder.HasOne(c => c.Teacher)
      //      .WithMany(t => t.courses)
      //      .HasForeignKey(c => c.TecherId)
      //      .OnDelete(DeleteBehavior.Restrict);
    }
}
