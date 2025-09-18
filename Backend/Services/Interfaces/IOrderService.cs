namespace Backend.Services.Interfaces;

public interface IOrderService
{
    public Task<Response<string>> BuyOrder(BuyDto dto);
}