using Backend.ChatHubs;
using Backend.Settings;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.OpenApi.Models;
using Stripe;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddSignalR();

builder.Services.Configure<EmailSettings>(builder.Configuration.GetSection("EmailSettings"));

// Dependencies
builder.Services.AddConnectionDependency(builder.Configuration)
                .AddCustomAuthentication(builder.Configuration)
                .AddFilesDependencies(builder.Configuration)
                .AddClassesDependencies();

builder.Services.AddHttpClient();

#region Payment stripe

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
           policy.WithOrigins("http://localhost:5175", "https://localhost:5178",
           "http://127.0.0.1:5500", "http://localhost:5173", "http://localhost:5174", "http://127.0.0.1:5500");
           policy.AllowCredentials();
       });
});
#endregion

#region   chat

// Add SignalR service
builder.Services.AddSignalR();
#endregion


#region   Localization
//builder.Services.AddLocalization(options => options.ResourcesPath = "Resources");
//builder.Configuration
//.AddJsonFile("Resources/Resources.en.json", optional: false, reloadOnChange: true)
//.AddJsonFile("Resources/Resources.ar.json", optional: true, reloadOnChange: true);

//builder.Services.Configure<RequestLocalizationOptions>(options =>
//{
//    var supportedCultures = new[]
//    {
//        new CultureInfo("en"),
//        new CultureInfo("ar")
//    };

//    options.DefaultRequestCulture = new RequestCulture("en");
//    options.SupportedCultures = supportedCultures;
//    options.SupportedUICultures = supportedCultures;
//});

#endregion

builder.Services.Configure<EmailSettings>(builder.Configuration.GetSection("EmailSettings"));


#region authorize

builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "My API", Version = "v1" });

    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        In = ParameterLocation.Header,
        Description = "Enter JWT token",
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "Bearer"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement{
    {
        new OpenApiSecurityScheme{
            Reference = new OpenApiReference{
                Type=ReferenceType.SecurityScheme,
                Id="Bearer"
            }
        },
        new string[]{}
    }});
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

app.UseStaticFiles();


// Auth Middleware
app.UseAuthentication();
app.UseAuthorization();

#region   localization
//app.UseRequestLocalization();
//var localizationOptions = app.Services.GetRequiredService<IOptions<RequestLocalizationOptions>>().Value;
//app.UseRequestLocalization(localizationOptions);

#endregion

// Map SignalR Hub
app.MapHub<ChatHub>("/chatHub"); // The path clients will connect to

app.MapControllers();

app.Run();
