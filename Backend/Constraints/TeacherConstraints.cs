using Microsoft.EntityFrameworkCore.Metadata.Builders;
namespace Backend.Constraints
{
    public class TeacherConstraints : IEntityTypeConfiguration<Teacher>
    {
        public void Configure(EntityTypeBuilder<Teacher> builder)
        {

            builder.Property(t => t.Education)
                   .IsRequired()
                   .HasMaxLength(200);

            builder.Property(t => t.Age)
                   .IsRequired()
                   .HasAnnotation("MinimumAge", 20);

            builder.Property(t => t.AdditionalInfo)
                   .HasMaxLength(500);

            builder.Property(t => t.Experience)
                   .IsRequired()
                   .HasMaxLength(200);

            builder.Property(t => t.Specialization)
                   .IsRequired()
                   .HasMaxLength(100);

            builder.Property(t => t.CVPath)
                   .IsRequired()
                   .HasMaxLength(500);

        }
    }
}

