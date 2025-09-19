namespace Backend.Services.Interfaces;

public interface ITrackingService
{
    public Task<Response<StatisticUsersLogin>> GetUserLoginStatistic();
}