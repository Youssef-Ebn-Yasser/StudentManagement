using Microsoft.AspNetCore.Identity.EntityFrameworkCore;

namespace Backend.Context;

public class ApplicationDbContext : IdentityDbContext<IdentityUser>
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
    {

    }

    public DbSet<Student> students { get; set; }
    public DbSet<Course> Courses { get; set; }
    public DbSet<Assignment> Assignments { get; set; }
    public DbSet<Material> Materials { get; set; }
    public DbSet<Teacher> Teachers { get; set; }
    public DbSet<Admin> Admins { get; set; }
    public DbSet<Payment> Payments { get; set; }
    public DbSet<StudentCourse> studentCourses { get; set; }
    public DbSet<RefreshToken> RefreshTokens { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);
        
        // override the defaults
        builder.Entity<IdentityUser>().ToTable("Users");
        builder.Entity<IdentityRole>().ToTable("Roles");
        builder.Entity<IdentityUserRole<string>>().ToTable("UserRoles");
        builder.Entity<IdentityUserClaim<string>>().ToTable("UserClaims");
        builder.Entity<IdentityUserLogin<string>>().ToTable("UserLogins");
        builder.Entity<IdentityRoleClaim<string>>().ToTable("RoleClaims");
        builder.Entity<IdentityUserToken<string>>().ToTable("UserTokens");
    }
}