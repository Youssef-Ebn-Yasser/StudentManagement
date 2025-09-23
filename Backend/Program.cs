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
builder.Services.AddScoped<IPaymobService, PaymobService>();
builder.Services.AddScoped<IReportServices, ReportServices>();
builder.Services.AddTransient<IStructuredLogger, StructuredLogger>();



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
           "http://127.0.0.1:5500", "http://localhost:5173", "http://localhost:5174", "http://127.0.0.1:5500",
           "https://mega-project-h5z7.vercel.app");
           policy.AllowCredentials();
       });
});
#endregion

#region   chat

// Add SignalR service
builder.Services.AddSignalR();
#endregion


#region     HangFire
builder.Services.AddHangfire(config =>
{
    config.UseSqlServerStorage(builder.Configuration.GetConnectionString("DefaultConnection"));
});
builder.Services.AddHangfireServer();
#endregion

#region   Localization
// Add JSON-based localization
builder.Services.AddJsonLocalization(options =>
{
    options.ResourcesPath = "Resources";
});

builder.Services.AddControllersWithViews()
    .AddViewLocalization()
    .AddDataAnnotationsLocalization();

builder.Services.Configure<RequestLocalizationOptions>(options =>
{
    var supportedCultures = new[] { "en", "ar" };

    options.SetDefaultCulture("en");
    options.AddSupportedCultures(supportedCultures);
    options.AddSupportedUICultures(supportedCultures);
    options.RequestCultureProviders.Insert(0, new QueryStringRequestCultureProvider());
});
builder.Services.AddSingleton<IStringLocalizer>(sp =>
{
    var factory = sp.GetRequiredService<IStringLocalizerFactory>();
    return factory.Create("Messages", Assembly.GetExecutingAssembly().GetName().Name);

});
#endregion

builder.Services.Configure<EmailSettings>(builder.Configuration.GetSection("EmailSettings"));
builder.Services.Configure<ApplicationSettings>(builder.Configuration.GetSection("ApplicationSettings"));



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




#region   Serilog
var columnOptions = new ColumnOptions
{
    AdditionalColumns = new Collection<SqlColumn>
    {
        new SqlColumn { ColumnName = "UserName", DataType = SqlDbType.NVarChar, DataLength = 100, AllowNull = true },
        new SqlColumn { ColumnName = "UserRole", DataType = SqlDbType.NVarChar, DataLength = 100, AllowNull = true },
        new SqlColumn { ColumnName = "LogType", DataType = SqlDbType.Int, AllowNull = true },
        new SqlColumn { ColumnName = "Email", DataType = SqlDbType.NVarChar, DataLength = 100, AllowNull = true },
        new SqlColumn { ColumnName = "IPAddress", DataType = SqlDbType.NVarChar, DataLength = 300, AllowNull = true },
        new SqlColumn { ColumnName = "Path", DataType = SqlDbType.NVarChar, DataLength = 300, AllowNull = true },
        new SqlColumn { ColumnName = "Method", DataType = SqlDbType.NVarChar, DataLength = 300, AllowNull = true },
        new SqlColumn { ColumnName = "City", DataType = SqlDbType.NVarChar, DataLength = 300, AllowNull = true },
        new SqlColumn { ColumnName = "Region", DataType = SqlDbType.NVarChar, DataLength = 300, AllowNull = true },
        new SqlColumn { ColumnName = "Country", DataType = SqlDbType.NVarChar, DataLength = 300, AllowNull = true },
        new SqlColumn { ColumnName = "Location", DataType = SqlDbType.NVarChar, DataLength = 300, AllowNull = true },
        new SqlColumn { ColumnName = "Organization", DataType = SqlDbType.NVarChar, DataLength = 300, AllowNull = true },
        new SqlColumn { ColumnName = "LogHappenIn", DataType = SqlDbType.Int, AllowNull = true },
        new SqlColumn { ColumnName = "LogHappenInId", DataType = SqlDbType.Int, AllowNull = true },
    }
};

Log.Logger = new LoggerConfiguration()
    .MinimumLevel.Override("Microsoft", LogEventLevel.Error)
    .MinimumLevel.Information()
    .Enrich.FromLogContext()
    .WriteTo.Console()
    .WriteTo.MSSqlServer(
        connectionString: builder.Configuration.GetConnectionString("DefaultConnection"),
        sinkOptions: new MSSqlServerSinkOptions
        {
            TableName = "SystemLogs",
            AutoCreateSqlTable = true
        },
        columnOptions: columnOptions
    )
    .CreateLogger();
#endregion

builder.Services.AddControllers();





var app = builder.Build();




//if (app.Environment.IsDevelopment())
//{
//    app.UseSwagger();
//    app.UseSwaggerUI();
//}
app.UseSwagger();
app.UseSwaggerUI();

//app.UseHttpsRedirection();

app.UseCors(CORS);


app.UseStaticFiles();

// Auth Middleware
app.UseAuthentication();
app.UseAuthorization();

#region   localization
var locOptions = app.Services.GetRequiredService<IOptions<RequestLocalizationOptions>>();
app.UseRequestLocalization(locOptions.Value);
//app.UseRequestLocalization();
#endregion

#region   Hangfire
app.UseHangfireDashboard(); // URL: /hangfire
#endregion

// Map SignalR Hub
app.MapHub<ChatHub>("/chatHub"); // The path clients will connect to

app.MapControllers();

app.Run();
