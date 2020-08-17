using System;
using Microsoft.EntityFrameworkCore;

namespace database
{
    public class MyContext : DbContext
    {
        public DbSet<Patient> Patients { get; set; }
        public DbSet<FieldName> FieldNames { get; set; }
        public DbSet<FieldValue> FieldValues { get; set; }

        public MyContext()
        {
            Database.EnsureCreated();
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlite("Data Source=/home/roma-uvarov/Documents/ASP.NET_Core/from-empty-react-redux/database/bin/Debug/netstandard2.0/MyDB.db;");
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Patient>()
                .HasMany(p => p.Fields)
                .WithOne()
                .HasForeignKey(p => p.PatientId);

            modelBuilder.Entity<PatientField>()
                .HasKey(pf => new { pf.PatientId, pf.NameId, pf.ValueId });
                
            modelBuilder.Entity<PatientField>()
                .HasOne(p => p.Name)
                .WithMany()
                .HasForeignKey(p => p.NameId);
                
            modelBuilder.Entity<PatientField>()
                .HasOne(p => p.Value)
                .WithMany()
                .HasForeignKey(p => p.ValueId);
        }
    }
}
