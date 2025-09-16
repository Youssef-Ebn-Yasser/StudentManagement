using Backend.DTOs.VedioDTOs;

namespace Backend.Helper;

public interface IVedioUpload
{
    public Task<(bool, string)> uploadVedio(IFormFile file, EnVedioPermision vedioPermision, EnVedioFor vedioFor, int? relatedBy,
                                              EnVedioUploadedBy vedioUploadedBy, int uploadedById, EnSavedInType savedInType);
    public Task<(string?, List<GetVedioLinksDto>?)> getLinks(EnVedioFor VedioFor, int? relatedBy);

    public Task<Response<List<CreateVedioDependencies>>> createVedioDependencies(EnVedioFor vedioFor);
}