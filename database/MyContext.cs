using System.Linq;
using System.Collections.Generic;
using System;
using System.Text;
using Microsoft.EntityFrameworkCore;
using database.Models;

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
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {

            modelBuilder.Entity<Patient>()
                    .HasMany(p => p.Fields)
                    .WithOne(pf => pf.Patient)
                    .HasForeignKey(p => p.PatientId);
            modelBuilder.Entity<PatientField>()
                        .HasKey(pf => new
                        {
                            pf.PatientId,
                            pf.NameId
                        });
            modelBuilder.Entity<PatientField>()
                .HasOne(p => p.Name)
                .WithMany()
                .HasForeignKey(p => p.NameId);

            var fieldNames = new string[] { "Имя", "Фамилия", "Отчество" }
                .Select((n, index) => new FieldName() { Id = index + 1, Value = n })
                .ToList();
            var patients = new List<Patient>();
            var patientFields = new List<PatientField>();

            char[] chars = "йцукенгшщзхъфывапролджэячсмитьбюЙЦУКЕНГШЩЗХЪФЫВАПРОЛДЖЭЯЧСМИТЬБЮ".ToCharArray();
            var rng = new Random();
            string getWord(int length)
            {
                var sb = new StringBuilder(string.Empty);
                for (int i = 0; i < length; ++i)
                    sb.Append(chars[rng.Next(chars.Length)]);
                return sb.ToString();
            }

            int patientsCount = 100;
            for (int patientId = 1; patientId <= patientsCount; patientId++)
            {
                patients.Add(new Patient() { Id = patientId });
                patientFields.AddRange(
                    fieldNames.Select(fn =>
                        new PatientField()
                        {
                            PatientId = patientId,
                            NameId = fn.Id,
                            Value = getWord(10)
                        }));
            }

            modelBuilder.Entity<Patient>().HasData(patients);
            modelBuilder.Entity<PatientField>().HasData(patientFields);
            modelBuilder.Entity<FieldName>().HasData(fieldNames);
        }
    }
}