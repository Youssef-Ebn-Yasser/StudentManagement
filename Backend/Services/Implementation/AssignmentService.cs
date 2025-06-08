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
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public AssignmentService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<List<AssignmentListItemDto>> GetByLessonAsync(int lessonId)
        {
            var assignments = await _unitOfWork.StudentAssignments
   .FindAsync(sa => sa.LessonId == lessonId, include: q => q.Include(sa => sa.Student));

            return _mapper.Map<List<AssignmentListItemDto>>(assignments);
        }

        public async Task<AssignmentDetailDto> GetDetailAsync(int studentAssignmentId)
        {
            var assignment = await _unitOfWork.StudentAssignments
                .FirstOrDefaultAsync(
                    sa => sa.Id == studentAssignmentId,
                    q => q.Include(sa => sa.Student)
                          .Include(sa => sa.Lesson)
                          .ThenInclude(l => l.Course)
                );

            if (assignment == null)
                throw new Exception("Assignment not found");

            return _mapper.Map<AssignmentDetailDto>(assignment);
        }

        public async Task<bool> UpdateDegreeAsync(int studentAssignmentId, int degree)
        {
            var assignment = _unitOfWork.Repository<StudentAssignment>().GetByIdAsync(studentAssignmentId);
            if (assignment == null)
                throw new Exception("Assignment not found");

            assignment. = degree;
            _unitOfWork.Repository<StudentAssignment>().Update( await assignment);
            await Task.Run(() => _unitOfWork.Complete()); // Replace CompleteAsync with synchronous Complete wrapped in Task.Run  
            return true;
        }
    }

}

