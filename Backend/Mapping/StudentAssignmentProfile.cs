using static Backend.Services.Implementation.StudentAssignmentService;

namespace Backend.Mapping;

public class StudentAssignmentProfile : Profile
{
    public StudentAssignmentProfile()
    {
        CreateMap<StudentAssignment, StudentAssignmentCourseDto>();
    }
}