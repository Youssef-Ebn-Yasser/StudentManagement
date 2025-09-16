namespace Backend.Entities;

public class VedioesDetails
{
    public int Id { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.Now;
    public string EnableDownloadedUrl { get; set; } = string.Empty;
    public string DisableDownloadedFolder { get; set; } = string.Empty;
    public string DisableDownloadedFile { get; set; } = string.Empty;
    public string ThirdPartyLink { get; set; } = string.Empty;
    public EnSavedInType SavedIn { get; set; }
    public EnVedioPermision VedioPermision { get; set; } = EnVedioPermision.enable;
    public int? RelatedById { get; set; }
    public int UploadedById { get; set; }
    public EnVedioUploadedBy VedioUploadedBy { get; set; }
    public EnVedioFor? VedioFor { get; set; } = null;
}