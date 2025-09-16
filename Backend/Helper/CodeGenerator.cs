using System.Security.Cryptography;

namespace Backend.Helper;

public static class CodeGenerator
{
    private static readonly char[] _chars =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789".ToCharArray();

    public static string GenerateUniqueCode(int length = 10)
    {
        using var rng = RandomNumberGenerator.Create();
        var bytes = new byte[length];
        rng.GetBytes(bytes);

        return new string(bytes.Select(b => _chars[b % _chars.Length]).ToArray());
    }
}