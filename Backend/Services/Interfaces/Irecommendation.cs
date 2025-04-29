namespace Backend.Services.Interfaces

{
    public interface IRecommendationService
    {
        Task<IEnumerable<Course>> RecommendAsync(int userId);
    }
}
