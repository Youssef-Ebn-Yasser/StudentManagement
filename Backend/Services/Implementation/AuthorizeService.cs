using Backend.DTOs.AuthorizeDTO;
using System.Security.Claims;

namespace Backend.Services.Implementation;

public class AuthorizeService : ResponseHandler, IAuthorizeService
{
    #region   Fields
    private readonly UserManager<User> _userManager;
    private readonly IUnitOfWork _unitOfWork;
    #endregion

    #region   Constructor
    public AuthorizeService(UserManager<User> userManager,
                            IUnitOfWork unitOfWork)
    {
        _userManager = userManager;
        _unitOfWork = unitOfWork;
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
        _unitOfWork.BeginTransaction();
        try
        {
            var user = await _userManager.FindByIdAsync(dto.UserId.ToString());
            if (user == null)
                return BadRequest<string>("UserIsNull");

            var userClaims = await _userManager.GetClaimsAsync(user);
            var removeClaimsResult = await _userManager.RemoveClaimsAsync(user, userClaims);

            if (!removeClaimsResult.Succeeded)
                return BadRequest<string>("FailedToRemoveOldClaims");

            var claims = dto.userClaims?.Where(x => x.Value == true)
                                                            .Select(x => new Claim(x.Type, x.Value.ToString()));

            var addUserClaimResult = await _userManager.AddClaimsAsync(user, claims!);
            if (!addUserClaimResult.Succeeded)
                return BadRequest<string>("FailedToAddNewClaims");

            _unitOfWork.CommitTransaction();
            return Success("Success");
        }
        catch
        {
            _unitOfWork.RollbackTransaction();
            return BadRequest<string>("FailedToUpdateClaims");
        }
    }
    #endregion
}