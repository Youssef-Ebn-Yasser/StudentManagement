using Backend.Entities.Meetings;
using Backend.Entities.QuizeEntities;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;

namespace Backend.Context;

public class ApplicationDbContext : IdentityDbContext<User, IdentityRole<int>, int>
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
    {


    }

    public DbSet<User> Users { get; set; }
    public DbSet<Course> Courses { get; set; }
    public DbSet<Material> Materials { get; set; }
    public DbSet<StudentAssignment> StudentAssignments { get; set; }
    public DbSet<Payment> Payments { get; set; }
    public DbSet<Comment> Comment { get; set; }
    public DbSet<Lesson> Lessons { get; set; }
    public DbSet<StudentCourse> studentCourses { get; set; }
    public DbSet<RefreshToken> RefreshTokens { get; set; }
    public DbSet<Category> Categories { get; set; }
    public DbSet<Quiz> Quizzes { get; set; }
    public DbSet<Question> Questions { get; set; }
    public DbSet<StudentQuizeAnswer> studentQuizeAnswers { get; set; }
    public DbSet<QuestionOption> QuestionOptions { get; set; }
    public DbSet<StudentQuestionAnswer> StudentQuestionAnswers { get; set; }
    public DbSet<StudentQuestionOption> StudentQuestionOptions { get; set; }


    public DbSet<Meeting> Meetings { get; set; }
    public DbSet<ManualPayment> ManualPayments { get; set; }
    public DbSet<PaymentSettings> PaymentSettings { get; set; }


    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<User>()
       .HasDiscriminator<string>("UserType")
       .HasValue<User>("User")
       .HasValue<Student>("Student")
       .HasValue<Teacher>("Teacher")
       .HasValue<Admin>("Admin");
        //modelBuilder.ApplyConfiguration(new UserConstraints());
        //modelBuilder.ApplyConfiguration(new StudentConstraints());
        //// modelBuilder.ApplyConfiguration(new CourseConstraints());
        //// modelBuilder.ApplyConfiguration(new AssignmentConstraints());
        //// modelBuilder.ApplyConfiguration(new MaterialConstraints());
        //modelBuilder.ApplyConfiguration(new TeacherConstraints());
        //// modelBuilder.ApplyConfiguration(new AdminConstraints());
        //// modelBuilder.ApplyConfiguration(new PaymentConstraints());
        //modelBuilder.ApplyConfiguration(new StudentCourseConstraints());
        //modelBuilder.ApplyConfiguration(new CommentConstraints());

        // override the defaults
        modelBuilder.Entity<IdentityRole>().ToTable("Roles");
        modelBuilder.Entity<IdentityUserRole<int>>().ToTable("UserRoles");
        modelBuilder.Entity<IdentityUserClaim<int>>().ToTable("UserClaims");
        modelBuilder.Entity<IdentityUserLogin<int>>().ToTable("UserLogins");
        modelBuilder.Entity<IdentityRoleClaim<int>>().ToTable("RoleClaims");
        modelBuilder.Entity<IdentityUserToken<int>>().ToTable("UserTokens");
    }
}
