using Backend.DTOs.LessonDTOs;
using Backend.Services.Interfaces;
using Backend.UniteOfWork;
using AutoMapper;

namespace Backend.Services.Implementation
{
    public class LessonService : ResponseHandler, ILessonService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly ResponseHandler _responseHandler;

        public LessonService(IUnitOfWork unitOfWork, IMapper mapper, ResponseHandler responseHandler)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _responseHandler = responseHandler;
        }

        public async Task<Response<ShowLessonDetailsPage>> CreateAsync(int lessonId)
        {
            var lesson = await _unitOfWork.Repository<Lesson>()
                .GetTableNoTracking()
                .Include(l => l.Materials)
                .FirstOrDefaultAsync(l => l.Id == lessonId);

            if (lesson == null)
                return _responseHandler.NotFound<ShowLessonDetailsPage>("Lesson Not Found");

            var mappedLesson = _mapper.Map<ShowLessonDetailsPage>(lesson);
            return _responseHandler.Success(mappedLesson);
        }

        public async Task<Response<string>> CreateAsync(CreateLessonDto createLessonDto)
        {
            var lesson = _mapper.Map<Lesson>(createLessonDto);
            await _unitOfWork.Repository<Lesson>().AddAsync(lesson);
            await _unitOfWork.CompleteAsync();
            return _responseHandler.Success("Lesson Created Successfully");
        }

        public async Task<Response<string>> UpdateAsync(UpdateLessonDto updateLessonDto)
        {
            var existingLesson = await _unitOfWork.Repository<Lesson>().GetByIdAsync(updateLessonDto.Id);
            if (existingLesson == null)
                return _responseHandler.NotFound<string>("Lesson Not Found");

            _mapper.Map(updateLessonDto, existingLesson);
            await _unitOfWork.Repository<Lesson>().UpdateAsync(existingLesson);
            await _unitOfWork.CompleteAsync();
            return _responseHandler.Success("Lesson Updated Successfully");
        }

        public async Task<Response<string>> DeleteAsync(int lessonId)
        {
            var lesson = await _unitOfWork.Repository<Lesson>().GetByIdAsync(lessonId);
            if (lesson == null)
                return _responseHandler.NotFound<string>("Lesson Not Found");

            await _unitOfWork.Repository<Lesson>().DeleteAsync(lesson);
            await _unitOfWork.CompleteAsync();
            return _responseHandler.Success("Lesson Deleted Successfully");
        }
    }
} 