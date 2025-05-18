namespace Backend.DTOs.TeacherDTOs
{
    public class ShowAllTeacherWithDetailsDto
    {
        public int Id { get; set; }
        public string? Name { get; set; }
        public byte Age { get; set; }
        public string? Email { get; set; }
        public string? Phone { get; set; }
        public string? AdditionalInfo { get; set; }
        public string? Specialization { get; set; }
        public string? ProfileImagePath { get; set; }
        public List<CoursesProfile>? coursesProfiles { get; set; }
    }
}
