namespace Backend.Helper;

public interface IVedioUpload
{
    public Task<(bool, string)> uploadVedio(IFormFile file, EnVedioPermision vedioPermision, EnVedioFor vedioFor, int? relatedBy,
                                              EnVedioUploadedBy vedioUploadedBy, int uploadedById, EnSavedInType savedInType);
    public Task<(string?, List<GetVedioLinksDto>?)> getLinks(EnVedioFor VedioFor, int? relatedBy);

    public Task<Response<List<CreateVedioDependencies>>> createVedioDependencies(EnVedioFor vedioFor);
    public Task<Response<List<GetVediosDto>>> GetAllVedios();
    public Task<Response<GetVedioDetailsDto>> GetVedioDetails(int id);
    public Task<Response<string>> DeleteVedio(int id);
    public Task<Response<string>> UpdateVedioPermision(int id, EnVedioPermision Permision);
}