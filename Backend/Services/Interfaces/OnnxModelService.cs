using Microsoft.ML.OnnxRuntime;

namespace Backend.Services
{
    public class OnnxModelService : IDisposable
    {
        private readonly InferenceSession _faceDetectionSession;
        private readonly InferenceSession _landmarkDetectionSession;
        // private readonly InferenceSession _gazeEstimationSession; // TODO: Add gaze estimation model

        private readonly string _faceModelPath = Path.Combine("Models", "yolov5s-face.onnx");
        private readonly string _landmarkModelPath = Path.Combine("Models", "landmarks_68_pfld.onnx");
        // private readonly string _gazeModelPath = Path.Combine("Models", "gaze_estimation_model.onnx"); // TODO: Update path

        public OnnxModelService()
        {
            // Consider using SessionOptions for GPU execution if needed
            var sessionOptions = new Microsoft.ML.OnnxRuntime.SessionOptions(); 

            _faceDetectionSession = new InferenceSession(_faceModelPath, sessionOptions);
            _landmarkDetectionSession = new InferenceSession(_landmarkModelPath, sessionOptions);
            // _gazeEstimationSession = new InferenceSession(_gazeModelPath, sessionOptions); // TODO: Load gaze model

            Console.WriteLine("ONNX Models loaded successfully.");
        }

        public InferenceSession GetFaceDetectionSession()
        {
            return _faceDetectionSession;
        }

        public InferenceSession GetLandmarkDetectionSession()
        {
            return _landmarkDetectionSession;
        }

        // public InferenceSession GetGazeEstimationSession()
        // {
        //     return _gazeEstimationSession;
        // }

        public void Dispose()
        {
            _faceDetectionSession?.Dispose();
            _landmarkDetectionSession?.Dispose();
            // _gazeEstimationSession?.Dispose();
            GC.SuppressFinalize(this);
        }
    }
}

