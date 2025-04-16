using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Backend.Constraints;

public class BaseEntityConstraints : IEntityTypeConfiguration<BaseEntity>
{
    public void Configure(EntityTypeBuilder<BaseEntity> builder)
    {
        builder.HasKey(be => be.Id);

        builder.Property(be => be.Title)
               .IsRequired()
               .HasMaxLength(50);
    }
}
