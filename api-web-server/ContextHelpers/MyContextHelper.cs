using System;
using System.Linq;
using System.Linq.Expressions;
using System.Collections.Generic;
using api_web_server.ViewModels;
using database;
using database.Models;

namespace api_web_server.ContextHelpers
{
    public static class MyContexthelper
    {
        public static List<Patient> GetPatientsByTemplate(
            MyContext dbContext,
            PatientSearchTemplateVM template,
            int skip, int take)
        {
            var query = Patient.IncludeFields(dbContext.Patients);

            query = GetPatientsQueryByTemplate(query, template);

            query = GetPortion<Patient>(query, skip, take, p => p.CreatedDate);

            var patients = query.ToList();

            return patients;
        }

        public static List<string> GetVariantsByTemplate(
            MyContext dbContext,
            PatientSearchTemplateVM template,
            int fieldNameId,
            int maxCount)
        {
            var query = Patient.IncludeFields(dbContext.Patients);

            query = GetPatientsQueryByTemplate(query, template);

            query = GetPortion<Patient>(query, 0, maxCount, p => p.CreatedDate);

            var fieldNamesQuery = query
                .Select(p => p.Fields.First(f => f.NameId == fieldNameId).Value);

            var fieldNames = fieldNamesQuery.ToList();

            return fieldNames;
        }

        private static IQueryable<Patient> GetPatientsQueryByTemplate(
            IQueryable<Patient> query,
            PatientSearchTemplateVM template)
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
            IQueryable<T> query,
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