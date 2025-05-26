namespace Backend.DataStructures
{
    public class ProctoringResult
    {
        public bool IsFaceDetected { get; set; }
        public int FaceCount { get; set; }
        public bool IsLookingAway { get; set; } // Placeholder for gaze estimation result
        public List<string> Issues { get; set; } = new List<string>();
        public bool PotentialCheatingDetected => Issues.Any();
    }
}

