using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Backend.Constraints;

public class BaseEntityConstraints : IEntityTypeConfiguration<BaseEntity>
{
    public void Configure(EntityTypeBuilder<BaseEntity> builder)
    {
        builder.HasKey(be => be.Id);

        builder.HasIndex(be => be.TitleEn);
        builder.HasIndex(be => be.TitleAr);

        builder.Property(be => be.TitleEn)
               .IsRequired()
               .HasMaxLength(50);

        builder.Property(be => be.TitleAr)
              .IsRequired()
              .HasMaxLength(50);
    }
}