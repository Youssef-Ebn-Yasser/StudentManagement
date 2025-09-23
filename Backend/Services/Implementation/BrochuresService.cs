namespace Backend.Services.Implementation;

public class BrochuresService : ResponseHandler, IBrochuresService
{
    #region     Fields
    private readonly ApplicationDbContext _context;
    private readonly IPhysicalFileUpload _physicalFileUpload;
    #endregion

    #region    Constructor
    public BrochuresService(ApplicationDbContext context, IPhysicalFileUpload physicalFileUpload)
    {
        _context = context;
        _physicalFileUpload = physicalFileUpload;
    }
    #endregion

    #region     Handle Methods
    public async Task<Response<List<GetAllCourseBrochuresDto>>> GetAllCourseBrouchers()
    {
        var brouchers = await _context.CourseBrochures
                                                        .AsNoTracking()
                                                        .Where(e => !e.IsDeleted)
                                                        .Select(c => new GetAllCourseBrochuresDto
                                                        {
                                                            CourseName = c.Course.TitleEn,
                                                            CreatedAt = DateTime.Now,
                                                            Id = c.Id,
                                                            Link = c.Link,
                                                            CourseId = c.Course.Id,
                                                        }).ToListAsync();

        if (brouchers == null)
        {
            return BadRequest<List<GetAllCourseBrochuresDto>>("no brouchures yet");
        }

        return Success(brouchers);
    }

    public async Task<Response<List<GetAllCourseBrochuresDto>>> GetAllCourseBrouchers(int courseId)
    {
        var brouchers = await _context.CourseBrochures
                                                        .AsNoTracking()
                                                        .Where(e => !e.IsDeleted && e.CourseId == courseId)
                                                        .Select(c => new GetAllCourseBrochuresDto
                                                        {
                                                            CourseName = c.Course.TitleEn,
                                                            CreatedAt = DateTime.Now,
                                                            Id = c.Id,
                                                            Link = c.Link,
                                                            CourseId = c.Course.Id,
                                                        }).ToListAsync();

        if (brouchers == null)
        {
            return BadRequest<List<GetAllCourseBrochuresDto>>("no brouchures yet");
        }

        return Success(brouchers);
    }


    public async Task<Response<string>> CreateCourseBrouchers(CreateCourseBrochuresDto dto)
    {
        string fileLink = string.Empty;
        if (dto.File.Length > 0)
        {
            fileLink = await _physicalFileUpload.UploadFileAsync("Brochures", dto.File);
        }
        var newBrouchers = new CourseBrochures
        {
            CourseId = dto.CourseId,
            Link = fileLink,
            Course = null,
        };

        _context.CourseBrochures.Add(newBrouchers); ;


        await _context.SaveChangesAsync();

        return Success("Succefully Uploaded");
    }

    public async Task<Response<string>> UpdateCourseBrouchers(UpdateCourseBrochuresDto dto)
    {
        var brouchers = await _context.CourseBrochures
                                             .Where(e => !e.IsDeleted && e.Id == dto.Id)
                                             .FirstOrDefaultAsync();


        if (brouchers == null)
        {
            return BadRequest<string>($"this bruchures with this id {dto.Id} not exist");
        }

        string fileLink = string.Empty;
        if (dto.File.Length > 0)
        {
            fileLink = await _physicalFileUpload.UploadFileAsync("Brochures", dto.File);
        }


        brouchers.CourseId = dto.CourseId;

        if (fileLink != string.Empty)
        {
            brouchers.Link = fileLink;
        }
        else
        {
            return BadRequest<string>("can not add this material upload faild");
        }

        await _context.SaveChangesAsync();

        return Success("Succefully Uploaded");
    }

    public async Task<Response<string>> DeleteCourseBrouchers(int id)
    {
        var courseBrouchures = await _context.CourseBrochures.FirstOrDefaultAsync(e => e.Id == id && !e.IsDeleted);

        if (courseBrouchures == null)
        {
            return BadRequest<string>("this CourseBrouchers not exist");
        }

        courseBrouchures.IsDeleted = true;
        await _context.SaveChangesAsync();

        return Success("Delted Successfully");
    }
    #endregion
}

public class CreateCourseBrochuresDto
{
    public IFormFile File { get; set; }
    public int? CourseId { get; set; }
}

public class GetAllCourseBrochuresDto
{
    public int Id { get; set; }
    public DateTime CreatedAt { get; set; }
    public string Link { get; set; }
    public string CourseName { get; set; }
    public int CourseId { get; set; }

}


public class UpdateCourseBrochuresDto : CreateCourseBrochuresDto
{
    public int Id { get; set; }
}