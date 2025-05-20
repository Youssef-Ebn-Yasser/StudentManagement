using Microsoft.EntityFrameworkCore.Metadata.Builders;
namespace Backend.Constraints;
public class UserConstraints : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        builder.HasKey(u => u.Id);


        builder.Property(u => u.Name)
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