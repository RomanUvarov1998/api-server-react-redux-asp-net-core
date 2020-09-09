using System;
using Microsoft.Data.Sqlite;
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
                switch (databaseProvider)
                {
                    case "SQLite":
                        var connection = new SqliteConnection(connectionString);
                        // replace standart lower() function with the new one
                        connection.CreateFunction("lower",
                            (string s) => s.ToLowerInvariant());
                        return options.UseSqlite(connection);
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
            IWebHostEnvironment env
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
