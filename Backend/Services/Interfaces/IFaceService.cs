using Microsoft.Azure.CognitiveServices.Vision.Face.Models;

namespace ElearningApi.Services
{
    public interface IFaceService
    {
        Task<IList<DetectedFace>> DetectFacesAsync(Stream imageStream);
    }
}
