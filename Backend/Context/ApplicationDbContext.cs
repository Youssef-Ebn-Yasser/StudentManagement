using Backend.Constraints;
using Backend.Entities;
using Microsoft.EntityFrameworkCore;
namespace Backend.Context;
public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
    {

    }
<<<<<<< HEAD
    public DbSet<Student> Students { get; set; }
   // public DbSet<Course> Courses { get; set; }
   // public DbSet<Assignment> Assignments { get; set; }
   // public DbSet<Material> Materials { get; set; }
=======

    public DbSet<Student> students { get; set; }
    public DbSet<Course> Courses { get; set; }
    public DbSet<StudentAssignment> StudentAssignments { get; set; }
    public DbSet<Material> Materials { get; set; }
>>>>>>> origin/HasnaaHassan
    public DbSet<Teacher> Teachers { get; set; }
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

}