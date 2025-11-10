
namespace Backend.Cultures;

public class JsonStringLocalizer : IStringLocalizer
{
    private readonly Dictionary<string, string> _localizations;

    public JsonStringLocalizer(string culture)
    {
        var path = Path.Combine("Resources", $"Resources.{culture}.json");
        if (System.IO.File.Exists(path))
        {
            var json = System.IO.File.ReadAllText(path);
            _localizations = System.Text.Json.JsonSerializer.Deserialize<Dictionary<string, string>>(json);
        }
        else
        {
            _localizations = new Dictionary<string, string>();
        }
    }

    public LocalizedString this[string name]
    {
        get
        {
            if (_localizations.TryGetValue(name, out var value))
                return new LocalizedString(name, value, resourceNotFound: false);

            return new LocalizedString(name, name, resourceNotFound: true);
        }
    }

    public LocalizedString this[string name, params object[] arguments]
        => new LocalizedString(name, string.Format(this[name].Value, arguments), resourceNotFound: false);

    public IEnumerable<LocalizedString> GetAllStrings(bool includeParentCultures)
        => _localizations.Select(kvp => new LocalizedString(kvp.Key, kvp.Value, false));

    // Implement other interface members as needed
}
