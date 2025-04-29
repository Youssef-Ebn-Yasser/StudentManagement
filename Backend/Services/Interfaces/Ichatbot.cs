namespace Backend.Services.Interfaces
{

    public interface IChatbotService
    {
        Task<string> AskAsync(string question);
    }
}

