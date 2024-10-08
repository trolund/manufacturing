using System;
using System.IO;
using System.Reflection;
using Manufacturing.Api.Hubs;
using Manufacturing.Data.Contexts;
using Manufacturing.Data.Mappings;
using Manufacturing.Data.Models;
using Manufacturing.Data.Repositories;
using Manufacturing.Data.Repositories.Interface;
using Manufacturing.Data.Repositories.UnitOfWork;
using Manufacturing.Services;
using Manufacturing.Services.Interfaces;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.OpenApi.Models;

namespace Manufacturing.Api;

public class Startup
{
    private readonly IWebHostEnvironment _environment;

    public Startup(IWebHostEnvironment env)
    {
        _environment = env;

        var builder = new ConfigurationBuilder().SetBasePath(env.ContentRootPath)
            .AddJsonFile("appsettings.json", false, true)
            .AddJsonFile($"appsettings.{env.EnvironmentName}.json", true)
            .AddEnvironmentVariables();
        Configuration = builder.Build();
    }

    public IConfigurationRoot Configuration { get; }

    // This method gets called by the runtime. Use this method to add services to the container.
    public void ConfigureServices(IServiceCollection services)
    {
        services.AddHealthChecks();

        services.AddScoped<IUnitOfWork, UnitOfWork>();

        // configure DI for application services
        services.AddScoped<IEquipmentService, EquipmentService>();
        services.AddScoped<IStateChangeHistoryService, StateChangeHistoryService>();

        // configure DI for repos
        services.AddScoped<IStateChangeHistoryRepository, StateChangeHistoryRepository>();
        services.AddScoped<IEquipmentRepository, EquipmentRepository>();

        // adding automapper profiles
        services.AddAutoMapper(typeof(Profiles));

        // Add framework services.
        services.AddDbContext<ApplicationDbContext>(opt => opt.UseInMemoryDatabase("manufacturingDataDb"));
        
        services.AddSignalR(options => { options.EnableDetailedErrors = true; });

        services.AddLogging(builder =>
        {
            builder.AddConsole();
            builder.AddDebug();
        });

        services.AddHttpContextAccessor();

        services.AddSwaggerGen(options =>
        {
            options.SwaggerDoc("v1",
                new OpenApiInfo
                {
                    Version = "v1",
                    Title = "Manufacturing API",
                    Description = "An RESTful API for managing manufacturing data.",
                    Contact = new OpenApiContact
                    {
                        Name = "Contact developer",
                        Url = new Uri("https://trolund.github.io/"),
                        Email = "trolund@gmail.com"
                    }
                });

            // Set the comments path for the Swagger JSON and UI.
            var xmlFilename = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
            options.IncludeXmlComments(Path.Combine(AppContext.BaseDirectory, xmlFilename));
        });

        services.AddMvc(options => options.EnableEndpointRouting = false);

        if (_environment.IsDevelopment()) services.AddCors();
    }

    public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
    {
        if (env.IsDevelopment())
        {
            app.UseCors(builder => builder
                .AllowAnyMethod()
                .AllowAnyHeader()
                .SetIsOriginAllowed(origin => true)
                .AllowCredentials());

            // Use Swagger and SwaggerUI only in Development.
            app.UseSwagger();
            // set root to swagger
            app.UseSwaggerUI(options =>
            {
                options.SwaggerEndpoint("/swagger/v1/swagger.json", "v1");
                options.RoutePrefix = string.Empty;
            });
        }

        app.UseRouting();


        app.UseMvc();
        app.UseEndpoints(endpoints =>
            endpoints.MapHub<StateChangeHub>("/stateChangeHub"));

        var serviceScopeFactory = app.ApplicationServices.GetService<IServiceScopeFactory>();
        using (var scope = serviceScopeFactory.CreateScope())
        {
            SeedDatabase(scope);
        }
    }

    private static void SeedDatabase(IServiceScope scope)
    {
        var context = scope.ServiceProvider.GetService<ApplicationDbContext>();
        
        // Seed the database.
        context.Equipments.Add(new Equipment { Id = 1, Name = "Machine 1", Location = "Production Line 1" });
        context.Equipments.Add(new Equipment { Id = 2, Name = "Machine 2", Location = "Production Line 1" });
        context.Equipments.Add(new Equipment { Id = 3, Name = "Machine 3", Location = "Production Line 1" });
        context.Equipments.Add(new Equipment { Id = 4, Name = "Machine 4", Location = "Production Line 1" });
        context.Equipments.Add(new Equipment { Id = 5, Name = "Machine 5", Location = "Production Line 2" });
        context.Equipments.Add(new Equipment { Id = 6, Name = "Machine 6", Location = "Production Line 2" });
        context.Equipments.Add(new Equipment { Id = 7, Name = "Machine 7", Location = "Production Line 2" });
        context.Equipments.Add(new Equipment { Id = 8, Name = "Machine 8", Location = "Production Line 2" });
        

        context.StateChangeHistories.Add(new StateChangeHistory
        {
            EquipmentId = 1, State = EquipmentState.Red, ChangedAt = DateTime.Now, ChangedBy = "Worker 1"
        });
        context.StateChangeHistories.Add(new StateChangeHistory
        {
            EquipmentId = 2, State = EquipmentState.Red, ChangedAt = DateTime.Now, ChangedBy = "Worker 1"
        });
        context.StateChangeHistories.Add(new StateChangeHistory
        {
            EquipmentId = 3, State = EquipmentState.Red, ChangedAt = DateTime.Now, ChangedBy = "Worker 1"
        });
        context.StateChangeHistories.Add(new StateChangeHistory
        {
            EquipmentId = 4, State = EquipmentState.Red, ChangedAt = DateTime.Now, ChangedBy = "Worker 1"
        });
        context.StateChangeHistories.Add(new StateChangeHistory
        {
            EquipmentId = 5, State = EquipmentState.Red, ChangedAt = DateTime.Now, ChangedBy = "Worker 1"
        });
        context.StateChangeHistories.Add(new StateChangeHistory
        {
            EquipmentId = 6, State = EquipmentState.Red, ChangedAt = DateTime.Now, ChangedBy = "Worker 1"
        });
        context.StateChangeHistories.Add(new StateChangeHistory
        {
            EquipmentId = 7, State = EquipmentState.Red, ChangedAt = DateTime.Now, ChangedBy = "Worker 1"
        });
        context.StateChangeHistories.Add(new StateChangeHistory
        {
            EquipmentId = 8, State = EquipmentState.Red, ChangedAt = DateTime.Now, ChangedBy = "Worker 1"
        });

        context.SaveChanges();
    }
}