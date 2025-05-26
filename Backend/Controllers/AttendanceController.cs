using System;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using ClosedXML.Excel;
using Microsoft.AspNetCore.Mvc;
using StudentManagement.Models.DTOs;
using StudentManagement.Services;

namespace StudentManagement.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AttendanceController : ControllerBase
    {
        private readonly IAttendanceService _attendanceService;

        public AttendanceController(IAttendanceService attendanceService)
        {
            _attendanceService = attendanceService;
        }

        // 1) POST: api/attendance
        //    Save attendance records (one or more)
        [HttpPost]
        public async Task<IActionResult> SaveAttendance([FromBody] List<AttendanceDto> records)
        {
            if (records == null || records.Count == 0)
                return BadRequest("No attendance records provided.");

            await _attendanceService.SaveAttendanceAsync(records);
            return Ok(new { message = "Attendance saved successfully." });
        }

        // 2) GET: api/attendance/export?date=2025-05-26
        //    Returns an Excel file for that date
        [HttpGet("export")]
        public async Task<IActionResult> ExportAttendance([FromQuery] DateTime date)
        {
            var attendanceList = await _attendanceService.GetAttendanceByDateAsync(date);
            if (attendanceList == null || attendanceList.Count == 0)
                return NotFound("No attendance records found for that date.");

            // 3) Use ClosedXML to build an Excel workbook
            using (var workbook = new XLWorkbook())
            {
                var worksheet = workbook.Worksheets.Add("Attendance");

                // Header row
                worksheet.Cell(1, 1).Value = "Student ID";
                worksheet.Cell(1, 2).Value = "Student Name";
                worksheet.Cell(1, 3).Value = "Date";
                worksheet.Cell(1, 4).Value = "Is Present";

                // Data rows
                for (int i = 0; i < attendanceList.Count; i++)
                {
                    var row = i + 2; // because row 1 is header
                    var a = attendanceList[i];
                    worksheet.Cell(row, 1).Value = a.StudentId;
                    worksheet.Cell(row, 2).Value = a.Student.FullName; // adjust if your Student model has a different property
                    worksheet.Cell(row, 3).Value = a.Date.ToString("yyyy-MM-dd");
                    worksheet.Cell(row, 4).Value = a.IsPresent ? "Present" : "Absent";
                }

                // Auto-fit columns
                worksheet.Columns().AdjustToContents();

                // Save to a MemoryStream
                using (var stream = new MemoryStream())
                {
                    workbook.SaveAs(stream);
                    var content = stream.ToArray();
                    var fileName = $"Attendance_{date:yyyyMMdd}.xlsx";
                    return File(
                        content,
                        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                        fileName
                    );
                }
            }
        }
    }
}
