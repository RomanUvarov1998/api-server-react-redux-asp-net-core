using System;
using System.Linq;
using System.Linq.Expressions;
using Microsoft.EntityFrameworkCore;
using api_web_server.DataTransferModels;
using api_web_server.Controllers.ActionFilters;
using database.Models;

namespace api_web_server.ContextHelpers
{
    public static class MyContextExtensions
    {
        public static IQueryable<Patient> MyExt_PortionByTemplate(
            this DbSet<Patient> patientsTable,
            PatientSearchTemplateDTM template,
            int skip, int take)
        {
            var query = patientsTable
                .IncludeFields()
                .AddWhereConditionsFromTemplate(template)
                .GetPortion(skip, take, p => p.CreatedDate);

            return query;
        }

        public static IQueryable<string> MyExt_GetFieldValuesForTemplate(
            this DbSet<Patient> patientsTable,
            PatientSearchTemplateDTM template,
            int fieldNameId,
            int maxCount)
        {
            var query = patientsTable
                .AddWhereConditionsFromTemplate(template)
                .GetPortion(0, maxCount, p => p.CreatedDate)
                .Select(p => p.Fields.First(f => f.NameId == fieldNameId).Value);

            return query;
        }

        public static IQueryable<Patient> IncludeFields(this DbSet<Patient> query) =>
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
            if (skip < 0)
            {
                throw new MyException(
                    MyExceptionType.NegativeSkipArgument,
                    skip);
            }
            if (take < 0)
            {
                throw new MyException(
                    MyExceptionType.NegativeTakeArgument,
                    take);
            }
            
            return query
                .OrderBy(getSortField)
                .Skip(skip)
                .Take(take);
        }
    }
}