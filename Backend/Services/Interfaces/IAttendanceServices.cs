using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using StudentManagement.Models;
using StudentManagement.Models.DTOs;

namespace StudentManagement.Interfaces
{
    public interface IAttendanceService
    {
        Task SaveAttendanceAsync(IEnumerable<AttendanceDto> records);
        Task<List<Attendance>> GetAttendanceByDateAsync(DateTime date);
    }
}
