using Microsoft.ML.OnnxRuntime;
using Microsoft.ML.OnnxRuntime.Tensors;
using Backend.DataStructures;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.PixelFormats;
using SixLabors.ImageSharp.Processing;
using System.Diagnostics;

namespace Backend.Services
{
    public class ProctoringService
    {
        private readonly OnnxModelService _onnxModelService;
        private readonly ILogger<ProctoringService> _logger;

        // Define model input/output specifics (adjust based on actual model inspection)
        private const int FaceModelInputWidth = 640; // Example, adjust for yolov5s-face
        private const int FaceModelInputHeight = 640; // Example, adjust for yolov5s-face
        private const int LandmarkModelInputWidth = 192; // Example, adjust for landmarks_68_pfld
        private const int LandmarkModelInputHeight = 192; // Example, adjust for landmarks_68_pfld

        public ProctoringService(OnnxModelService onnxModelService, ILogger<ProctoringService> logger)
        {
            _onnxModelService = onnxModelService;
            _logger = logger;
            _logger.LogInformation("ProctoringService initialized.");
        }

        public ProctoringResult Analyze(string imageBase64)
        {
            var result = new ProctoringResult();
            var stopwatch = Stopwatch.StartNew();

            try
            {
                // 1. Decode Base64 and Load Image
                byte[] imageBytes = Convert.FromBase64String(imageBase64.Split(',')[1]); // Handle potential data URI prefix
                using var image = Image.Load<Rgb24>(imageBytes);
                _logger.LogInformation($"Image loaded: {image.Width}x{image.Height}");

                // 2. Preprocess for Face Detection (Resize, Normalize - Placeholder)
                var faceInputTensor = PreprocessImageForFaceDetection(image);

                // 3. Run Face Detection Inference
                var faceDetectionOutputs = RunFaceDetection(faceInputTensor);

                // 4. Postprocess Face Detection Results (Placeholder)
                var detectedFaces = PostprocessFaceDetection(faceDetectionOutputs, image.Width, image.Height);
                result.FaceCount = detectedFaces.Count;
                result.IsFaceDetected = result.FaceCount > 0;
                _logger.LogInformation($"Detected {result.FaceCount} faces.");

                if (result.FaceCount == 0)
                {
                    result.Issues.Add("No face detected.");
                }
                else if (result.FaceCount > 1)
                {
                    result.Issues.Add("Multiple faces detected.");
                }
                else // Exactly one face detected
                {
                    var faceBox = detectedFaces[0]; // Assuming the first one is the target

                    // 5. Crop Face and Preprocess for Landmark Detection
                    using var croppedFace = CropAndPreprocessForLandmarks(image, faceBox);
                    var landmarkInputTensor = ConvertImageToTensor(croppedFace, LandmarkModelInputWidth, LandmarkModelInputHeight);

                    // 6. Run Landmark Detection Inference
                    var landmarkOutputs = RunLandmarkDetection(landmarkInputTensor);

                    // 7. Postprocess Landmark Results (Placeholder)
                    var landmarks = PostprocessLandmarks(landmarkOutputs);
                    _logger.LogInformation($"Detected {landmarks.Count} landmarks.");

                    // 8. Preprocess for Gaze Estimation (Placeholder - Requires landmarks and potentially image)
                    // var gazeInput = PrepareGazeInput(image, faceBox, landmarks);

                    // 9. Run Gaze Estimation Inference (Placeholder)
                    // var gazeOutputs = RunGazeEstimation(gazeInput);

                    // 10. Postprocess Gaze Estimation and Update Result (Placeholder)
                    // result.IsLookingAway = IsLookingAway(gazeOutputs);
                    // if (result.IsLookingAway) result.Issues.Add("Student potentially looking away.");
                    result.Issues.Add("Gaze estimation not implemented yet."); // Placeholder issue
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during proctoring analysis.");
                result.Issues.Add($"An error occurred: {ex.Message}");
            }

            stopwatch.Stop();
            _logger.LogInformation($"Analysis completed in {stopwatch.ElapsedMilliseconds} ms.");
            return result;
        }

        private Tensor<float> PreprocessImageForFaceDetection(Image<Rgb24> image)
        {
            // Resize, normalize, and convert to tensor format expected by yolov5s-face
            // This is a simplified placeholder - actual preprocessing depends heavily on the model
            return ConvertImageToTensor(image, FaceModelInputWidth, FaceModelInputHeight);
        }

        private IReadOnlyCollection<NamedOnnxValue> RunFaceDetection(Tensor<float> inputTensor)
        {
            var inputs = new List<NamedOnnxValue> { NamedOnnxValue.CreateFromTensor("images", inputTensor) }; // Input name might differ
            var session = _onnxModelService.GetFaceDetectionSession();
            lock (session) // Protect session if service is Singleton and controller is Scoped/Transient
            {
                 return session.Run(inputs);
            }
        }

        // Placeholder - Actual implementation depends on yolov5s-face output format
        private List<RectangleF> PostprocessFaceDetection(IReadOnlyCollection<NamedOnnxValue> outputs, int originalWidth, int originalHeight)
        {
            _logger.LogInformation("Postprocessing face detection results (placeholder)...");
            // Example: Parse output tensor(s), apply NMS, scale boxes to original image size
            // Returning a dummy box for now if output exists
            if (outputs.Any()) {
                 // Dummy box covering a central part of the image
                 float boxWidth = originalWidth * 0.4f;
                 float boxHeight = originalHeight * 0.5f;
                 float x = (originalWidth - boxWidth) / 2f;
                 float y = (originalHeight - boxHeight) / 2f;
                 return new List<RectangleF> { new RectangleF(x, y, boxWidth, boxHeight) };
            }
            return new List<RectangleF>();
        }

        private Image<Rgb24> CropAndPreprocessForLandmarks(Image<Rgb24> originalImage, RectangleF faceBox)
        {
            var cropRectangle = new Rectangle(
                (int)faceBox.X,
                (int)faceBox.Y,
                (int)faceBox.Width,
                (int)faceBox.Height
            );

            // Ensure crop rectangle is within image bounds
            cropRectangle.Intersect(originalImage.Bounds);
            if (cropRectangle.Width <= 0 || cropRectangle.Height <= 0) {
                 _logger.LogWarning("Invalid crop rectangle calculated.");
                 // Return a small blank image or handle error appropriately
                 return new Image<Rgb24>(1, 1);
            }


            var cropped = originalImage.Clone(ctx => ctx.Crop(cropRectangle));
            _logger.LogInformation($"Cropped face image: {cropped.Width}x{cropped.Height}");
            // Further preprocessing (resize, normalize) for landmark model might be needed here
            // For now, just return the cropped image
            return cropped;
        }

         private IReadOnlyCollection<NamedOnnxValue> RunLandmarkDetection(Tensor<float> inputTensor)
        {
            var inputs = new List<NamedOnnxValue> { NamedOnnxValue.CreateFromTensor("input", inputTensor) }; // Input name might differ
            var session = _onnxModelService.GetLandmarkDetectionSession();
             lock (session)
            {
                return session.Run(inputs);
            }
        }

        // Placeholder - Actual implementation depends on landmarks_68_pfld output format
        private List<PointF> PostprocessLandmarks(IReadOnlyCollection<NamedOnnxValue> outputs)
        {
             _logger.LogInformation("Postprocessing landmark detection results (placeholder)...");
            // Example: Parse output tensor(s) containing landmark coordinates
            // Returning dummy points for now
             if (outputs.Any()) {
                 return Enumerable.Range(0, 5).Select(i => new PointF(i * 10, i * 10)).ToList(); // Dummy landmarks
             }
            return new List<PointF>();
        }

        // Helper to convert ImageSharp image to Tensor
        // NOTE: This is a basic example. Normalization and channel ordering (RGB vs BGR)
        // must match the specific model's requirements.
        private Tensor<float> ConvertImageToTensor(Image<Rgb24> image, int targetWidth, int targetHeight)
        {
            image.Mutate(x => x.Resize(new ResizeOptions
            {
                Size = new Size(targetWidth, targetHeight),
                Mode = ResizeMode.Crop // Or Pad, Stretch, etc., depending on model needs
            }));

            var tensor = new DenseTensor<float>(new[] { 1, 3, targetHeight, targetWidth });

            image.ProcessPixelRows(accessor =>
            {
                for (int y = 0; y < accessor.Height; y++)
                {
                    Span<Rgb24> pixelRow = accessor.GetRowSpan(y);
                    for (int x = 0; x < accessor.Width; x++)
                    {
                        // Assuming NCHW format and pixel values normalized to [0, 1]
                        tensor[0, 0, y, x] = pixelRow[x].R / 255f;
                        tensor[0, 1, y, x] = pixelRow[x].G / 255f;
                        tensor[0, 2, y, x] = pixelRow[x].B / 255f;
                    }
                }
            });
            return tensor;
        }

        // TODO: Implement gaze estimation steps (PrepareGazeInput, RunGazeEstimation, PostprocessGazeEstimation, IsLookingAway)
    }
}

