using Microsoft.EntityFrameworkCore.Metadata.Builders;
namespace Backend.Constraints;
public class CommentConstraints : IEntityTypeConfiguration<Comment>
{
    public void Configure(EntityTypeBuilder<Comment> builder)
    {
        builder.HasKey(c => c.Id);

        builder.Property(c => c.Content)
               .IsRequired()
               .HasMaxLength(500);

        //builder.Property(c => c.CreatedAt)
        //       .HasDefaultValue("GETDATE()");

        builder.Property(c => c.IsDeleted)
               .HasDefaultValue(false);
    }
}
