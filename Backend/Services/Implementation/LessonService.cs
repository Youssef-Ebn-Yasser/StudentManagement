using Backend.DTOs.LessonDTOs;
using Backend.Services.Interfaces;
using Backend.BaseResponse;
using Backend.Entities;
using AutoMapper;
using Backend.UniteOfWork;

namespace Backend.Services.Implementation
{
    public class LessonService : ResponseHandler, ILessonService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public LessonService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<Response<List<ShowLessonDetailsPage>>> GetAll()
        {
            var lessons = await _unitOfWork.Repository<Lesson>().GetAllAsync();
            var mappedLessons = _mapper.Map<List<ShowLessonDetailsPage>>(lessons);
            return Success(mappedLessons);
        }

        public async Task<Response<ShowLessonDetailsPage>> GetLessonAsync(int lessonId, int courseId)
        {
            var lesson = await _unitOfWork.Repository<Lesson>().GetByIdAsync(lessonId);
            if (lesson == null || lesson.CourseId != courseId)
            {
                return NotFound<ShowLessonDetailsPage>("Lesson not found");
            }
            var mappedLesson = _mapper.Map<ShowLessonDetailsPage>(lesson);
            return Success(mappedLesson);
        }

        public async Task<Response<List<ShowLessonDetailsPage>>> GetAllLessonByCourseIdAsync(int courseId, int page = 1, int pageSize = 10)
        {
            var lessons = await _unitOfWork.Repository<Lesson>()
                .GetTableNoTracking()
                .Where(l => l.CourseId == courseId && !l.IsDeleted)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();
            var mappedLessons = _mapper.Map<List<ShowLessonDetailsPage>>(lessons);
            return Success(mappedLessons);
        }

        public async Task<Response<string>> CreateAsync(CreateLessonDto createLessonDto)
        {
            var lesson = _mapper.Map<Lesson>(createLessonDto);
            await _unitOfWork.Repository<Lesson>().AddAsync(lesson);
            _unitOfWork.Complete();
            return Success("Lesson created successfully");
        }

        public async Task<Response<string>> UpdateAsync(UpdateLessonDto updateLessonDto)
        {
            var lesson = await _unitOfWork.Repository<Lesson>().GetByIdAsync(updateLessonDto.Id);
            if (lesson == null)
            {
                return NotFound<string>("Lesson not found");
            }
            _mapper.Map(updateLessonDto, lesson);
            _unitOfWork.Repository<Lesson>().Update(lesson);
            _unitOfWork.Complete();
            return Success("Lesson updated successfully");
        }

        public async Task<Response<string>> DeleteAsync(int lessonId)
        {
            var lesson = await _unitOfWork.Repository<Lesson>().GetByIdAsync(lessonId);
            if (lesson == null)
            {
                return NotFound<string>("Lesson not found");
            }
            lesson.IsDeleted = true;
            _unitOfWork.Repository<Lesson>().Update(lesson);
            _unitOfWork.Complete();
            return Success("Lesson deleted successfully");
        }

        public async Task<Response<List<ShowLessonDetailsPage>>> GetAllLessonsAsync(int page = 1, int pageSize = 10)
        {
            var lessons = await _unitOfWork.Repository<Lesson>()
                .GetTableNoTracking()
                .Where(l => !l.IsDeleted)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();
            var mappedLessons = _mapper.Map<List<ShowLessonDetailsPage>>(lessons);
            return Success(mappedLessons);
        }

        public async Task<Response<ShowLessonDetailsPage>> GetLessonDetailsAsync(int lessonId, int courseId)
        {
            return await GetLessonAsync(lessonId, courseId);
        }

        public async Task<Response<List<ShowLessonDto>>> GetDeletedLessonsAsync(int page = 1, int pageSize = 10)
        {
            var lessons = await _unitOfWork.Repository<Lesson>()
                .GetTableNoTracking()
                .Where(l => l.IsDeleted)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();
            var mappedLessons = _mapper.Map<List<ShowLessonDto>>(lessons);
            return Success(mappedLessons);
        }

        public async Task<Response<string>> CreateLessonAsync(CreateLessonDto createLessonDto)
        {
            return await CreateAsync(createLessonDto);
        }

        public async Task<Response<string>> UpdateLessonAsync(UpdateLessonDto updateLessonDto)
        {
            return await UpdateAsync(updateLessonDto);
        }

        public async Task<Response<string>> RestoreLessonAsync(int lessonId)
        {
            var lesson = await _unitOfWork.Repository<Lesson>().GetByIdAsync(lessonId);
            if (lesson == null)
            {
                return NotFound<string>("Lesson not found");
            }
            if (!lesson.IsDeleted)
            {
                return BadRequest<string>("Lesson is already active");
            }
            lesson.IsDeleted = false;
            _unitOfWork.Repository<Lesson>().Update(lesson);
            _unitOfWork.Complete();
            return Success("Lesson restored successfully");
        }

        public async Task<Response<string>> DeleteLessonAsync(int lessonId)
        {
            return await DeleteAsync(lessonId);
        }
    }
}