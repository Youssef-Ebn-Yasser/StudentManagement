using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Backend.Constraints;

public class CourseConstraints : IEntityTypeConfiguration<Course>
{
    public void Configure(EntityTypeBuilder<Course> builder)
    {
        builder.Property(c => c.DescriptionEn)
               .HasMaxLength(250);

        builder.Property(c => c.DescriptionAr)
               .HasMaxLength(250);

        builder.Property(c => c.Price)
               .IsRequired()
               .HasMaxLength(10);

        builder.Property(c => c.LevelEn)
               .IsRequired()
               .HasMaxLength(50);

        builder.Property(c => c.LevelAr)
               .IsRequired()
               .HasMaxLength(50);

        builder.Property(c => c.Hours)
               .IsRequired()
               .HasMaxLength(30);

        builder.Property(c => c.TecherId)
               .IsRequired();

        builder.Property(c => c.CategoryId)
               .IsRequired();

        builder.Property(c => c.IsDeleted)
               .HasDefaultValue(false);

        builder.Property(c => c.CreatedAt)
                .HasDefaultValueSql("GETDATE()");

       

        builder.Property(c => c.ImagePath)
               .HasMaxLength(250);
    }
}