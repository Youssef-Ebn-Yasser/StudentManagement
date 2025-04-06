using Backend.Context;
using Microsoft.EntityFrameworkCore;

namespace Backend.Dependencies;

public static class ConnectionDependency
{
    public static IServiceCollection AddConnectionDependency(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddDbContext<ApplicationDbContext>(options =>
        options.UseSqlServer(configuration.GetConnectionString("DefaultConnection")));


        return services;
    }
}