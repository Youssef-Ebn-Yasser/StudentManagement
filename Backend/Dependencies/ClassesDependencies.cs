using Microsoft.Extensions.Localization;

namespace Backend.Dependencies;

public static class ClassesDependencies
{
    public static IServiceCollection AddClassesDependencies(this IServiceCollection services)
    {
        services.AddScoped<IUnitOfWork, UnitOfWork>();
        services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>));

        // Configuration Of Auto mapper
        services.AddAutoMapper(Assembly.GetExecutingAssembly());

        // Register IEmailSender service
        services.AddScoped<IEmailSender, EmailSender>();

        // Register ResponseHandler
        services.AddScoped<ResponseHandler>();


        services.AddScoped<IAuthenticationService, AuthenticationService>();
        services.AddTransient<ICourseService, CourseService>();
        services.AddTransient<IStudentService, StudentService>();
        services.AddTransient<IMaterialService, MaterialService>();
        services.AddTransient<ILessonService, LessonService>();
        services.AddTransient<ITeacherService, TeacherService>();
        services.AddTransient<ICategoryService, CategoryService>();
        services.AddTransient<IAuthGoogleService, AuthGoogleService>();
        services.AddTransient<ICommentService, CommentService>();
        services.AddTransient<IStudentAssignmentService, StudentAssignmentService>();
        services.AddTransient<IMeetingService, MeetingService>();
        services.AddTransient<IChatService, ChatService>();
        services.AddTransient<IStructuredLogger, StructuredLogger>();

        //services.AddTransient<IQuizService, QuizService>();
        services.AddTransient<IStructuredLogger, StructuredLogger>();
        services.AddTransient<IReportServices, ReportServices>();



        services.AddTransient<IGeminiObjectTranslator, GeminiObjectTranslator>();


        services.AddScoped<IPhysicalFileUpload, PhysicalFileUpload>();

        services.AddSingleton(typeof(IStringLocalizer<>), typeof(StringLocalizer<>));

        services.AddTransient<GeminiService>();








        return services;
    }
}