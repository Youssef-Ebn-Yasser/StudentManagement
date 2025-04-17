<<<<<<< HEAD
﻿using Microsoft.AspNetCore.Identity.EntityFrameworkCore;

namespace Backend.Context;

public class ApplicationDbContext : IdentityDbContext<IdentityUser>
=======
﻿using Backend.Constraints;
using Backend.Entities;
using Microsoft.EntityFrameworkCore;
namespace Backend.Context;
public class ApplicationDbContext : DbContext
>>>>>>> First Commit Renad Emad
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
    {

    }
    public DbSet<Student> Students { get; set; }
   // public DbSet<Course> Courses { get; set; }
   // public DbSet<Assignment> Assignments { get; set; }
   // public DbSet<Material> Materials { get; set; }
    public DbSet<Teacher> Teachers { get; set; }
<<<<<<< HEAD
    public DbSet<Admin> Admins { get; set; }
    public DbSet<Payment> Payments { get; set; }
    public DbSet<StudentCourse> studentCourses { get; set; }
    public DbSet<RefreshToken> RefreshTokens { get; set; }
=======
   // public DbSet<Admin> Admins { get; set; }
   // public DbSet<Payment> Payments { get; set; }
    public DbSet<StudentCourse> StudentCourses { get; set; }
    public DbSet<Comment> Comments { get; set; }

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

    }
>>>>>>> First Commit Renad Emad

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