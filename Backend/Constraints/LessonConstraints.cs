using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Backend.Constraints;

public class LessonConstraints : IEntityTypeConfiguration<Lesson>
{
    public void Configure(EntityTypeBuilder<Lesson> builder)
    {

        builder.Property(l => l.Description)
               .HasMaxLength(250)
               .IsRequired();

        builder.Property(l => l.IsDeleted)
               .HasDefaultValue(false);

        builder.Property(l => l.CreatedAt)
               .HasDefaultValueSql("getdate()");

        builder.HasMany(l => l.materials)
               .WithOne(m => m.Lesson)
               .HasForeignKey(m => m.LessonId);
              
        builder.HasOne(l => l.Course)
               .WithMany(c => c.lessons)
               .HasForeignKey(l => l.CourseId)
               .OnDelete(DeleteBehavior.Restrict);
    }
}
