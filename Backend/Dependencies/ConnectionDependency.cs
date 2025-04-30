using Backend.Context;

namespace Backend.Dependencies;

public static class ConnectionDependency
{
    public static IServiceCollection AddConnectionDependency(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddDbContext<ApplicationDbContext>(options =>
        options.UseSqlServer(configuration.GetConnectionString("DefaultConnection")));
        services.AddIdentity<User, IdentityRole<int>>()
            .AddEntityFrameworkStores<ApplicationDbContext>()
            .AddDefaultTokenProviders();
        //        services.AddDbContext<ApplicationDbContext>(options =>
        //        options.UseSqlServer(configuration.GetConnectionString("DefaultConnection"),
        //sqlOptions => sqlOptions.EnableRetryOnFailure()));

        return services;
    }
}
