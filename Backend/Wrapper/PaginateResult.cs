namespace Backend.Wrapper;
public class PaginateResult<T>
{
    public PaginateResult(bool succeeded, List<T>? data = default, List<string>? Message = null, int page = 1, int pageSize = 10, int count = 0)
    {
        Data = data;
        CurrentPage = page;
        Succeeded = succeeded;
        PageSize = pageSize;
        TotalPage = (int)Math.Ceiling(count / (double)pageSize);
        TotalCount = count;
    }
    public List<T>? Data { get; set; }
    public static PaginateResult<T> Success(List<T> data, int page, int pageSize, int count)
    {
        return new(true, data, null, page, pageSize, count);
    }
    public int CurrentPage { get; set; }
    public int TotalPage { get; set; }
    public int TotalCount { get; set; }
    public object? Meta { get; set; }
    public int PageSize { get; set; }
    public bool HasPreviousPage => CurrentPage > 1;
    public bool HasNextPage => CurrentPage < TotalPage;
    public List<string> Message { get; set; } = new();
    public bool Succeeded { get; set; }
}