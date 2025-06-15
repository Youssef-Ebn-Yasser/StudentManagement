using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Backend.Constraints;

public class MaterialConstraints : IEntityTypeConfiguration<Material>
{
    public void Configure(EntityTypeBuilder<Material> builder)
    {
        builder.Property(m => m.ContentEn)
               .IsRequired()
               .HasMaxLength(500);

        builder.Property(m => m.ContentAr)
               .IsRequired()
               .HasMaxLength(500);

        builder.Property(m => m.IsDeleted)
                .IsRequired();

        builder.Property(m => m.Path)
               .IsRequired()
               .HasMaxLength (250);

        builder.Property(m => m.CreatedAt)
               .IsRequired();
    }
}
