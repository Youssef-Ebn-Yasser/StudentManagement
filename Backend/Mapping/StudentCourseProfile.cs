using Backend.DTOs.StudentDOs;

namespace Backend.Mapping;

public class StudentCourseProfile : Profile
{
    public StudentCourseProfile()
    {
        CreateMap<StudentEnrollDto, StudentCourse>();

    }
}