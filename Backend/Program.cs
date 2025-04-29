using Backend.Hubs;
using ElearningApi.Services;
using Microsoft.OpenApi.Models;
using Microsoft.EntityFrameworkCore;
using System;
using Microsoft.Azure.CognitiveServices.Vision.Face;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddSignalR();
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.Configure<EmailSettings>(builder.Configuration.GetSection("EmailSettings"));

// Dependencies
builder.Services.AddConnectionDependency(builder.Configuration)
                .AddCustomAuthentication(builder.Configuration)

                .AddClassesDependencies();
builder.Services.AddSingleton(sp =>
{
    var config = sp.GetRequiredService<IConfiguration>();
    return new FaceClient(new ApiKeyServiceClientCredentials(config["AzureFace:Key"]))
    {
        Endpoint = config["AzureFace:Endpoint"]
    };
});

// Dependency Injection for services
builder.Services.AddScoped<IFaceService, FaceService>();
builder.Services.AddScoped<IChatbotService, OpenAIService>();
builder.Services.AddScoped<IRecommendationService, RecommendationService>();


var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthentication();    // Auth middleware
app.UseAuthorization();     // Role/policy middleware

app.MapControllers();       // Map Web API routes
app.MapHub<ProctorHub>("/hub/proctor");  // SignalR Hub endpoint

app.Run();
