using ElearningApi.Services;
using Microsoft.Azure.CognitiveServices.Vision.Face;
using Microsoft.Azure.CognitiveServices.Vision.Face.Models;
namespace Backend.Services.Implementation
{
    public class FaceService : ResponseHandler , IFaceService
    {
        private readonly FaceClient _faceClient;

        public FaceService(FaceClient faceClient)
        {
            _faceClient = faceClient;
        }

        public Task<IList<DetectedFace>> DetectFacesAsync(Stream imageStream)
        {
            return _faceClient.Face.DetectWithStreamAsync(
                imageStream,
                returnFaceId: true,
                detectionModel: DetectionModel.Detection01
            );
        }
    }
}
