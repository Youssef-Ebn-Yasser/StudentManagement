using Backend.DTOs.AdminDTOs;
using Backend.DTOs.AuthorizeDTO;

namespace Backend.Services.Interfaces;

public interface IAuthorizeService
{
    public Task<Response<ManageUserClaimsDto>> ManageUserClaimData(int id);
    public Task<Response<string>> UpdateUserClaims(EditUserClaimsDto dto);
    public Task<Response<List<AdminDto>>> GetAllAdminsAsync();
    public Task<Response<AdminDto>> UpdateAdminAsync(UpdateAdminDto dto);
}