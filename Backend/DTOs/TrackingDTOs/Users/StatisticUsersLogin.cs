namespace Backend.DTOs.TrackingDTOs.Users;

public class StatisticUsersLogin
{
    public int SuccessLoginAttemptsLast24h { get; set; }
    public int FailedLoginAttemptsLast24h { get; set; }
    public int TotalSuccessfulLogins { get; set; }
    public int TotalFailedLogins { get; set; }
    public int TotalUniqueUsersToday { get; set; }
    public int TotalUniqueUsersLastWeek { get; set; }
    public int TotalUniqueUsersLastMonth { get; set; }
    public RolePercentageDto? PercentageByRoleLastMonth { get; set; }
    public RolePercentageDto? PercentageByRoleLastDay { get; set; }
    public RolePercentageDto? PercentageByRoleLastWeek { get; set; }
}

public class RolePercentageDto
{
    public double Students { get; set; }
    public double Teachers { get; set; }
    public double Admins { get; set; }
    public double Unknown { get; set; }
}