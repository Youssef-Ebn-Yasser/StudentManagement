using System.Text.RegularExpressions;

namespace Backend.Helper;

public class GeminiObjectTranslator : IGeminiObjectTranslator
{
    #region   Fields
    private readonly GeminiService _geminiService;
    #endregion

    #region   Constructor
    public GeminiObjectTranslator(GeminiService geminiService)
    {
        _geminiService = geminiService;
    }
    #endregion

    #region   Methods
    public async Task<T?> TranslateObjectAsync<T>(T obj, string fromLang, string toLang)
    {
        var prompt = GenerateTranslationPrompt(obj, fromLang, toLang);
        var response = await _geminiService.GetResponseAsync(prompt);

        try
        {
            // Extract the first JSON object from the response using regex
            var match = Regex.Match(response, @"\{[\s\S]*\}");

            if (!match.Success)
            {
                Console.WriteLine("[TranslateObjectAsync] No valid JSON object found in response.");
                return default;
            }

            var jsonOnly = match.Value;

            var translatedObj = JsonConvert.DeserializeObject<T>(jsonOnly);
            return translatedObj;
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
    #endregion
}