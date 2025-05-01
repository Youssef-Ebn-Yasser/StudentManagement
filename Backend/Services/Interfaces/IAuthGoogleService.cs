using Backend.DTOs.AuthDTOs;
using Google.Apis.Auth;

namespace Backend.Services.Interfaces;

public interface IAuthGoogleService
{
    public Task<Response<TokenDto>> AuthenticationWithGoogle(string idToken);
    public Task<GoogleJsonWebSignature.Payload> ValidateGoogleTokenAsync(string idToken);
}