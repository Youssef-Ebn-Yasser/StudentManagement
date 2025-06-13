using System.Text.Json.Serialization;

namespace Backend.DTOs.Paymob_DTOS
{
    public class PaymobAuthResponse
    {

        [JsonPropertyName("token")]
        public string Token { get; set; }
    }
}
