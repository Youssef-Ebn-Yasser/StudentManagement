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

        builder.Property(c => c.CreatedAt)
               .IsRequired();

        builder.Property(c => c.ImagePath)
               .HasMaxLength(250);
    }
}