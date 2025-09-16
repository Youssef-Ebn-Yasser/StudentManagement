using Backend.Controllers;
using System.Text.RegularExpressions;

namespace Backend.Helper;

public class GeminiObjectTranslator : IGeminiObjectTranslator
{
    #region   Fields
    private readonly GeminiService _geminiService;
    private readonly ApplicationDbContext _context;
    #endregion

    #region   Constructor
    public GeminiObjectTranslator(GeminiService geminiService, ApplicationDbContext context)
    {
        _geminiService = geminiService;
        _context = context;
    }
    #endregion

    #region   Methods
    public async Task<T?> TranslateObjectAsync<T>(T obj, string fromLang, string toLang)
    {
        var prompt = GenerateTranslationPrompt(obj, fromLang, toLang);
        var response = await _geminiService.GetResponseAsync(prompt);

        try
        {
            // Try to clean markdown if present
            response = response.Trim();

            if (response.StartsWith("```json"))
            {
                response = response.Replace("```json", "")
                                   .Replace("```", "")
                                   .Trim();
            }

            // Extract the first JSON object from the response using regex
            var match = Regex.Match(response, @"\{[\s\S]*\}");


            if (!match.Success)
            {
                Console.WriteLine("[TranslateObjectAsync] No valid JSON object found in response.");
                return default;
            }
            var jsonOnly = match.Value
               .Replace("{{", "{")
               .Replace("}}", "}")
               .Trim();
            var result = JsonConvert.DeserializeObject<Dictionary<T, T>>(jsonOnly);


            return result.Values.FirstOrDefault();

        }
        catch (Exception ex)
        {
            Console.WriteLine($"[TranslateObjectAsync] Deserialization failed: {ex.Message}");
            return default;
        }
    }

    public async Task<string> TranslateWordAsync<T>(T obj, string fromLang, string toLang)
    {
        var p = GenerateStringTranslationPrompt(obj, fromLang, toLang);
        var result = await _geminiService.GetResponseAsync(p);

        result = result
         .Replace("\\n", "")   // in case the token is literally “\n”
         .Replace("\r", "")
         .Replace("\n", "")
         .Trim();

        return result;
    }
    private static string GenerateTranslationPrompt<T>(T obj, string fromLang, string toLang)
    {
        var objectJson = JsonConvert.SerializeObject(obj, Formatting.Indented);
        return $@"
                    You are a translation engine. Translate all values in the following JSON object from {fromLang} to {toLang}.
                    DO NOT translate keys or structure. DO NOT add any explanation or comments.
                    Return only the JSON object, starting with '{{' and ending with '}}'.
                    
                    {objectJson}
                    ";
    }
    private static string GenerateStringTranslationPrompt<T>(T obj, string fromLang, string toLang)
    {
        var objectJson = JsonConvert.SerializeObject(obj, Formatting.Indented);
        return $@"
                    You are a translation engine. Translate value in the following  from {fromLang} to {toLang}.
                    DO NOT translate keys or structure. DO NOT add any explanation or comments.
                    Return only the translated word. and return only word without any new line or any thing just a word
                    without /n     if result like this ( وحدة\n ) i want it like this ( وحدة )
                    
                    {objectJson}
                    ";
    }

    public void test(forTest forTest)
    {
        var stu = new Category
        {
            CategoryNameEn = forTest.nameEn,
            IsDeleted = false,
            CategoryNameAr = forTest.nameAr,
        };

        _context.Categories.Add(stu);
        _context.SaveChanges();
    }
    #endregion
}