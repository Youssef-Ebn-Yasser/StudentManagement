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
    #endregion
}