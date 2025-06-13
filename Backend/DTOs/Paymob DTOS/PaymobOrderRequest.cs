using System.Text.Json.Serialization;

namespace Backend.DTOs.Paymob_DTOS
{
    public class PaymobOrderRequest
    {
        [JsonPropertyName("auth_token")]
        public string AuthToken { get; set; }

        [JsonPropertyName("delivery_needed")]
        public bool DeliveryNeeded { get; set; } = false;

        [JsonPropertyName("amount_cents")]
        public string AmountCents { get; set; }

        [JsonPropertyName("currency")]
        public string Currency { get; set; } = "EGP";

        [JsonPropertyName("items")]
        public List<object> Items { get; set; } = new();
    }

    public class PaymobOrderResponse
    {
        [JsonPropertyName("id")]
        public int Id { get; set; }
    }
}
