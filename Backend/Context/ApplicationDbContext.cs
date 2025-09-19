using Backend.Constraints;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;

namespace Backend.Context;

public class ApplicationDbContext : IdentityDbContext<User, IdentityRole<int>, int>
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
    {


    }

    public DbSet<User> Users { get; set; }
    public DbSet<Student> Students { get; set; }
    public DbSet<StudentAttendance> StudentAttendances { get; set; }
    public DbSet<Teacher> Teachers { get; set; }
    public DbSet<Course> Courses { get; set; }
    public DbSet<Material> Materials { get; set; }
    public DbSet<StudentAssignment> StudentAssignments { get; set; }

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
    public DbSet<ZoomParticipant> ZoomParticipants { get; set; }

    public DbSet<ChatRoom> ChatRooms { get; set; }
    public DbSet<ChatMessage> ChatMessages { get; set; }
    public DbSet<ManualPayment> ManualPayments { get; set; }
    public DbSet<PaymentSettings> PaymentSettings { get; set; }
    public DbSet<MeetingAttendance> MeetingAttendances { get; set; }

    public DbSet<Slider> Sliders { get; set; }
    public DbSet<VedioesDetails> VedioesDetails { get; set; }
    public DbSet<Voucher> vouchers { get; set; }
    public DbSet<testTable> testTable { get; set; }

    public DbSet<Payment> Payments { get; set; }
    public DbSet<Backend.Entities.OrderTable> Orders { get; set; }
    public DbSet<OrderItem> OrderItems { get; set; }
    public DbSet<SystemLog> SystemLogs { get; set; }





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

        modelBuilder.ConfigureVoucher();





        #region chat 
        // Configure ChatRoom relationships
        modelBuilder.Entity<ChatRoom>()
            .HasOne(cr => cr.Teacher)
            .WithMany() // Assuming ApplicationUser doesn't have a direct collection of ChatRooms (as teacher)
            .HasForeignKey(cr => cr.TeacherId)
            .OnDelete(DeleteBehavior.Restrict); // Prevent cascade delete if user is deleted

        modelBuilder.Entity<ChatRoom>()
            .HasOne(cr => cr.Student)
            .WithMany() // Assuming ApplicationUser doesn't have a direct collection of ChatRooms (as student)
            .HasForeignKey(cr => cr.StudentId)
            .OnDelete(DeleteBehavior.Restrict); // Prevent cascade delete if user is deleted

        // Ensure unique combination of TeacherId and StudentId for a chat room
        modelBuilder.Entity<ChatRoom>()
            .HasIndex(cr => new { cr.TeacherId, cr.StudentId })
            .IsUnique();

        // Configure ChatMessage relationships
        modelBuilder.Entity<ChatMessage>()
            .HasOne(cm => cm.ChatRoom)
            .WithMany(cr => cr.Messages)
            .HasForeignKey(cm => cm.ChatRoomId)
            .OnDelete(DeleteBehavior.Cascade); // If a chat room is deleted, delete its messages

        modelBuilder.Entity<ChatMessage>()
            .HasOne(cm => cm.Sender)
            .WithMany() // Assuming ApplicationUser doesn't have a direct collection of ChatMessages (as sender)
            .HasForeignKey(cm => cm.SenderId)
            .OnDelete(DeleteBehavior.Restrict);
        #endregion
    }
}


public class testTable
{
    public int Id { get; set; }
    public string Name { get; set; }

}