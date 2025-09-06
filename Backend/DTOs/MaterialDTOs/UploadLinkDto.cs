namespace Backend.DTOs.MaterialDTOs;

public class UploadLinkDto
{
    [Required]
    public string UrlLink { get; set; }

    [Required]
    public int LessionId { get; set; }
}