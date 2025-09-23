namespace Backend.Services.Interfaces;

public interface ITrackingService
{
    public Task<Response<StatisticUsersLogin>> GetUserLoginStatistic();
    public Task<Response<PaginateResult<TrackUsersLoginDto>>> AllUsersLoginLastPeriod(int pageNumber, int pageSize,
                                                                EnUsersType? usersType, EnLastDateType lastDateType);
    public Task<Response<PaginateResult<TrackUsersLoginDto>>> AllUsersLoginBetween(int pageNumber, int pageSize,
                                                                EnUsersType? usersType, DateTime startDate, DateTime endDate);
    public Task<Response<SystemLogDto>> GetLogsPerUser(int userId, DateTime? startDate, DateTime? endDate);
}