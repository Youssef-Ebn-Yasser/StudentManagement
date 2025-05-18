using Backend.DTOs.AuthDTOs;

namespace Backend.Helper;

public enum UserType
{
    Student,
    Teacher,
    Admin
}


public static class UserCreate
{
    public static User CreateUser(UserType userType, RegisterDto user)
    {
        return userType switch
        {
            UserType.Student => new Student
            {
                Email = user.Email,
                UserName = user.Email,
                SecurityStamp = Guid.NewGuid().ToString(),
                Name = user.Name,
            },
            UserType.Teacher => new Teacher
            {
                Email = user.Email,
                UserName = user.Email,
                SecurityStamp = Guid.NewGuid().ToString(),
                Name = user.Name,
            },
            UserType.Admin => new Admin
            {
                Email = user.Email,
                UserName = user.Email,
                SecurityStamp = Guid.NewGuid().ToString(),
                Name = user.Name,
            },
            _ => throw new ArgumentException("Invalid user type", nameof(userType))
        };
    }
}
