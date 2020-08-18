using System;
using Microsoft.EntityFrameworkCore;
using database.Models;
using System.Linq;
using System.Collections.Generic;

namespace database
{
    public class MyContext : DbContext
    {
        public DbSet<Patient> Patients { get; set; }
        public DbSet<PatientField> PatientFields { get; set; }
        public DbSet<FieldName> FieldNames { get; set; }

        public MyContext()
        {
            Database.EnsureCreated();

            if (!Patients.Any())
            {
                var name = new FieldName() { Value = "Имя" };
                var surname = new FieldName() { Value = "Фамилия" };
                var patronimyc = new FieldName() { Value = "Отчество" };

                FieldNames.Add(name);
                FieldNames.Add(surname);
                FieldNames.Add(patronimyc);

                Patients.Add(
                    new Patient()
                    {
                        Fields = new List<PatientField>()
                        {
                            new PatientField() {
                                Name = name,
                                Value = "Роман"
                            },
                            new PatientField() {
                                Name = surname,
                                Value = "Уваров"
                            },
                            new PatientField() {
                                Name = patronimyc,
                                Value = "Сергеевич"
                            }
                        }
                    }
                );
                Patients.Add(
                    new Patient()
                    {
                        Fields = new List<PatientField>()
                        {
                            new PatientField() {
                                Name = name,
                                Value = "Петр"
                            },
                            new PatientField() {
                                Name = surname,
                                Value = "Иванов"
                            },
                            new PatientField() {
                                Name = patronimyc,
                                Value = "Михалыч "
                            }
                        }
                    }
                );

                SaveChanges();
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Patient>()
                .HasMany(p => p.Fields)
                .WithOne()
                .HasForeignKey(p => p.PatientId);

            modelBuilder.Entity<PatientField>()
                .HasKey(pf => new { pf.PatientId, pf.NameId });

            modelBuilder.Entity<PatientField>()
                .HasOne(p => p.Name)
                .WithMany()
                .HasForeignKey(p => p.NameId);
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlite("Filename=/home/roma-uvarov/Documents/ASP.NET_Core/from-empty-react-redux/database/bin/Debug/netstandard2.0/MyDB.db;");
        }
    }
}