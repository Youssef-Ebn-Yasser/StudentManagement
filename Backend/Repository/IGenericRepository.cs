namespace Backend.Repository;

public interface IGenericRepository<T>
        where T : class
{
    Task<T> GetByIdAsync(int? id);

    IQueryable<T> GetTableNoTracking();
    IQueryable<T> GetTableAsTracking();
    Task<IReadOnlyList<T>> GetAllAsync();

    Task AddAsync(T entity);
    Task AddRangeAsync(ICollection<T> entity);

    void Update(T entity);
    void UpdateRanged(ICollection<T> entity);

    void Delete(T entity);
    void DeleteRange(ICollection<T> entities);

    Task SaveChanges();
}