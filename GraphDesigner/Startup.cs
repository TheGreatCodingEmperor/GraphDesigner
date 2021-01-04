using System;
using System.Reflection;
using GraphDesigner.Helpers;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.SpaServices.AngularCli;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.OpenApi.Models;

namespace GraphDesigner {
    public class Startup {
        public Startup (IConfiguration configuration) {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices (IServiceCollection services) {
            string migrationsAssembly = typeof (Startup).GetTypeInfo ().Assembly.GetName ().Name; //UltraApp
            services.AddControllersWithViews ();
            services.AddSwaggerGen (
                c => {
                    c.SwaggerDoc ("v1", new OpenApiInfo { Title = "API", Version = "v1" });

                    c.TagActionsBy (api => {
                        if (api.GroupName != null) {
                            return new [] { api.GroupName };
                        }

                        var controllerActionDescriptor = api.ActionDescriptor as Microsoft.AspNetCore.Mvc.Controllers.ControllerActionDescriptor;
                        if (controllerActionDescriptor != null) {
                            return new [] { controllerActionDescriptor.ControllerName };
                        }

                        throw new InvalidOperationException ("Unable to determine tag for endpoint.");
                    });
                    c.DocInclusionPredicate ((name, api) => true);
                }
            );
            services.AddDbContext<GraphDesignerContext> (options =>
                options.UseMySql (Configuration["ConnectionString:Maria"], sql => sql.MigrationsAssembly (migrationsAssembly))
            );

            services.AddScoped<IBasicEfcoreHelper, BasicEfcoreHelper> ();
            // In production, the Angular files will be served from this directory
            services.AddSpaStaticFiles (configuration => {
                configuration.RootPath = "ClientApp/dist";
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure (IApplicationBuilder app, IWebHostEnvironment env) {
            if (env.IsDevelopment ()) {
                app.UseDeveloperExceptionPage ();
            } else {
                app.UseExceptionHandler ("/Error");
            }

            app.UseStaticFiles ();
            if (!env.IsDevelopment ()) {
                app.UseSpaStaticFiles ();
            }

            app.UseRouting ();

            app.UseEndpoints (endpoints => {
                endpoints.MapControllerRoute (
                    name: "default",
                    pattern: "{controller}/{action=Index}/{id?}");
            });

            app.UseSwagger ();
            app.UseSwaggerUI (c => {
                c.SwaggerEndpoint ("/swagger/v1/swagger.json", "My API V1");
            });

            app.UseSpa (spa => {
                // To learn more about options for serving an Angular SPA from ASP.NET Core,
                // see https://go.microsoft.com/fwlink/?linkid=864501

                spa.Options.SourcePath = "ClientApp";

                if (env.IsDevelopment ()) {
                    spa.UseProxyToSpaDevelopmentServer ("http://localhost:4300");
                    // spa.UseAngularCliServer(npmScript: "start");
                }
            });
        }
    }
}