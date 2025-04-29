using Backend.DTOs;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;

namespace Backend.Context;

public class ApplicationDbContext : IdentityDbContext<IdentityUser>
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
    {

    }

    public DbSet<Student> Students { get; set; }
    public DbSet<Course> Courses { get; set; }
    public DbSet<Material> Materials { get; set; }
    public DbSet<StudentAssignment> StudentAssignments { get; set; }
    public DbSet<Teacher> Teachers { get; set; }
    public DbSet<Admin> Admins { get; set; }
    public DbSet<Payment> Payments { get; set; }
    public DbSet<StudentCourse> studentCourses { get; set; }
    public DbSet<RefreshToken> RefreshTokens { get; set; }
    public DbSet<CheatEvent> CheatEvents { get; set; }


    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.ApplyConfiguration(new UserConstraints());
        modelBuilder.ApplyConfiguration(new StudentConstraints());
        // modelBuilder.ApplyConfiguration(new CourseConstraints());
        // modelBuilder.ApplyConfiguration(new AssignmentConstraints());
        // modelBuilder.ApplyConfiguration(new MaterialConstraints());
        modelBuilder.ApplyConfiguration(new TeacherConstraints());
        // modelBuilder.ApplyConfiguration(new AdminConstraints());
        // modelBuilder.ApplyConfiguration(new PaymentConstraints());
        modelBuilder.ApplyConfiguration(new StudentCourseConstraints());
        modelBuilder.ApplyConfiguration(new CommentConstraints());

        // override the defaults
        modelBuilder.Entity<IdentityUser>().ToTable("Users");
        modelBuilder.Entity<IdentityRole>().ToTable("Roles");
        modelBuilder.Entity<IdentityUserRole<string>>().ToTable("UserRoles");
        modelBuilder.Entity<IdentityUserClaim<string>>().ToTable("UserClaims");
        modelBuilder.Entity<IdentityUserLogin<string>>().ToTable("UserLogins");
        modelBuilder.Entity<IdentityRoleClaim<string>>().ToTable("RoleClaims");
        modelBuilder.Entity<IdentityUserToken<string>>().ToTable("UserTokens");
    }
}