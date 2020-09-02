using System;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.AspNetCore.SpaServices.ReactDevelopmentServer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using database;

namespace api_web_server
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }
        // This method gets called by the runtime. Use this method to add services to the container.
        // For more information on how to configure your application, visit https://go.microsoft.com/fwlink/?LinkID=398940
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddControllersWithViews(mvcOptions =>
            {
                mvcOptions.EnableEndpointRouting = false;
            });

            // In production, the React files will be served from this directory
            services.AddSpaStaticFiles(configuration =>
            {
                configuration.RootPath = "client-app/build";
            });

            string databaseProvider = Configuration["CustomChosenDB"];
            string connectionString = Configuration.GetConnectionString(databaseProvider);
            DbContextOptionsBuilder setDatabase(DbContextOptionsBuilder options) 
            {
                switch (databaseProvider) {
                    case "SQLite": return options.UseSqlite(connectionString);
                    case "MSSqlServer": return options.UseSqlServer(connectionString);
                    default:
                        throw new Exception("Необходимо установить строку подключения в appsettings.json в поле 'CustomChosenDB'");
                }
            }

            services.AddDbContext<MyContext>(
                options => setDatabase(options)
                .UseLoggerFactory(MyLoggerFactory)
                .EnableSensitiveDataLogging());

            services.AddCors();
        }
        public IConfiguration Configuration { get; }
        public static readonly ILoggerFactory MyLoggerFactory
            = LoggerFactory.Create(builder =>
            {
                builder.AddConsole();
            });


        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(
            IApplicationBuilder app,
            IWebHostEnvironment env,
            ILogger<Startup> logger
            )
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            app.UseCors(builder =>
                builder
                    .AllowAnyOrigin()
                    .AllowAnyHeader()
            );

            app.UseRouting();

            app.UseFileServer();
            // for:
            // app.UseDefaultFiles();
            // app.UseStaticFiles();

            app.UseEndpoints(endpoints =>
            {
                // logger.LogTrace($"Request path: {endpoints.con}", 3);                
                endpoints.MapControllerRoute(
                    name: "default",
                    pattern: "{controller=Patients}/{action}");
            });

            app.UseSpa(spa =>
            {
                spa.Options.SourcePath = "client-app";

                if (env.IsDevelopment())
                {
                    spa.UseReactDevelopmentServer(npmScript: "start");
                }
            });
        }
    }
}
