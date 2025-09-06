using Backend.DTOs.AdminDTOs;
using Backend.DTOs.AuthorizeDTO;
using System.Security.Claims;

namespace Backend.Services.Implementation;

public class AuthorizeService : ResponseHandler, IAuthorizeService
{
    #region   Fields
    private readonly UserManager<User> _userManager;
    private readonly IUnitOfWork _unitOfWork;
    ApplicationDbContext _dbContext;
    #endregion

    #region   Constructor
    public AuthorizeService(UserManager<User> userManager,
                            IUnitOfWork unitOfWork,
                            ApplicationDbContext dbContext)
    {
        _userManager = userManager;
        _unitOfWork = unitOfWork;
        _dbContext = dbContext;
    }
    #endregion

    #region   Methods
    public async Task<Response<ManageUserClaimsDto>> ManageUserClaimData(int id)
    {
        var user = await _unitOfWork.Repository<User>()
                                        .GetTableAsTracking()
                                        .Where(u => u.Id == id && !u.IsDeleted)
                                        .FirstOrDefaultAsync();
        if (user == null)
            return BadRequest<ManageUserClaimsDto>("UserIsNull");

        var response = new ManageUserClaimsDto();
        var userClaimList = new List<UserClaims>();
        response.UserId = user.Id;

        var userClaims = await _userManager.GetClaimsAsync(user);

        foreach (var claim in ClaimsStore.claims)
        {
            var userClaim = new UserClaims();
            userClaim.Type = claim.Type;

            if (userClaims.Any(x => x.Type == claim.Type))
                userClaim.Value = true;
            else
                userClaim.Value = false;

            userClaimList.Add(userClaim);
        }
        response.userClaims = userClaimList;
        return Success(response);
    }

    public async Task<Response<string>> UpdateUserClaims(EditUserClaimsDto dto)
    {
        var strategy = _dbContext.Database.CreateExecutionStrategy();

        await strategy.ExecuteAsync(async () =>
        {
            using var transaction = await _dbContext.Database.BeginTransactionAsync();
            try
            {
                var user = await _userManager.FindByIdAsync(dto.UserId.ToString());
                if (user == null)
                    return BadRequest<string>("UserIsNull");

                var userClaims = await _userManager.GetClaimsAsync(user);
                var removeClaimsResult = await _userManager.RemoveClaimsAsync(user, userClaims);

                if (!removeClaimsResult.Succeeded)
                    return BadRequest<string>("FailedToRemoveOldClaims");

                var claims = dto.userClaims?
                    .Where(x => x.Value == true)
                    .Select(x => new Claim(x.Type, x.Value.ToString()));

                var addUserClaimResult = await _userManager.AddClaimsAsync(user, claims!);
                if (!addUserClaimResult.Succeeded)
                    return BadRequest<string>("FailedToAddNewClaims");

                await transaction.CommitAsync();
                return Success("Success");
            }
            catch
            {
                await transaction.RollbackAsync();
                return BadRequest<string>("FailedToUpdateClaims");
            }
        });
        return Success("Success");


        //try
        //{
        //    _unitOfWork.BeginTransaction();
        //    var user = await _userManager.FindByIdAsync(dto.UserId.ToString());
        //    if (user == null)
        //        return BadRequest<string>("UserIsNull");

        //    var userClaims = await _userManager.GetClaimsAsync(user);
        //    var removeClaimsResult = await _userManager.RemoveClaimsAsync(user, userClaims);

        //    if (!removeClaimsResult.Succeeded)
        //        return BadRequest<string>("FailedToRemoveOldClaims");

        //    var claims = dto.userClaims?.Where(x => x.Value == true)
        //                                                    .Select(x => new Claim(x.Type, x.Value.ToString()));

        //    var addUserClaimResult = await _userManager.AddClaimsAsync(user, claims!);
        //    if (!addUserClaimResult.Succeeded)
        //        return BadRequest<string>("FailedToAddNewClaims");

        //    //_unitOfWork.CommitTransaction();
        //    return Success("Success");
        //}
        //catch
        //{
        //    _unitOfWork.RollbackTransaction();
        //    return BadRequest<string>("FailedToUpdateClaims");
        //}
    }

    public async Task<Response<List<AdminDto>>> GetAllAdminsAsync()
    {
        var admins = await _unitOfWork.Repository<Admin>()
            .GetTableNoTracking()
            .Where(a => !a.IsDeleted)
            .Select(a => new AdminDto { Id = a.Id, Name = a.NameEn ?? string.Empty })
            .ToListAsync();
        return Success(admins);
    }

    public async Task<Response<AdminDto>> UpdateAdminAsync(UpdateAdminDto dto)
    {
        var admin = await _unitOfWork.Repository<Admin>()
            .GetTableAsTracking()
            .FirstOrDefaultAsync(a => a.Id == dto.Id && !a.IsDeleted);
        if (admin == null)
            return BadRequest<AdminDto>("Admin not found");
        admin.NameEn = dto.Name;
        _unitOfWork.Repository<Admin>().Update(admin);
        _unitOfWork.Complete();
        return Success(new AdminDto { Id = admin.Id, Name = admin.NameEn ?? string.Empty });
    }
    #endregion
}