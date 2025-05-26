using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using StudentManagement.Data;
using StudentManagement.Models;
using StudentManagement.Models.DTOs;

namespace StudentManagement.Services
{
    public interface IAttendanceService
    {
        Task SaveAttendanceAsync(IEnumerable<AttendanceDto> records);
        Task<List<Attendance>> GetAttendanceByDateAsync(DateTime date);
    }

    public class AttendanceService : IAttendanceService
    {
        private readonly ApplicationDbContext _db;

        public AttendanceService(ApplicationDbContext db)
        {
            _db = db;
        }

        public async Task SaveAttendanceAsync(IEnumerable<AttendanceDto> records)
        {
            // Delete any existing attendance entries for that date (optional: if you want overwrite behavior)
            var date = records.First().Date.Date;
            var existing = _db.Attendances.Where(a => a.Date.Date == date);
            _db.Attendances.RemoveRange(existing);

            // Map and add
            foreach (var dto in records)
            {
                var attendance = new Attendance
                {
                    StudentId = dto.StudentId,
                    Date = dto.Date.Date,
                    IsPresent = dto.IsPresent
                };
                _db.Attendances.Add(attendance);
            }

            await _db.SaveChangesAsync();
        }

        public async Task<List<Attendance>> GetAttendanceByDateAsync(DateTime date)
        {
            return await _db.Attendances
                .Include(a => a.Student)
                .Where(a => a.Date.Date == date.Date)
                .ToListAsync();
        }
    }
}
