using Backend.Context;
using Backend.Repository;

namespace Backend.UniteOfWork;

public class UnitOfWork : IUnitOfWork
{
    #region Fields
    private readonly ApplicationDbContext _context;
    private readonly Dictionary<Type, object> _repositories = new Dictionary<Type, object>();
    #endregion

    #region Constructor
    public UnitOfWork(ApplicationDbContext context)
    {
        _context = context;
    }
    #endregion

    #region Handle Methods

    public IGenericRepository<T> Repository<T>() where T : class
    {
        if (_repositories.ContainsKey(typeof(T)))
        {
            return _repositories[typeof(T)!] as IGenericRepository<T>;
        }

        var repository = new GenericRepository<T>(_context);
        _repositories.Add(typeof(T), repository);

        return repository;
    }
    public void BeginTransaction()
    {
        _context.Database.BeginTransaction();

    }

    public void CommitTransaction()
    {
        _context.Database.CommitTransaction();
    }

    public void RollbackTransaction()
    {
        _context.Database.RollbackTransaction();
    }

    public int Complete()
    {
        return _context.SaveChanges();
    }

    public void Dispose()
    {
        _context.Dispose();
    }
    #endregion
}