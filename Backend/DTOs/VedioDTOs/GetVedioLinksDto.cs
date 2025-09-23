namespace Backend.DTOs.VedioDTOs;

public class GetVedioLinksDto
{
    public List<LinkProp> links { get; set; } = new List<LinkProp>();

    public EnVedioPermision VedioPermision { get; set; }
    public EnSavedInType SavedInType { get; set; }

}

public class LinkProp
{
    public string LinkUrl { get; set; }
    public int LinkId { get; set; }
}