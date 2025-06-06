using Backend.Context;
using Backend.DTOs.AssignmentDTOs;
using Backend.DTOs;
using Backend.Entities;
using Backend.Services.Interfaces;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace Backend.Services.Implementation
{
    public class AssignmentService : IAssignmentService
    {
        private readonly ApplicationDbContext _context;
        private readonly IWebHostEnvironment _webHostEnv;

        public AssignmentService(ApplicationDbContext context, IWebHostEnvironment webHostEnv)
        {
            _context = context;
            _webHostEnv = webHostEnv;
        }

        public async Task<IEnumerable<StudentDegreeDto>> GetStudentDegreesByLessonAsync(int lessonId)
        {
            return await _context.StudentAssignments
                .Where(sa => sa.LessonId == lessonId)
                .Select(sa => new StudentDegreeDto
                {
                    StudentId = sa.StudentId,
                    Degree = sa.Degree
                })
                .ToListAsync();
        }

        public async Task<IEnumerable<AssignmentSummaryDto>> GetAssignmentsToCorrectAsync(int lessonId)
        {
            return await _context.StudentAssignments
                .Where(sa => sa.LessonId == lessonId)
                .Include(sa => sa.Student)
                .Select(sa => new AssignmentSummaryDto
                {
                    StudentAssignmentId = sa.Id,
                    StudentName = sa.Student.FirstName + " " + sa.Student.LastName
                })
                .ToListAsync();
        }

        public async Task<AssignmentDetailDto> GetAssignmentDetailAsync(int studentAssignmentId)
        {
            var sa = await _context.StudentAssignments
                .Include(x => x.Student)
                .Include(x => x.Lesson)
                    .ThenInclude(l => l.Course)
                .FirstOrDefaultAsync(x => x.Id == studentAssignmentId);

            if (sa == null)
                throw new KeyNotFoundException($"StudentAssignment with ID {studentAssignmentId} not found.");

            return new AssignmentDetailDto
            {
                StudentAssignmentId = sa.Id,
                StudentName = sa.Student.FirstName + " " + sa.Student.LastName,
                LessonName = sa.Lesson.Name,
                CourseName = sa.Lesson.Course.Name,
                Degree = sa.Degree
            };
        }

        public async Task<int> UploadAssignmentAsync(UploadAssignmentDto uploadDto)
        {
            var lessonExists = await _context.Lessons.AnyAsync(l => l.Id == uploadDto.LessonId);
            if (!lessonExists)
                throw new KeyNotFoundException($"Lesson with ID {uploadDto.LessonId} not found.");

            var studentExists = await _context.Students.AnyAsync(s => s.Id == uploadDto.StudentId);
            if (!studentExists)
                throw new KeyNotFoundException($"Student with ID {uploadDto.StudentId} not found.");

            var uploadsRootFolder = Path.Combine(_webHostEnv.WebRootPath, "assignments");
            var studentFolder = Path.Combine(uploadsRootFolder, uploadDto.LessonId.ToString(), uploadDto.StudentId.ToString());
            Directory.CreateDirectory(studentFolder);

            var originalFileName = Path.GetFileName(uploadDto.File.FileName);
            var uniqueSuffix = DateTime.UtcNow.Ticks;
            var safeFileName = $"{Path.GetFileNameWithoutExtension(originalFileName)}_{uniqueSuffix}{Path.GetExtension(originalFileName)}";
            var fullFilePath = Path.Combine(studentFolder, safeFileName);

            using (var stream = new FileStream(fullFilePath, FileMode.Create))
            {
                await uploadDto.File.CopyToAsync(stream);
            }

            var studentAssignment = new StudentAssignment
            {
                LessonId = uploadDto.LessonId,
                StudentId = uploadDto.StudentId,
                Degree = 0,
                FilePath = Path.Combine("assignments", uploadDto.LessonId.ToString(), uploadDto.StudentId.ToString(), safeFileName).Replace('\\', '/')
            };

            _context.StudentAssignments.Add(studentAssignment);
            await _context.SaveChangesAsync();

            return studentAssignment.Id;
        }

        public async Task UpdateAssignmentDegreeAsync(int studentAssignmentId, int degree)
        {
            var sa = await _context.StudentAssignments.FindAsync(studentAssignmentId);
            if (sa == null)
                throw new KeyNotFoundException($"StudentAssignment with ID {studentAssignmentId} not found.");

            sa.Degree = degree;
            _context.StudentAssignments.Update(sa);
            await _context.SaveChangesAsync();
        }
    }
}
