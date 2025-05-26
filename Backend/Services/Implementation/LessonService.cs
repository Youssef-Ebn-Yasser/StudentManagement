using Backend.DTOs.LessonDTOs;

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

            var lesson = await _unitOfWork.Repository<Lesson>()
                                                  .GetTableNoTracking()
                                                  .Where(s => s.IsDeleted == false)
                                                  .ToListAsync();
            if (lesson == null)
                return NotFound<List<ShowLessonDetailsPage>>("Lesson Not Found");

            var mappedLesson = _mapper.Map<List<ShowLessonDetailsPage>>(lesson);
            return Success(mappedLesson);
        }

        public async Task<Response<ShowLessonDetailsPage>> GetLessonAsync(int lessonId, int courseId)
        {

            var lesson = await _unitOfWork.Repository<Lesson>()
                .GetTableNoTracking()
                .Where(s => s.IsDeleted == false)
                .FirstOrDefaultAsync(l => l.Id == lessonId && l.CourseId == courseId);

            if (lesson == null)
                return NotFound<ShowLessonDetailsPage>("Lesson Not Found");

            var mappedLesson = _mapper.Map<ShowLessonDetailsPage>(lesson);
            return Success(mappedLesson);
        }

        public async Task<Response<string>> CreateAsync(CreateLessonDto createLessonDto)
        {
            var lesson = _mapper.Map<Lesson>(createLessonDto);
            await _unitOfWork.Repository<Lesson>().AddAsync(lesson);
            _unitOfWork.Complete();
            return Success("Lesson Created Successfully");
        }

        public async Task<Response<string>> UpdateAsync(UpdateLessonDto updateLessonDto)
        {
            var existingLesson = await _unitOfWork.Repository<Lesson>()
                                                   .GetByIdAsync(updateLessonDto.Id);
            if (existingLesson == null)
                return NotFound<string>("Lesson Not Found");

            _mapper.Map(updateLessonDto, existingLesson);
            _unitOfWork.Repository<Lesson>().Update(existingLesson);
            _unitOfWork.Complete();
            return Success("Lesson Updated Successfully");
        }

        public async Task<Response<string>> DeleteAsync(int lessonId)
        {
            var lesson = await _unitOfWork.Repository<Lesson>().GetByIdAsync(lessonId);
            if (lesson == null)
                return NotFound<string>("Lesson Not Found");

            lesson.IsDeleted = true;
            _unitOfWork.Repository<Lesson>().Update(lesson);
            _unitOfWork.Complete();
            return Success("Lesson Deleted Successfully");
        }
    }
}