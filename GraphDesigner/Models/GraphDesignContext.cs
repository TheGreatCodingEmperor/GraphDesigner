
using Microsoft.EntityFrameworkCore;
using GraphDesigner.Models;

public class GraphDesignerContext : DbContext
{
    public GraphDesignerContext(DbContextOptions<GraphDesignerContext> options)
        : base(options)
    { }
    public DbSet<DataSet> DataSet { get; set; }
    public DbSet<Project> Project { get; set; }
    public DbSet<ProjectDatas> ProjectDatas { get; set; }
    public DbSet<Layer> Layer{get;set;}
    public DbSet<JoinLines> JoinLines {get;set;}
    public DbSet<JoinTables> JoinTables{get;set;}
}