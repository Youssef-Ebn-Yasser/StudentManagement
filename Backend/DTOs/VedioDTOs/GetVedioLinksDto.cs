namespace Backend.DTOs.VedioDTOs;

public class GetVedioLinksDto
{
    public List<string> links { get; set; } = new List<string>();
    public EnVedioPermision VedioPermision { get; set; }
    public EnSavedInType SavedInType { get; set; }

}