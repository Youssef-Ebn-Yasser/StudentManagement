using Backend.Context;

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

        // services.AddTransient<ICourseService, CourseService>();
        // services.AddTransient<IAssignmentServices, AssignmentServices>();
        services.AddScoped<IAuthenticationService, AuthenticationService>();

        return services;
    }
}