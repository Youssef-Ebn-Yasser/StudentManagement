using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Backend.Constraints;

public class CategoryConstraints : IEntityTypeConfiguration<Category>
{
    public void Configure(EntityTypeBuilder<Category> builder)
    {
        builder.HasKey(c => c.Id);

        builder.HasIndex(c => c.CategoryNameEn);
        builder.HasIndex(c => c.CategoryNameAr);


        builder.Property(c => c.CategoryNameEn)
               .IsRequired()
               .HasMaxLength(50);

        builder.Property(c => c.CategoryNameAr)
               .IsRequired()
               .HasMaxLength(50);

        builder.Property(c => c.IsDeleted)
               .HasDefaultValue(false);

        builder.HasMany(c => c.Courses)
               .WithOne(c => c.Category)
               .HasForeignKey(c => c.CategoryId);
    }
}