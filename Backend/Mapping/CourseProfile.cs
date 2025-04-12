namespace Backend.Mapping;

public class CourseProfile : Profile
{
    public CourseProfile()
    {
        CreateMap<CreateCourseDto, Course>();
        CreateMap<Course, ShowAllCoursesWithItsDependents>();

    }
}