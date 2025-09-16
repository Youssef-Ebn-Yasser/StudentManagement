using Microsoft.EntityFrameworkCore.Metadata.Builders;
namespace Backend.Constraints;
public class UserConstraints : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        builder.HasKey(u => u.Id);

        builder.HasIndex(u => u.NameEn);
        builder.HasIndex(u => u.NameAr);
        builder.HasIndex(u => u.Email);



        builder.Property(u => u.NameEn)
               .IsRequired()
               .HasMaxLength(50);

        builder.Property(u => u.NameAr)
               .IsRequired()
               .HasMaxLength(50);

        builder.Property(u => u.Email)
               .IsRequired()
               .HasMaxLength(50);

        builder.Property(t => t.IsDeleted)
               .HasDefaultValue(false);

        builder.Property(t => t.CreatedAt)
               .HasDefaultValueSql("GETDATE()");
    }
}