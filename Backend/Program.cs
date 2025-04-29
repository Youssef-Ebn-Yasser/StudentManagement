using Backend.Settings;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.Configure<EmailSettings>(builder.Configuration.GetSection("EmailSettings"));

// Dependencies
builder.Services.AddConnectionDependency(builder.Configuration)
                .AddCustomAuthentication(builder.Configuration)
                .AddFilesDependencies(builder.Configuration)
                .AddClassesDependencies();

builder.Services.AddHttpClient();



//#region   CORS
//var CORS = "_cors";
//builder.Services.AddCors(options =>
//{
//    options.AddPolicy(name: CORS,
//       policy =>
//       {
//           policy.AllowAnyHeader()
//                 .AllowAnyMethod()
//                 .SetIsOriginAllowed(origin =>
//                 {
//                     return !string.IsNullOrEmpty(origin) && origin.Contains("localhost");
//                 })
//                 .AllowCredentials();
//       });
//});
//#endregion

#region   CORS
var CORS = "_cors";
builder.Services.AddCors(Options =>
{
    Options.AddPolicy(name: CORS,
       policy =>
       {
           policy.AllowAnyHeader();
           policy.AllowAnyMethod();
           policy.WithOrigins("*");
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

app.Use(async (context, next) =>
{
    if (context.Request.Method == "OPTIONS")
    {
        context.Response.StatusCode = 200;
        await context.Response.CompleteAsync();
    }
    else
    {
        await next();
    }
});

app.UseCors(CORS);


app.UseHttpsRedirection();


// Auth Middleware
app.UseAuthentication();
app.UseAuthorization();


app.MapControllers();

app.Run();