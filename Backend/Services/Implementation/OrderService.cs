namespace Backend.Services.Implementation;

public class OrderService : ResponseHandler, IOrderService
{
    #region    Fields
    private readonly IVoucherService _voucherService;
    private readonly IPaymobService _paymobService;

    private readonly ApplicationDbContext _context;
    #endregion

    #region      Constructor
    public OrderService(IVoucherService voucherService,
                        ApplicationDbContext context,
                        IPaymobService paymobService)
    {
        _voucherService = voucherService;
        _context = context;
        _paymobService = paymobService;
    }
    #endregion

    #region   Handle Methods
    #endregion


    public async Task<Response<string>> BuyOrder(BuyDto dto)
    {
        // validate
        var user = await GetUser(dto.UserId);

        if (user == null)
        {
            return BadRequest<string>("user with this id not exist");
        }

        var voucher = new Voucher();
        if (dto.Code != null)
        {
            (var errorVoucherMessage, voucher) = await _voucherService.ValidateVoucher(dto.Code, dto.CoursesIds);

            if (errorVoucherMessage != null)
            {
                return BadRequest<string>(errorVoucherMessage);
            }
        }

        var courses = await GetCourses(dto.CoursesIds);

        if (courses == null)
        {
            return BadRequest<string>("Error there is a course not exist");
        }

        // map order and order Iteams
        var CourseWithHeighestPrice = courses.MaxBy(c => c.Price);

        var totalPrice = (decimal)courses.Sum(c => c.Price);
        var totalItems = courses.Count();

        decimal? discountAmount = 0;
        if (voucher != null)
        {
            discountAmount = voucher.DiscountType == EnDiscountType.Amount ? voucher.DiscountAmount : (decimal)(voucher.DiscountPercentage! * CourseWithHeighestPrice!.Price / 100);
        }

        var orderIteams = new List<OrderItem>();


        foreach (var course in courses)
        {
            var discount = course.Id == CourseWithHeighestPrice!.Id ? discountAmount : 0;
            var isVoucherExist = (discount == 0) ? false : true;

            var orderItem = new OrderItem
            {
                CourseId = course.Id,
                CourseName = course.TitleEn ?? course.TitleAr!,
                CoursePrice = course.Price,
                DiscountAmount = (double)discount!,
                IsApplayedVoucher = isVoucherExist,
                PriceAfterVoucher = course.Price - (double)discount,
            };

            orderIteams.Add(orderItem);
        }

        var finalOrderPrice = totalPrice - discountAmount;

        var order = new OrderTable
        {
            IsCompleted = false,
            OrderStatus = EnOrderStatus.pending,
            TotalPrice = totalPrice,
            NumberOfTotalItems = totalItems,
            OrderDate = DateTime.Now,
            CodeDiscount = dto.Code,
            DiscountAmount = discountAmount,
            UserName = user.NameEn ?? user.NameAr!,
            VoucherId = voucher!.Id,
            UserId = user.Id,
            FinalPrice = (decimal)finalOrderPrice!,
            OrderItems = orderIteams,
        };


        // call paymob service
        try
        {
            var (url, createdOrderId) = await _paymobService.StartPaymentAsync((int)finalOrderPrice, user.NameEn ??
                                                                               user.NameAr!, user.NameAr ??
                                                                               user.NameEn!, user.Email!, user.PhoneNumber ?? "0109600427");
            order.ServiceOrderID = createdOrderId;
            _context.Orders.Add(order);

            await _context.SaveChangesAsync();

            return Success(url);
        }
        catch
        {
            return BadRequest<string>("Error can not return paymob service");
        }
    }

    private async Task<User?> GetUser(int id)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == id && !u.IsDeleted);

        return user;
    }

    private async Task<List<Course>?> GetCourses(List<int> CoursesIds)
    {
        var courses = await _context.Courses
                                              .Where(c =>
                                              CoursesIds.Contains(c.Id)
                                              && c.IsDeleted == false)
                                              .ToListAsync();

        if (courses.Count != CoursesIds.Count)
        {
            return null;
        }

        return courses;
    }
}