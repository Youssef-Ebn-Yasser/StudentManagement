using Microsoft.EntityFrameworkCore.Metadata.Builders;
namespace Backend.Constraints;

public class TeacherConstraints : IEntityTypeConfiguration<Teacher>
{
    public void Configure(EntityTypeBuilder<Teacher> builder)
    {

        builder.Property(t => t.Age)
               .HasAnnotation("MinimumAge", 20);

        builder.Property(t => t.AdditionalInfoEn)
               .HasMaxLength(500);

        builder.Property(t => t.AdditionalInfoAr)
               .HasMaxLength(500);

        builder.Property(t => t.SpecializationEn)
               .IsRequired()
               .HasMaxLength(100);

        builder.Property(t => t.SpecializationAr)
               .IsRequired()
               .HasMaxLength(100);

        builder.Property(t => t.Phone)
               .HasMaxLength(11)
               .IsRequired(false);
    }
}