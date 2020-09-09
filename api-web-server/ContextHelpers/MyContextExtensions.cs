using System;
using System.Linq;
using System.Linq.Expressions;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using api_web_server.DataTransferModels;
using database;
using database.Models;

namespace api_web_server.ContextExtensions
{
    public static class MyContextExtensions
    {
        public static List<Patient> MyExt_GetListByTemplate(
            this DbSet<Patient> patientsTable,
            PatientSearchTemplateDTM template,
            int skip, int take)
        {
            var patients = patientsTable
                .IncludeFields()
                .AddWhereConditionsFromTemplate(template)
                .GetPortion<Patient>(skip, take, p => p.CreatedDate)
                .ToList();

            return patients;
        }

        public static List<string> MyExt_GetFieldValuesForTemplate(
            this DbSet<Patient> patientsTable,
            PatientSearchTemplateDTM template,
            int fieldNameId,
            int maxCount)
        {
            var fieldNames = patientsTable
                .AddWhereConditionsFromTemplate(template)
                .GetPortion(0, maxCount, p => p.CreatedDate)
                .Select(p => p.Fields.First(f => f.NameId == fieldNameId).Value)
                .ToList();

            return fieldNames;
        }



        private static IQueryable<Patient> IncludeFields(this DbSet<Patient> query) =>
            query.Include(p => p.Fields).ThenInclude(f => f.Name);

        private static IQueryable<Patient> AddWhereConditionsFromTemplate(
            this IQueryable<Patient> query,
            PatientSearchTemplateDTM template)
        {
            foreach (var field in template.Fields)
            {
                string trimmedValue = field.Value.Trim();

                if (string.IsNullOrEmpty(trimmedValue)) continue;

                query = query
                    .Where(p => p.Fields.Any(
                        f =>
                            f.Name.Id == field.NameId &&
                            f.Value.ToLower().StartsWith(trimmedValue.ToLower())
                    ));
            }

            return query;
        }

        private static IQueryable<T> GetPortion<T>(
            this IQueryable<T> query,
            int skip, int take,
            Expression<Func<T, object>> getSortField)
        {
            return query
                .OrderBy(getSortField)
                .Skip(skip)
                .Take(take);
        }
    }
}