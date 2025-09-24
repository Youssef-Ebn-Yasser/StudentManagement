namespace Backend.Services.Implementation;

public class TrackingService : ResponseHandler, ITrackingService
{
    #region     Fields
    private readonly IUnitOfWork _unitOfWork;
    private readonly ApplicationDbContext _context;
    private DateTime _lastDay = DateTime.Now.AddDays(-1);
    private DateTime _lastWeek = DateTime.Now.AddDays(-7);
    private DateTime _lastMonth = DateTime.Now.AddDays(-30);


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

        var totalUniqUserToday = result.Where(l => l.Timestamp >= dateLast24h).DistinctBy(u => u.UserName).Count();
        var totalUniqueUsersLastWeek = result.Where(l => l.Timestamp >= dateLastWeek).DistinctBy(u => u.UserName).Count();
        var totalUniqueUsersLastMonth = result.Where(l => l.Timestamp >= dateLastMonth).DistinctBy(u => u.UserName).Count();

        var totalUserToday = result.Where(l => l.Timestamp >= dateLast24h).Count();
        var totalUsersLastWeek = result.Where(l => l.Timestamp >= dateLastWeek).Count();
        var totalUsersLastMonth = result.Where(l => l.Timestamp >= dateLastMonth).Count();

        var totalAdminToday = result.Where(l => l.Timestamp >= dateLast24h && l.UserRole == "Admin").Count();
        var totalStudentToday = result.Where(l => l.Timestamp >= dateLast24h && l.UserRole == "Student").Count();
        var totalTeacherToday = result.Where(l => l.Timestamp >= dateLast24h && l.UserRole == "Teacher").Count();
        var totalUnkownToday = result.Where(l => l.Timestamp >= dateLast24h && l.UserRole == "Unknown").Count();


        var totalAdminLastWeek = result.Where(l => l.Timestamp >= dateLastWeek && l.UserRole == "Admin").Count();
        var totalStudentLastWeek = result.Where(l => l.Timestamp >= dateLastWeek && l.UserRole == "Student").Count();
        var totalTeacherLastWeek = result.Where(l => l.Timestamp >= dateLastWeek && l.UserRole == "Teacher").Count();
        var totalUnkownLastWeek = result.Where(l => l.Timestamp >= dateLastWeek && l.UserRole == "Unknown").Count();


        var totalAdminLastMonth = result.Where(l => l.Timestamp >= dateLastMonth && l.UserRole == "Admin").Count();
        var totalStudentLastMonth = result.Where(l => l.Timestamp >= dateLastMonth && l.UserRole == "Student").Count();
        var totalTeacherLastMonth = result.Where(l => l.Timestamp >= dateLastMonth && l.UserRole == "Teacher").Count();
        var totalUnkownLastMonth = result.Where(l => l.Timestamp >= dateLastMonth && l.UserRole == "Unknown").Count();


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
                Admins = (double)totalAdminToday / (double)totalUserToday,
                Students = (double)totalStudentToday / (double)totalUserToday,
                Teachers = (double)totalTeacherToday / (double)totalUserToday,
                Unknown = (double)totalUnkownToday / (double)totalUserToday,
            },

            PercentageByRoleLastWeek = new RolePercentageDto
            {
                Admins = (double)totalAdminLastWeek / (double)totalUsersLastWeek,
                Students = (double)totalStudentLastWeek / (double)totalUsersLastWeek,
                Teachers = (double)totalTeacherLastWeek / (double)totalUsersLastWeek,
                Unknown = (double)totalUnkownLastWeek / (double)totalUsersLastWeek,
            },
            PercentageByRoleLastMonth = new RolePercentageDto
            {
                Admins = (double)totalAdminLastMonth / (double)totalUsersLastMonth,
                Students = (double)totalStudentLastMonth / (double)totalUsersLastMonth,
                Teachers = (double)totalTeacherLastMonth / (double)totalUsersLastMonth,
                Unknown = (double)totalUnkownLastMonth / (double)totalUsersLastMonth,
            },
        };


        return Success(dto);
    }

    private async Task<PaginateResult<TrackUsersLoginDto>> GetUserPaginatedBasedOnRole(int pageNumber, int pageSize, string role, DateTime lastDateType)
    {

        var users = await _unitOfWork.Repository<SystemLog>()
                                      .GetTableNoTracking()
                                      .Where(sl => sl.Timestamp >= lastDateType && sl.UserRole == role && sl.LogType == EnLogType.Logs)
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

    public async Task<Response<PaginateResult<TrackUsersLoginDto>>> AllUsersLoginLastPeriod(int pageNumber, int pageSize,
                                                                    EnUsersType? usersType, EnLastDateType lastDateType)
    {
        DateTime last = DateTime.Now;
        switch (lastDateType)
        {
            case EnLastDateType.day:
                last = _lastDay;
                break;
            case EnLastDateType.week:
                last = _lastWeek;
                break;
            case EnLastDateType.month:
                last = _lastMonth;
                break;
        }


        PaginateResult<TrackUsersLoginDto>? users = null;
        if (usersType == EnUsersType.Student)
        {
            users = await GetUserPaginatedBasedOnRole(pageNumber, pageSize, "Student", last);
        }
        else if (usersType == EnUsersType.Teacher)
        {
            users = await GetUserPaginatedBasedOnRole(pageNumber, pageSize, "Teacher", last);
        }
        else if (usersType == EnUsersType.Admin)
        {
            users = await GetUserPaginatedBasedOnRole(pageNumber, pageSize, "Admin", last);
        }
        else if (usersType == EnUsersType.UnKown)
        {
            users = await GetUserPaginatedBasedOnRole(pageNumber, pageSize, "Unknown", last);
        }
        else
        {
            users = await _unitOfWork.Repository<SystemLog>()
                                    .GetTableNoTracking()
                                    .Where(sl => sl.Timestamp >= last && sl.LogType == EnLogType.Logs)
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

    private async Task<PaginateResult<TrackUsersLoginDto>> GetUserPaginatedBetweenBasedOnRole(int pageNumber, int pageSize, string role,
                                                                                                DateTime startDate, DateTime endDate)
    {

        var users = await _unitOfWork.Repository<SystemLog>()
                                      .GetTableNoTracking()
                                      .Where(sl => sl.Timestamp >= startDate && sl.Timestamp <= endDate && sl.UserRole == role && sl.LogType == EnLogType.Logs)
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
    public async Task<Response<PaginateResult<TrackUsersLoginDto>>> AllUsersLoginBetween(int pageNumber, int pageSize,
                                                                    EnUsersType? usersType, DateTime startDate, DateTime endDate)
    {
        PaginateResult<TrackUsersLoginDto>? users = null;
        if (usersType == EnUsersType.Student)
        {
            users = await GetUserPaginatedBetweenBasedOnRole(pageNumber, pageSize, "Student", startDate, endDate);
        }
        else if (usersType == EnUsersType.Teacher)
        {
            users = await GetUserPaginatedBetweenBasedOnRole(pageNumber, pageSize, "Teacher", startDate, endDate);
        }
        else if (usersType == EnUsersType.Admin)
        {
            users = await GetUserPaginatedBetweenBasedOnRole(pageNumber, pageSize, "Admin", startDate, endDate);
        }
        else if (usersType == EnUsersType.UnKown)
        {
            users = await GetUserPaginatedBetweenBasedOnRole(pageNumber, pageSize, "Unknown", startDate, endDate);
        }
        else
        {
            users = await _unitOfWork.Repository<SystemLog>()
            .GetTableNoTracking()
                                    .Where(sl => sl.Timestamp >= startDate && sl.Timestamp <= endDate && sl.LogType == EnLogType.Logs)
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


    public async Task<Response<SystemLogDto>> GetLogsPerUser(int userId, DateTime? startDate, DateTime? endDate)
    {
        var studentEmail = await _context.Users
                                               .Where(s => s.Id == userId)
                                               .Select(s => s.Email)
                                               .FirstOrDefaultAsync();

        var spec = new SystemLogSpecification(studentEmail, startDate, endDate);

        var logDetails = await _context.SystemLogs
                                   .Where(spec.Criteria)
                                   .Select(s => new SystemLogDetailsDto
                                   {
                                       Email = s.Email,
                                       Message = s.Message,
                                       UserRole = s.UserRole,
                                       Timestamp = s.Timestamp,
                                       Level = s.Level,
                                       LogType = s.LogType,
                                       City = s.City,
                                       IPAddress = s.IPAddress,
                                   })
                                   .OrderByDescending(s => s.Timestamp)
                                   .ToListAsync();
        var response = new SystemLogDto
        {
            SystemLogDetailsDtos = logDetails,
            NumberOfTotalLogs = logDetails.Count,
            NumberOfTotalLogsLastDay = logDetails.Where(l => l.Timestamp >= _lastDay).Count()
        };

        return Success(response);
    }

    public async Task<Response<SystemLogDto>> GetLogsPerCourse(int courseId)
    {


        var logDetails = await _context.SystemLogs
                                   .Where(s => s.LogHappenInId == courseId && s.LogHappenIn == EnLogHappenIn.Course)
                                   .Select(s => new SystemLogDetailsDto
                                   {
                                       Email = s.Email,
                                       Message = s.Message,
                                       UserRole = s.UserRole,
                                       Timestamp = s.Timestamp,
                                       Level = s.Level,
                                       LogType = s.LogType,
                                       City = s.City,
                                       IPAddress = s.IPAddress,
                                   })
                                   .OrderByDescending(s => s.Timestamp)
                                   .ToListAsync();
        var response = new SystemLogDto
        {
            SystemLogDetailsDtos = logDetails,
            NumberOfTotalLogs = logDetails.Count,
            NumberOfTotalLogsLastDay = logDetails.Where(l => l.Timestamp >= _lastDay).Count()
        };

        return Success(response);
    }


    #endregion
}



public enum EnLastDateType
{
    day = 1,
    week = 2,
    month = 3
}


public interface ISpecification<T>
{
    Expression<Func<T, bool>> Criteria { get; }
}

public class SystemLogSpecification : ISpecification<SystemLog>
{
    public Expression<Func<SystemLog, bool>> Criteria { get; }

    public SystemLogSpecification(string? email = null, DateTime? startDate = null, DateTime? endDate = null)
    {
        Criteria = s =>
            (string.IsNullOrEmpty(email) || s.Email == email) &&
            (!startDate.HasValue || s.Timestamp >= startDate.Value) &&
            (!endDate.HasValue || s.Timestamp <= endDate.Value);
    }
}
