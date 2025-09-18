using Backend.DTOs.VedioDTOs;
using System.Diagnostics;
using System.Text.Json;
namespace Backend.Helper;

public class VedioUpload : ResponseHandler, IVedioUpload
{
    #region   Fields
    private readonly string _hlsRoot;
    private readonly IWebHostEnvironment _env;
    private readonly ApplicationDbContext _context;
    #endregion


    #region    Constructor
    public VedioUpload(IWebHostEnvironment env, ApplicationDbContext context)
    {
        _env = env;
        _hlsRoot = Path.Combine(env.ContentRootPath, "wwwroot");
        if (!Directory.Exists(_hlsRoot))
            Directory.CreateDirectory(_hlsRoot);
        _context = context;
    }
    #endregion

    #region    Method

    //private async Task ConvertToHLS(string inputFilePath, string videoFolder)
    //{
    //    try
    //    {
    //        Directory.CreateDirectory(videoFolder);

    //        var ffmpegFolder = Path.Combine(_env.ContentRootPath, "tool");
    //        Directory.CreateDirectory(ffmpegFolder);

    //        await FFmpegDownloader.GetLatestVersion(FFmpegVersion.Official); // remove folder param
    //        FFmpeg.SetExecutablesPath(ffmpegFolder);

    //        var outputM3u8 = Path.Combine(videoFolder, "index.m3u8");

    //        var conversion = await FFmpeg.Conversions.New()
    //            .AddParameter($"-i \"{inputFilePath}\"")
    //            .AddParameter("-c:v libx264")
    //            .AddParameter("-c:a aac")
    //            .AddParameter("-strict -2")
    //            .AddParameter("-profile:v baseline -level 3.0 -start_number 0")
    //            .AddParameter("-hls_time 10")
    //            .AddParameter("-hls_list_size 0")
    //            .AddParameter("-hls_segment_filename \"" + Path.Combine(videoFolder, "segment_%03d.ts") + "\"")
    //            .AddParameter($"\"{outputM3u8}\"")
    //            .Start();
    //    }
    //    catch (Exception ex)
    //    {
    //        Console.WriteLine("Error converting video: " + ex.Message);
    //    }
    //}



    public async Task<(bool, string)> uploadVedio(IFormFile file, EnVedioPermision vedioPermision, EnVedioFor vedioFor, int? relatedBy,
                                              EnVedioUploadedBy vedioUploadedBy, int uploadedById, EnSavedInType savedInType)
    {

        if (file == null || file.Length == 0)
            return (false, "No file uploaded.");

        //  validate  data
        var validData = ExistsVedio(vedioFor, relatedBy);
        if (validData == false) return (false, "Data entered not true");


        var folderName = GenerateFolderName(file.FileName);
        var videoFolder = GenerateVedioFolder(folderName);
        var inputFilePath = GetFullPathForCompleteVedio(file.FileName, videoFolder);
        await SaveCompleteVedio(inputFilePath, file);


        var baseUrl = _env.IsDevelopment() ? "https://localhost:7099" : "http://e-learn-v2.runasp.net";
        var publicUrl = $"{baseUrl}/videos/{folderName}/{Path.GetFileName(inputFilePath)}";

        var vedioDetails = new VedioesDetails()
        {
            EnableDownloadedUrl = publicUrl,
            VedioPermision = vedioPermision,
            VedioUploadedBy = vedioUploadedBy,
            RelatedById = relatedBy,
            UploadedById = uploadedById,
            VedioFor = vedioFor,
            SavedIn = savedInType,
        };


        if (savedInType == EnSavedInType.local)
        {
            ChuncksVedioUsingFFmpeg(inputFilePath, videoFolder);
            //ConvertToHLS(inputFilePath, videoFolder);
            vedioDetails.DisableDownloadedFile = $"index.m3u8";
            vedioDetails.DisableDownloadedFolder = folderName;
        }
        else if (savedInType == EnSavedInType.openVedio)
        {
            var opeVedioPath = await UploadToApiVideo(file);
            //var opeVedioPath = await UploadVideoSecureAsync(file);

            vedioDetails.ThirdPartyLink = opeVedioPath;
        }

        _context.VedioesDetails.Add(vedioDetails);
        var response = await _context.SaveChangesAsync();

        return response > 0 ? (true, "success") : (false, "can not added");
    }

    public async Task<(string?, List<GetVedioLinksDto>?)> getLinks(EnVedioFor VedioFor, int? relatedBy)
    {
        // return depend on permision
        var vedioes = await _context.VedioesDetails
                                                  .Where(v => v.RelatedById == relatedBy && v.VedioFor == VedioFor)
                                                  .ToListAsync();

        if (vedioes == null)
            return ("No video found.", null);


        var linksDto = new List<GetVedioLinksDto>();

        foreach (var vedio in vedioes)
        {
            var linkDto = new GetVedioLinksDto();
            // check permision 
            if (vedio.VedioPermision == EnVedioPermision.enable)
            {
                linkDto.links.Add(vedio.EnableDownloadedUrl);
            }
            else
            {
                if (vedio.SavedIn == EnSavedInType.local)
                {
                    string folder = vedio.DisableDownloadedFolder;
                    string file = vedio.DisableDownloadedFile;

                    linkDto.links.Add($"{folder}/{file}");
                }
                else if (vedio.SavedIn == EnSavedInType.openVedio)
                {
                    linkDto.links.Add(vedio.ThirdPartyLink);
                }

            }

            linkDto.VedioPermision = vedio.VedioPermision;
            linkDto.SavedInType = vedio.SavedIn;

            linksDto.Add(linkDto);
        }

        return (null, linksDto);
    }

    private string GenerateFolderName(string fileName)
    {
        var folderName = Path.GetFileNameWithoutExtension(fileName)
                      .Replace(" ", "")
           + "_" + Guid.NewGuid().ToString("N");

        return folderName;
    }
    private string GenerateVedioFolder(string folderName)
    {
        var videoFolder = Path.Combine(_hlsRoot, folderName);
        Directory.CreateDirectory(videoFolder);

        return videoFolder;
    }

    private string GetFullPathForCompleteVedio(string fileName, string videoFolder)
    {
        // Get the file extension
        var extension = Path.GetExtension(fileName); // e.g., ".mp4"

        // Generate a completely random name
        var randomFileName = Guid.NewGuid().ToString("N") + extension;

        // Full path to save the video
        var inputFilePath = Path.Combine(videoFolder, randomFileName);

        return inputFilePath;
    }

    private async Task SaveCompleteVedio(string inputFilePath, IFormFile file)
    {
        await using (var stream = new FileStream(inputFilePath, FileMode.Create))
            await file.CopyToAsync(stream);
    }

    private void ChuncksVedioUsingFFmpeg(string inputFilePath, string videoFolder)
    {
        _ = Task.Run(async () =>
        {
            try
            {
                var outputM3u8 = Path.Combine(videoFolder, "index.m3u8");
                var ffmpegPath = Path.Combine(_env.ContentRootPath, "wwwroot", "tool", "ffmpeg.exe");

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
                    // log faild operation
                }
                else
                {
                    // log save operation
                }
            }
            catch (Exception ex)
            {
                // log error happen
            }
        });

    }

    private bool? ExistsVedio(EnVedioFor vedioFor, int? relatedBy)
    {
        if (relatedBy == null) return null;

        switch (vedioFor)
        {
            case EnVedioFor.Course:
                return _context.Courses.Any(c => c.Id == relatedBy && (bool)!c.IsDeleted);

            case EnVedioFor.Lession:
                return _context.Lessons.Any(l => l.Id == relatedBy && !l.IsDeleted);

            case EnVedioFor.TeacherProfile:
                return _context.Teachers.Any(t => t.Id == relatedBy && !t.IsDeleted);

            case EnVedioFor.StudentProfile:
                return _context.Students.Any(s => s.Id == relatedBy && !s.IsDeleted);

            default:
                return null;
        }
    }

    // using external
    private async Task<string> UploadToApiVideo(IFormFile file)
    {
        using var httpClient = new HttpClient();
        httpClient.DefaultRequestHeaders.Add("Authorization", "Bearer mJBi15X5DCXMgc9U59ipXKZFpJzevs2wO4uQiIlFqT9");


        // 1. Create video object
        var videoMetadata = new
        {
            title = Path.GetFileNameWithoutExtension(file.FileName),
            description = "Uploaded from .NET backend",
            @public = true // make it accessible
        };

        var jsonContent = new StringContent(System.Text.Json.JsonSerializer.Serialize(videoMetadata), Encoding.UTF8, "application/json");
        var createResponse = await httpClient.PostAsync("https://ws.api.video/videos", jsonContent);
        createResponse.EnsureSuccessStatusCode();

        var createJson = await createResponse.Content.ReadAsStringAsync();
        var createDoc = JsonDocument.Parse(createJson);
        var videoId = createDoc.RootElement.GetProperty("videoId").GetString();

        // 2. Upload file to created video
        using var content = new MultipartFormDataContent();
        using var fileStream = file.OpenReadStream();
        content.Add(new StreamContent(fileStream), "file", file.FileName);

        var uploadResponse = await httpClient.PostAsync($"https://ws.api.video/videos/{videoId}/source", content);
        uploadResponse.EnsureSuccessStatusCode();

        // 3. Return HLS playback URL
        return $"https://embed.api.video/vod/{videoId}/manifest.m3u8";
    }
    public async Task<string> UploadVideoSecureAsync(IFormFile file)
    {
        using var httpClient = new HttpClient();
        httpClient.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Bearer", "mJBi15X5DCXMgc9U59ipXKZFpJzevs2wO4uQiIlFqT9");

        // 1️⃣ Create video object as PRIVATE
        var videoMetadata = new
        {
            title = Path.GetFileNameWithoutExtension(file.FileName),
            description = "Uploaded from .NET backend",
            @public = false  // PRIVATE video
        };

        var jsonContent = new StringContent(JsonConvert.SerializeObject(videoMetadata), Encoding.UTF8, "application/json");
        var createResponse = await httpClient.PostAsync("https://ws.api.video/videos", jsonContent);
        createResponse.EnsureSuccessStatusCode();

        var createJson = await createResponse.Content.ReadAsStringAsync();
        var createDoc = JsonDocument.Parse(createJson);
        var videoId = createDoc.RootElement.GetProperty("videoId").GetString();

        // 2️⃣ Upload file to created video
        using var content = new MultipartFormDataContent();
        using var fileStream = file.OpenReadStream();
        content.Add(new StreamContent(fileStream), "file", file.FileName);

        var uploadResponse = await httpClient.PostAsync($"https://ws.api.video/videos/{videoId}/source", content);
        uploadResponse.EnsureSuccessStatusCode();

        // 3️⃣ Create a token for secure playback (valid for X seconds)
        var tokenRequest = new
        {
            type = "playback",
            expiresIn = 3600 // token valid for 1 hour
        };

        var tokenContent = new StringContent(JsonConvert.SerializeObject(tokenRequest), Encoding.UTF8, "application/json");
        var tokenResponse = await httpClient.PostAsync($"https://ws.api.video/videos/{videoId}/token", tokenContent);
        tokenResponse.EnsureSuccessStatusCode();

        var tokenJson = await tokenResponse.Content.ReadAsStringAsync();
        var tokenDoc = JsonDocument.Parse(tokenJson);
        var token = tokenDoc.RootElement.GetProperty("token").GetString();

        // 4️⃣ Return secure HLS URL with token
        var secureHlsUrl = $"https://embed.api.video/vod/{videoId}/manifest.m3u8?token={token}";

        return secureHlsUrl;
    }
    public async Task<Response<List<CreateVedioDependencies>>> createVedioDependencies(EnVedioFor vedioFor)
    {
        var list = new List<CreateVedioDependencies>();


        switch (vedioFor)
        {
            case EnVedioFor.Course:
                list = await _context.Courses.Where(c => (bool)!c.IsDeleted).Select(c => new CreateVedioDependencies
                {
                    Name = c.TitleEn,
                    Id = c.Id,
                }).ToListAsync();
                break;
            case EnVedioFor.Lession:
                list = await _context.Lessons.Where(l => (bool)!l.IsDeleted).Select(l => new CreateVedioDependencies
                {
                    Name = l.TitleEn,
                    Id = l.Id,
                }).ToListAsync();
                break;
            case EnVedioFor.StudentProfile:
                list = await _context.Students.Where(s => (bool)!s.IsDeleted).Select(s => new CreateVedioDependencies
                {
                    Name = s.NameEn,
                    Id = s.Id,
                }).ToListAsync();
                break;
            case EnVedioFor.TeacherProfile:
                list = await _context.Teachers.Where(t => (bool)!t.IsDeleted).Select(t => new CreateVedioDependencies
                {
                    Name = t.NameEn,
                    Id = t.Id,
                }).ToListAsync();
                break;
        }


        return Success(list);
    }
    #endregion
}



// steps

//  1- check file is not empty
//  2- create folder for hold chuncks + vedio.mp4 + vedio.m3u8
//  if use third party for converting  => i need save video.mp4 + vedio.m3u8 and no saving chunks needed
//  or can save them all in somthing like aws3
//  only what i need is 
// 1- path for .mp4 vedio
// 2- path for .m3u8 vedio
// permision of this vedio   [1,0] 1- downloadedEnable 0- disableDounload
// enumForType => [course=1,lession=2,teacherProfile=3,studentProfile=4,banner=5,adverisement=6]
// if      enumForType  in (1,2,3,4)  need id
// and related (id) if exist [ course , lession , techer profile , student profile , ] or  banner , advertisement
// uploaded by (id)  type => [student admin teacher]
// uploadedAt