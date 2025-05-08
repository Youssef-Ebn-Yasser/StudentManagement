using Backend.DTOs.AssignmentDTO;
using static Backend.Services.Implementation.StudentAssignmentService;

namespace Backend.Mapping;

public class StudentAssignmentProfile : Profile
{
    public StudentAssignmentProfile()
    {
        CreateMap<StudentAssignment, StudentAssignmentCourseDto>();
        CreateMap<StudentAssignment, AssignmentStudentDto>()
            .ForMember(dest => dest.Path, opt => opt.MapFrom(src => src.Path))
            .ForMember(dest => dest.LessonName, opt => opt.MapFrom(src => src.Lesson.Title))
            .ForMember(dest => dest.StudentName, opt => opt.MapFrom(src => src.Student.Name));

    }
}