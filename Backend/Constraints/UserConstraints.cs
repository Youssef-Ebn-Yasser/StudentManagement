using Microsoft.EntityFrameworkCore.Metadata.Builders;
namespace Backend.Constraints;
public class UserConstraints : IEntityTypeConfiguration<User>
{   public void Configure(EntityTypeBuilder<User> builder)
    {
        builder.HasKey(u => u.Id);

        builder.HasIndex(u => u.Name)
               .IsUnique();

        builder.Property(u => u.Name)
               .IsRequired()
               .HasMaxLength(50);

        builder.Property(u => u.Age)
               .IsRequired();

        builder.Property(u => u.Email)
               .IsRequired()
               .HasMaxLength(50);

        builder.Property(u => u.Phone)
               .IsRequired()
               .HasMaxLength(11)
               .HasColumnType("char");

        builder.Property(u => u.Password)
               .IsRequired();

        //builder.Property(t => t.CreatedAt)
        //       .HasDefaultValueSql("GETDATE()");

        builder.Property(t => t.IsDeleted)
               .HasDefaultValue(false);

        builder.Property(t => t.ProfileImagePath)
               .IsRequired()
               .HasMaxLength(500);
    }
}