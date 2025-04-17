using Backend.DTOs.StudentDOs;

namespace Backend.Mapping
{
    public class StudentProfile:Profile
    {

        public StudentProfile()
        {
            // CreateStudentDto => Student
            CreateMap<CreateStudentDto, Student>();

            // Student => ShowStudentDto
            CreateMap<Student, ShowStudentDto>();

            // Student => ShowStudentWithCoursesDto
            CreateMap<Student, ShowStudentWithCoursesDto>()
                .ForMember(dest => dest.CourseTitles,
                    opt => opt.MapFrom(src =>
                        src.StudentCourses.Select(sc => sc.Course.Title).ToList()));
        }
    }
}
