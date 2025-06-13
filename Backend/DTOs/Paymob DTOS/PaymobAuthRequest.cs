using System.Text.Json.Serialization;

namespace Backend.DTOs.Paymob_DTOS
{
    public class PaymobAuthRequest
    {
        [JsonPropertyName("api_key")]
        public string ApiKey { get; set; }
    }
}
