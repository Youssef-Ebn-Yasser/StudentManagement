using System.Diagnostics;

namespace YourApp.Controllers
{
    [Route("api/video")]
    [ApiController]
    public class HlsVideoController : ControllerBase
    {
        private readonly string _hlsRoot;
        private readonly IWebHostEnvironment _env;
        public HlsVideoController(IWebHostEnvironment env)
        {
            _env = env;
            _hlsRoot = Path.Combine(env.ContentRootPath, "HlsStorage");
            if (!Directory.Exists(_hlsRoot))
                Directory.CreateDirectory(_hlsRoot);
        }

        [HttpPost("upload")]
        [RequestSizeLimit(1_000_000_000)] // 1 GB max
        public async Task<IActionResult> Upload(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("No file uploaded.");

            var folderName = Path.GetFileNameWithoutExtension(file.FileName)
                             + "_" + Guid.NewGuid().ToString("N");

            var videoFolder = Path.Combine(_hlsRoot, folderName);
            Directory.CreateDirectory(videoFolder);

            var inputFilePath = Path.Combine(videoFolder, file.FileName);

            // Save uploaded video
            await using (var stream = new FileStream(inputFilePath, FileMode.Create))
                await file.CopyToAsync(stream);

            // Return immediately and process FFmpeg in background
            _ = Task.Run(async () =>
            {
                try
                {
                    var outputM3u8 = Path.Combine(videoFolder, "index.m3u8");
                    var ffmpegPath = Path.Combine(_env.ContentRootPath, "wwwroot", "tools", "ffmpeg.exe");

                    var ffmpegArgs = $"-i \"{inputFilePath}\" -profile:v baseline -level 3.0 -start_number 0 " +
                                     $"-hls_time 10 -hls_list_size 0 -f hls \"{outputM3u8}\"";

                    var process = new Process
                    {
                        StartInfo = new ProcessStartInfo
                        {
                            FileName = ffmpegPath,
                            Arguments = ffmpegArgs,
                            RedirectStandardOutput = true,
                            RedirectStandardError = true,
                            UseShellExecute = false,
                            CreateNoWindow = true,
                            WorkingDirectory = Path.GetDirectoryName(inputFilePath)
                        }
                    };

                    process.Start();
                    string stderr = await process.StandardError.ReadToEndAsync();
                    string stdout = await process.StandardOutput.ReadToEndAsync();
                    await process.WaitForExitAsync();

                    if (process.ExitCode != 0)
                    {
                        Console.WriteLine($"FFmpeg failed for {file.FileName}: {stderr}");
                    }
                    else
                    {
                        Console.WriteLine($"FFmpeg finished successfully for {file.FileName}");
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine("Error during HLS conversion: " + ex.Message);
                }
            });

            // Immediately return to the client
            return Ok(new
            {
                Message = "Upload received. HLS conversion is in progress.",
                Folder = folderName,
                HlsUrl = $"/api/video/hls/{folderName}/index.m3u8"
            });
        }

        [HttpGet("hls/{folder}/{file}")]
        public IActionResult GetHlsFile(string folder, string file)
        {
            var filePath = Path.Combine(_hlsRoot, folder, file);

            if (!System.IO.File.Exists(filePath))
                return NotFound();

            string contentType = "application/octet-stream";
            if (file.EndsWith(".m3u8"))
                contentType = "application/vnd.apple.mpegurl";
            else if (file.EndsWith(".ts"))
                contentType = "video/mp2t";

            var stream = new FileStream(filePath, FileMode.Open, FileAccess.Read, FileShare.Read);
            return File(stream, contentType);
        }
    }
}


