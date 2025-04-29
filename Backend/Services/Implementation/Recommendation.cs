namespace Backend.Services.Implementation

{
    public class RecommendationService : ResponseHandler ,IRecommendationService
    {
        private static readonly List<Course> Courses = new()
        {
            new() { Id = 1, Title = "Intro to C#", Description = "Programming" },
            new() { Id = 2, Title = "ASP.NET Core Basics", Description = "Programming" },
            new() { Id = 3, Title = "Linear Algebra", Description = "Mathematics" },
        };

        public async Task<IEnumerable<Course>> RecommendAsync(int userId)
        {
            // For demo, pretend user prefers "Programming"
            var preferredCategory = "Programming";
            var recommended = Courses.Where(c => c.Description == preferredCategory);
            return await Task.FromResult(recommended);
        }
    }
}
