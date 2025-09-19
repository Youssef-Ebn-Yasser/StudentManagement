using Backend.Models.Enums.Users;

namespace Backend.Services.Implementation;

public class TrackingService : ResponseHandler, ITrackingService
{
    #region     Fields
    private readonly IUnitOfWork _unitOfWork;
    private readonly ApplicationDbContext _context;
    private DateTime _lastDay = DateTime.Now.AddDays(-1);

    #endregion

    #region    Constructor
    public TrackingService(IUnitOfWork unitOfWork, ApplicationDbContext applicationDbContext)
    {
        _unitOfWork = unitOfWork;
        _context = applicationDbContext;
    }
    #endregion

    #region    Handle Methods

    public async Task<Response<StatisticUsersLogin>> GetUserLoginStatistic()
    {
        var result = await _unitOfWork.Repository<SystemLog>()
                                                  .GetTableNoTracking()
                                                  .Where(sl => sl.LogType == EnLogType.Logs)
                                                  .ToListAsync();

        var dateLast24h = DateTime.Now.AddDays(-1);
        var dateLastWeek = DateTime.Now.AddDays(-7);
        var dateLastMonth = DateTime.Now.AddDays(-30);


        var totalUniqUserToday = result.Where(l => l.Timestamp >= dateLast24h).DistinctBy(l => l.UserName).Count();
        var totalUniqueUsersLastWeek = result.Where(l => l.Timestamp >= dateLastWeek).DistinctBy(l => l.UserName).Count();
        var totalUniqueUsersLastMonth = result.Where(l => l.Timestamp >= dateLastMonth).DistinctBy(l => l.UserName).Count();

        var totalUniqueAdminToday = result.Where(l => l.Timestamp >= dateLast24h && l.UserRole == "Admin").DistinctBy(l => l.UserName).Count();
        var totalUniqueStudentToday = result.Where(l => l.Timestamp >= dateLast24h && l.UserRole == "Student").DistinctBy(l => l.UserName).Count();
        var totalUniqueTeacherToday = result.Where(l => l.Timestamp >= dateLast24h && l.UserRole == "Teacher").DistinctBy(l => l.UserName).Count();
        var totalUniqueUnkownToday = result.Where(l => l.Timestamp >= dateLast24h && l.UserRole == "UnKnown").DistinctBy(l => l.UserName).Count();


        var totalUniqueAdminLastWeek = result.Where(l => l.Timestamp >= dateLastWeek && l.UserRole == "Admin").DistinctBy(l => l.UserName).Count();
        var totalUniqueStudentLastWeek = result.Where(l => l.Timestamp >= dateLastWeek && l.UserRole == "Student").DistinctBy(l => l.UserName).Count();
        var totalUniqueTeacherLastWeek = result.Where(l => l.Timestamp >= dateLastWeek && l.UserRole == "Teacher").DistinctBy(l => l.UserName).Count();
        var totalUniqueUnkownLastWeek = result.Where(l => l.Timestamp >= dateLastWeek && l.UserRole == "UnKnown").DistinctBy(l => l.UserName).Count();


        var totalUniqueAdminLastMonth = result.Where(l => l.Timestamp >= dateLastMonth && l.UserRole == "Admin").DistinctBy(l => l.UserName).Count();
        var totalUniqueStudentLastMonth = result.Where(l => l.Timestamp >= dateLastMonth && l.UserRole == "Student").DistinctBy(l => l.UserName).Count();
        var totalUniqueTeacherLastMonth = result.Where(l => l.Timestamp >= dateLastMonth && l.UserRole == "Teacher").DistinctBy(l => l.UserName).Count();
        var totalUniqueUnkownLastMonth = result.Where(l => l.Timestamp >= dateLastMonth && l.UserRole == "UnKnown").DistinctBy(l => l.UserName).Count();


        var dto = new StatisticUsersLogin()
        {
            SuccessLoginAttemptsLast24h = result.Where(l => l.Timestamp >= dateLast24h).Count(),
            FailedLoginAttemptsLast24h = result.Where(l => l.Timestamp >= dateLast24h && l.Level == "Error").Count(),

            TotalSuccessfulLogins = result.Where(l => l.Level != "Error").Count(),
            TotalFailedLogins = result.Where(l => l.Level == "Error").Count(),

            TotalUniqueUsersToday = totalUniqUserToday,
            TotalUniqueUsersLastWeek = totalUniqueUsersLastWeek,
            TotalUniqueUsersLastMonth = totalUniqueUsersLastMonth,


            PercentageByRoleLastDay = new RolePercentageDto
            {
                Admins = totalUniqueAdminToday / totalUniqUserToday,
                Students = totalUniqueStudentToday / totalUniqUserToday,
                Teachers = totalUniqueTeacherToday / totalUniqUserToday,
                Unknown = totalUniqueUnkownToday / totalUniqUserToday,
            },

            PercentageByRoleLastWeek = new RolePercentageDto
            {
                Admins = totalUniqueAdminLastWeek / totalUniqueUsersLastWeek,
                Students = totalUniqueStudentLastWeek / totalUniqueUsersLastWeek,
                Teachers = totalUniqueTeacherLastWeek / totalUniqueUsersLastWeek,
                Unknown = totalUniqueUnkownLastWeek / totalUniqueUsersLastWeek,
            },
            PercentageByRoleTotal = new RolePercentageDto
            {
                Admins = totalUniqueAdminLastMonth / totalUniqueUsersLastMonth,
                Students = totalUniqueStudentLastMonth / totalUniqueUsersLastMonth,
                Teachers = totalUniqueTeacherLastMonth / totalUniqueUsersLastMonth,
                Unknown = totalUniqueUnkownLastMonth / totalUniqueUsersLastMonth,
            },
        };


        return Success(dto);
    }

    //,DateTime? StartDate,DateTime? EndDate


    private async Task<PaginateResult<TrackUsersLoginDto>> GetUserPaginatedBasedOnRole(int pageNumber, int pageSize, string role)
    {

        var users = await _unitOfWork.Repository<SystemLog>()
                                      .GetTableNoTracking()
                                      .Where(sl => sl.Timestamp >= _lastDay && sl.UserRole == role)
                                      .Select(l => new TrackUsersLoginDto
                                      {
                                          Message = l.Message,
                                          Role = l.UserRole,
                                          Time = l.Timestamp,
                                          Email = l.Email,
                                      }).OrderByDescending(l => l.Time)
                                      .ToPaginatedListAsync(pageNumber, pageSize);

        return users;
    }

    public async Task<Response<PaginateResult<TrackUsersLoginDto>>> AllUsersLoginLastDay(int pageNumber, int pageSize, EnUsersType? usersType)
    {
        PaginateResult<TrackUsersLoginDto>? users = null;
        if (usersType == EnUsersType.Student)
        {
            users = await GetUserPaginatedBasedOnRole(pageNumber, pageSize, "Student");
        }
        else if (usersType == EnUsersType.Teacher)
        {
            users = await GetUserPaginatedBasedOnRole(pageNumber, pageSize, "Teacher");
        }
        else if (usersType == EnUsersType.Admin)
        {
            users = await GetUserPaginatedBasedOnRole(pageNumber, pageSize, "Admin");
        }
        else if (usersType == EnUsersType.UnKown)
        {
            users = await GetUserPaginatedBasedOnRole(pageNumber, pageSize, "Unkown");
        }
        else
        {
            users = await _unitOfWork.Repository<SystemLog>()
                                    .GetTableNoTracking()
                                    .Where(sl => sl.Timestamp >= _lastDay)
                                    .Select(l => new TrackUsersLoginDto
                                    {
                                        Message = l.Message,
                                        Role = l.UserRole,
                                        Time = l.Timestamp,
                                        Email = l.Email,
                                    }).OrderByDescending(l => l.Time)
                                    .ToPaginatedListAsync(pageNumber, pageSize);
        }


        if (users == null)
        {
            return BadRequest<PaginateResult<TrackUsersLoginDto>>("no data yet");
        }

        return Success(users);
    }


    #endregion
}

public class TrackUsersLoginDto
{
    public string Email { get; set; }
    public string Message { get; set; }
    public string? Role { get; set; }
    public DateTime Time { get; set; }
}