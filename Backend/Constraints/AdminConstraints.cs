using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Backend.Constraints;

public class AdminConstraints : IEntityTypeConfiguration<Admin>
{
    public void Configure(EntityTypeBuilder<Admin> builder)
    {
        builder.Property(a => a.NationalId)
               .IsRequired()
               .HasMaxLength(14);
    }
}
