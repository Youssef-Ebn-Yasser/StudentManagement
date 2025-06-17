namespace Backend.Helper;

public interface IGeminiObjectTranslator
{
    public Task<T?> TranslateObjectAsync<T>(T obj, string fromLang, string toLang);
}