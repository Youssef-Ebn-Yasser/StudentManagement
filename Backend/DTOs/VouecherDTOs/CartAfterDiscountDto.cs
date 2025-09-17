namespace Backend.DTOs.VouecherDTOs;

public class CartAfterDiscountDto
{
    public int courseAppliedId { get; set; }
    public string code { get; set; } = string.Empty;
    public EnDiscountType? DiscountType { get; set; }
    public double? DiscountValue { get; set; }
}