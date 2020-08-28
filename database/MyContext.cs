using Microsoft.EntityFrameworkCore;
using database.Models;
using System.Linq;
using System.Collections.Generic;
using System;
using System.Text;

namespace database
{
    public class MyContext : DbContext
    {
        public DbSet<Patient> Patients { get; set; }
        public DbSet<PatientField> PatientFields { get; set; }
        public DbSet<FieldName> FieldNames { get; set; }

        public MyContext(DbContextOptions<MyContext> options) : base(options)
        {
            //Database.EnsureDeleted();
            if (Database.EnsureCreated())
            {
                Console.WriteLine("No database found, so a new database was created");
            }

            if (!Patients.Any())
            {
                var name = new FieldName() { Value = "Имя" };
                var surname = new FieldName() { Value = "Фамилия" };
                var patronimyc = new FieldName() { Value = "Отчество" };

                FieldNames.AddRange(name, surname, patronimyc);

                SaveChanges();

                char[] chars = "йцукенгшщзхъфывапролджэячсмитьбю".ToCharArray();
                Random rng = new Random();
                string getWord(int length) {
                    var sb = new StringBuilder(string.Empty);
                    for (int i = 0; i < length; ++i)
                        sb.Append(chars[rng.Next(chars.Length)]);
                    return sb.ToString();
                }

                var patientsToAdd = new List<Patient>();
                for (int i = 0; i < 100; i++)
                {
                    patientsToAdd.Add(
                        new Patient(
                            new PatientField(name, getWord(10)),
                            new PatientField(surname, getWord(10)),
                            new PatientField(patronimyc, getWord(10))
                        )
                    );
                }

                Patients.AddRange(patientsToAdd);

                SaveChanges();
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Patient>()
                .HasMany(p => p.Fields)
                .WithOne(pf => pf.Patient)
                .HasForeignKey(p => p.PatientId);

            modelBuilder.Entity<PatientField>()
                .HasKey(pf => new { pf.PatientId, pf.NameId });

            modelBuilder.Entity<PatientField>()
                .HasOne(p => p.Name)
                .WithMany()
                .HasForeignKey(p => p.NameId);
        }
    }
}