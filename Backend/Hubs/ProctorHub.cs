using Microsoft.AspNetCore.SignalR;
using Microsoft.Azure.CognitiveServices.Vision.Face;
using Microsoft.Azure.CognitiveServices.Vision.Face.Models;

namespace Backend.Hubs
{
    public class ProctorHub : Hub
    {
        private readonly FaceClient _faceClient;
        private const string PersonGroupId = "exam-group"; // Optional usage later

        public ProctorHub()
        {
            // Initialize the FaceClient with proper credentials
            var credentials = new ApiKeyServiceClientCredentials("YourSubscriptionKey");
            _faceClient = new FaceClient(credentials)
            {
                Endpoint = "YourEndpoint"
            };
        }

        public async Task SendFrame(string base64Jpeg)
        {
            var bytes = Convert.FromBase64String(base64Jpeg);
            using var ms = new MemoryStream(bytes);

            IList<DetectedFace> faces = await _faceClient.Face.DetectWithStreamAsync(
                ms,
                returnFaceId: true,
                detectionModel: DetectionModel.Detection01
            );

            if (faces.Count > 1)
            {
                await Clients.Caller.SendAsync("CheatDetected", "Multiple faces detected!");
            }
        }
    }
}
