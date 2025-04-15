using Backend.Entities;
using Microsoft.EntityFrameworkCore;

namespace Backend.Context;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
    {

    }

    public DbSet<Student> students { get; set; }
    public DbSet<Course> Courses { get; set; }
    public DbSet<StudentAssignment> StudentAssignments { get; set; }
    public DbSet<Material> Materials { get; set; }
    public DbSet<Teacher> Teachers { get; set; }
    public DbSet<Admin> Admins { get; set; }
    public DbSet<Payment> Payments { get; set; }
    public DbSet<StudentCourse> studentCourses { get; set; }

}