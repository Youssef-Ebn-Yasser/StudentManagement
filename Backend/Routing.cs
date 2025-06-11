namespace Backend;

public class Routing
{
    private const string SingleId = "/{id}";
    private const string root = "Api";
    private const string version = "V1";
    private const string Rule = root + "/" + version + "/";

    public static class StudentRouting
    {
        public const string Prefix = Rule + "Student";
        public const string GetList = Prefix + "/GetAll";
        public const string GetById = Prefix + SingleId;
        public const string GetByName = Prefix + "/{name}";
        public const string AddNew = Prefix + "/Create";
        public const string Update = Prefix + "/Update";
        public const string Delete = Prefix + "/Delete/{id}";
        public const string Paginated = Prefix + "/Paginated";
        public const string PagGetAllInCourseByCourseNameinated = Prefix + "PagGetAllInCourseByCourseNameinated" + "/{courseName}";
        public const string GetPaginatedCourses = Prefix + "GetPaginatedCourses" + "/{pageNumber}" + "/{pageSize}";
        public const string GetAllEnrolledStudentCourses = Prefix + "/GetAllEnrolledStudentCourses";
        public const string IsEnrolled = Prefix + "/IsEnrolled";
        public const string EnrollToCourse = Prefix + "/EnrollToCourse";
        public const string DeleteStudentFromCourse = Prefix + "/DeleteStudentFromCourse";
    }
}