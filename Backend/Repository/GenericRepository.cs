using Backend.Context;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repository;

public class GenericRepository<T> : IGenericRepository<T> where T : class
{
    #region  Fields
    public ApplicationDbContext _dbContext { get; }
    #endregion

    #region  Constructor
    public GenericRepository(ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }
    #endregion

    #region  Methods

    public async Task AddAsync(T entity)
    {
        await _dbContext.Set<T>().AddAsync(entity);
    }

    public async Task AddRangeAsync(ICollection<T> entity)
    {
        await _dbContext.Set<T>().AddRangeAsync(entity);
    }

    public void Delete(T? entity)
    {
        _dbContext.Set<T>().Remove(entity!);
    }

    public void DeleteRange(ICollection<T> entities)
    {
        _dbContext.Set<T>().RemoveRange(entities);
    }

    public async Task<T> GetByIdAsync(int? id)
    {
        var result = await _dbContext.Set<T>().FindAsync(id);
        return result!;
    }

    public IQueryable<T> GetTableAsTracking()
    {
        return _dbContext.Set<T>().AsTracking().AsQueryable();
    }

    public IQueryable<T> GetTableNoTracking()
    {
        return _dbContext.Set<T>().AsNoTracking().AsQueryable();
    }

    public async Task SaveChanges()
    {
        await _dbContext.SaveChangesAsync();
    }

    public void Update(T entity)
    {
        _dbContext.Set<T>().Update(entity);
    }

    public void UpdateRanged(ICollection<T> entity)
    {
        _dbContext.Set<T>().UpdateRange(entity);
    }
    #endregion
}