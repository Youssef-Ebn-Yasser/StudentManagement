using Backend.Settings;
using Microsoft.AspNetCore.Authentication.Cookies;
using Stripe;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "Student Management API", Version = "v1" });

    // Add Bearer token authentication
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Enter 'Bearer' [space] and then your token in the text input below.\n\nExample: 'Bearer abc123'"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] {}
        }
    });
});

builder.Services.Configure<EmailSettings>(builder.Configuration.GetSection("EmailSettings"));

// Dependencies
builder.Services.AddConnectionDependency(builder.Configuration)
                .AddCustomAuthentication(builder.Configuration)
                .AddFilesDependencies(builder.Configuration)
                .AddClassesDependencies();

builder.Services.AddHttpClient();

#region Payment tsripe

builder.Services.Configure<StripeSettings>(builder.Configuration.GetSection("Stripe"));
StripeConfiguration.ApiKey = builder.Configuration["Stripe:SecretKey"];

#endregion

#region   Google Authentication
builder.Services.AddAuthentication().AddCookie().AddGoogle(options =>
{
    var clientID = builder.Configuration["Authorization:google:clientId"];
    var clientSecret = builder.Configuration["Authorization:google:clientSecret"];

    if (clientID is null || clientSecret is null)
        throw new ArgumentException("Google config are missing");

    options.ClientId = clientID;
    options.ClientSecret = clientSecret;
    options.SignInScheme = CookieAuthenticationDefaults.AuthenticationScheme;
});
#endregion

#region   CORS
var CORS = "_cors";
builder.Services.AddCors(Options =>
{
    Options.AddPolicy(name: CORS,
       policy =>
       {
           policy.AllowAnyHeader();
           policy.AllowAnyMethod();
           policy.WithOrigins("http://localhost:5175", "http://127.0.0.1:5500", "http://localhost:5173", "http://localhost:5174");
       });
});
#endregion

var app = builder.Build();

//if (app.Environment.IsDevelopment())
//{
//    app.UseSwagger();
//    app.UseSwaggerUI();
//}
app.UseSwagger();
app.UseSwaggerUI();

app.UseHttpsRedirection();

app.UseCors(CORS);

// Auth Middleware
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
