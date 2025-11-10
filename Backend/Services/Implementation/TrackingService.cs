namespace Backend.Services.Implementation;

public class TrackingService : ResponseHandler, ITrackingService
{
    #region     Fields
    private readonly IUnitOfWork _unitOfWork;
    private readonly ApplicationDbContext _context;
    private DateTime _lastDay = DateTime.Now.AddDays(-1);
    private DateTime _lastWeek = DateTime.Now.AddDays(-7);
    private DateTime _lastMonth = DateTime.Now.AddDays(-30);
    private string _teacher = "Teacher";
    private string _student = "Student";
    private string _admin = "Admin";
    private string _unknown = "Unknown";
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
        var result = await _getLogs();



        var totalUniqUserToday = _DistictCountUnderDate(_lastDay, result);
        var totalUniqueUsersLastWeek = _DistictCountUnderDate(_lastWeek, result);
        var totalUniqueUsersLastMonth = _DistictCountUnderDate(_lastMonth, result);



        var totalUserToday = _CountUnderDate(_lastDay, result);
        var totalUsersLastWeek = _CountUnderDate(_lastWeek, result);
        var totalUsersLastMonth = _CountUnderDate(_lastMonth, result);

        var totalAdminToday = _CountUnderDate(_lastDay, result, _admin);
        var totalStudentToday = _CountUnderDate(_lastDay, result, _student);
        var totalTeacherToday = _CountUnderDate(_lastDay, result, _teacher);
        var totalUnkownToday = _CountUnderDate(_lastDay, result, _unknown);


        var totalAdminLastWeek = _CountUnderDate(_lastWeek, result, _admin);
        var totalStudentLastWeek = _CountUnderDate(_lastWeek, result, _student);
        var totalTeacherLastWeek = _CountUnderDate(_lastWeek, result, _teacher);
        var totalUnkownLastWeek = _CountUnderDate(_lastWeek, result, _unknown);


        var totalAdminLastMonth = _CountUnderDate(_lastMonth, result, _admin);
        var totalStudentLastMonth = _CountUnderDate(_lastMonth, result, _student);
        var totalTeacherLastMonth = _CountUnderDate(_lastMonth, result, _teacher);
        var totalUnkownLastMonth = _CountUnderDate(_lastMonth, result, _unknown);


        var dto = new StatisticUsersLogin()
        {
            SuccessLoginAttemptsLast24h = result.Where(l => l.Timestamp >= _lastDay).Count(),
            FailedLoginAttemptsLast24h = result.Where(l => l.Timestamp >= _lastDay && l.Level == "Error").Count(),

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
                                          Action = l.Path,
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
                                        Action = l.Path,
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
                                          Action = l.Path,
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
                                        Action = l.Path,
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

        var spec = new ActiveSystemLogSpecification(studentEmail, startDate, endDate);

        var logDetails = await _context.SystemLogs
                                   .Where(spec.Condition)
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
                                       Action = s.Path,
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
                                       Action = s.Path,
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

    private int _DistictCountUnderDate(DateTime lastDate, List<SystemLog> list)
    {
        var totalCount = list.Where(l => l.Timestamp >= lastDate)
                                 .DistinctBy(u => u.UserName)
                                 .Count();

        return totalCount;
    }
    private int _CountUnderDate(DateTime lastDate, List<SystemLog> list)
    {
        var count = list.Where(l => l.Timestamp >= _lastDay).Count();
        return count;
    }
    private int _CountUnderDate(DateTime lastDate, List<SystemLog> list, string role)
    {
        var count = list.Where(l => l.Timestamp >= _lastDay && l.UserRole == role).Count();
        return count;
    }
    private async Task<List<SystemLog>> _getLogs()
    {
        var result = await _unitOfWork.Repository<SystemLog>()
                                                 .GetTableNoTracking()
                                                 .Where(sl => sl.LogType == EnLogType.Logs)
                                                 .ToListAsync();
        return result;
    }

    #endregion
}

public interface ISpecification<T>
{
    Expression<Func<T, bool>> Condition { get; }
    List<Expression<Func<T, object>>> Includes { get; }
}

public abstract class BaseSpecification<T> : ISpecification<T>
{
    public Expression<Func<T, bool>> Condition { get; protected set; }
    public List<Expression<Func<T, object>>> Includes { get; }
        = new List<Expression<Func<T, object>>>();

    protected void AddInclude(Expression<Func<T, object>> includeExpression)
    {
        Includes.Add(includeExpression);
    }
}

public static class SpecificationEvaluator<T> where T : class
{
    public static IQueryable<T> GetQuery(IQueryable<T> inputQuery, ISpecification<T> spec)
    {
        var query = inputQuery;

        // Apply filter
        if (spec.Condition != null)
            query = query.Where(spec.Condition);

        // Apply includes
        query = spec.Includes.Aggregate(query, (current, include) => current.Include(include));

        return query;
    }
}


public class ActiveSystemLogSpecification : BaseSpecification<SystemLog>
{
    public ActiveSystemLogSpecification(string? email = null, DateTime? startDate = null, DateTime? endDate = null)
    {
        Condition = s =>
            (string.IsNullOrEmpty(email) || s.Email == email) &&
        (!startDate.HasValue || s.Timestamp >= startDate.Value) &&
            (!endDate.HasValue || s.Timestamp <= endDate.Value);

    }
}


//public class SystemLogSpecification : ISpecification<SystemLog>
//{
//    public Expression<Func<SystemLog, bool>> Condition { get; }

//    public SystemLogSpecification(string? email = null, DateTime? startDate = null, DateTime? endDate = null)
//    {
//        Condition = s =>
//            (string.IsNullOrEmpty(email) || s.Email == email) &&
//            (!startDate.HasValue || s.Timestamp >= startDate.Value) &&
//            (!endDate.HasValue || s.Timestamp <= endDate.Value);
//    }
//}