namespace Backend.Helper;

public class GeneralLocalizableEntity
{
    public static string? Localized(string? textAr, string? textEn)
    {
        CultureInfo cultureInfo = Thread.CurrentThread.CurrentCulture;

        if (cultureInfo.TwoLetterISOLanguageName.ToLower().Equals("ar"))
            return textAr;

        return textEn;
    }
}