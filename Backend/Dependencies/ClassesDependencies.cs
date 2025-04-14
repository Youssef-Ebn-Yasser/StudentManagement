namespace Backend.Dependencies;

public static class ClassesDependencies
{
    public static IServiceCollection AddClassesDependencies(this IServiceCollection services)
    {
        services.AddScoped<IUnitOfWork, UnitOfWork>();
        services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>));

        //Configuration Of Auto mapper
        services.AddAutoMapper(Assembly.GetExecutingAssembly());

        services.AddTransient<ICourseService, CourseService>();
       

        return services;
    }
}