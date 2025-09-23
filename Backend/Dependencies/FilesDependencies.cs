using FileService = Backend.Helper.FileService;

namespace Backend.Dependencies;

public static class FilesDependencies
{
    public static IServiceCollection AddFilesDependencies(this IServiceCollection services, IConfiguration configuration)
    {
        services.Configure<CloudinarySettings>(
        configuration.GetSection("CloudinarySettings"));
        services.AddScoped<IFileService, FileService>();


        return services;
    }
}