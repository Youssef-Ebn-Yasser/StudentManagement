using Backend.Context;

namespace Backend.Dependencies;

public static class ConnectionDependency
{
    public static IServiceCollection AddConnectionDependency(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddDbContext<ApplicationDbContext>(options =>
        options.UseSqlServer(configuration.GetConnectionString("DefaultConnection")));

        //        services.AddDbContext<ApplicationDbContext>(options =>
        //        options.UseSqlServer(configuration.GetConnectionString("DefaultConnection"),
        //sqlOptions => sqlOptions.EnableRetryOnFailure()));

        return services;
    }
}