using Backend.DTOs.AuthDTOs;
using System.Globalization;

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
        CultureInfo cultureInfo = Thread.CurrentThread.CurrentCulture;

        if (cultureInfo.TwoLetterISOLanguageName.ToLower().Equals("ar"))
        {
            return userType switch
            {
                UserType.Student => new Student
                {
                    Email = user.Email,
                    UserName = user.Name + user.Email + UserType.Student,
                    SecurityStamp = Guid.NewGuid().ToString(),
                    NameAr = user.Name,
                },
                UserType.Teacher => new Teacher
                {
                    Email = user.Email,
                    UserName = user.Name + user.Email + UserType.Teacher,
                    SecurityStamp = Guid.NewGuid().ToString(),
                    NameAr = user.Name,
                },
                UserType.Admin => new Admin
                {
                    Email = user.Email,
                    UserName = user.Name + user.Email + UserType.Admin,
                    SecurityStamp = Guid.NewGuid().ToString(),
                    NameAr = user.Name,
                },
                _ => throw new ArgumentException("Invalid user type", nameof(userType))
            };
        }
        else
        {
            return userType switch
            {
                UserType.Student => new Student
                {
                    Email = user.Email,
                    UserName = user.Name + user.Email + UserType.Student,
                    SecurityStamp = Guid.NewGuid().ToString(),
                    NameEn = user.Name,
                },
                UserType.Teacher => new Teacher
                {
                    Email = user.Email,
                    UserName = user.Name + user.Email + UserType.Teacher,
                    SecurityStamp = Guid.NewGuid().ToString(),
                    NameEn = user.Name,
                },
                UserType.Admin => new Admin
                {
                    Email = user.Email,
                    UserName = user.Name + user.Email + UserType.Admin,
                    SecurityStamp = Guid.NewGuid().ToString(),
                    NameEn = user.Name,
                },
                _ => throw new ArgumentException("Invalid user type", nameof(userType))
            };
        }
    }
}
