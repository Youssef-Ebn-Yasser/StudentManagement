namespace Backend.Services.Implementation;

public class PaymentReportingService : ResponseHandler, IPaymentReportingService
{
    #region     Fields
    private readonly IUnitOfWork _unitOfWork;
    private readonly ApplicationDbContext _context;
    #endregion

    #region     Constructor
    public PaymentReportingService(IUnitOfWork unitOfWork, ApplicationDbContext context)
    {
        _unitOfWork = unitOfWork;
        _context = context;
    }
    #endregion


    #region    Handle Methods
    public async Task<Response<StudentsPaymentPerCourseDto>> GetStudentsPaymentPerCourse(int courseId)
    {
        var studentsInCourse = await _context.Set<AllStudentsDto>()
            .FromSqlInterpolated($@"SELECT s.Id AS UserId,
                                 s.NameEn AS UserName  ,s.UserType As UserRole
                                 FROM StudentCourses sc
                                 INNER JOIN AspNetUsers s ON sc.StudentId = s.Id
                                 WHERE sc.CourseId = {courseId}")
            .ToListAsync();



        var coursesPaiedDetails = await _unitOfWork.Repository<OrderItem>()
                                             .GetTableNoTracking()
                                             .Where(oi => oi.CourseId == courseId)
                                             .Include(oi => oi.Order)
                                             .Select(oi => new CoursePaiedDetails
                                             {
                                                 CoursePrice = oi.CoursePrice,
                                                 CoursePriceAfterDiscount = oi.PriceAfterVoucher,
                                                 DiscountAmount = oi.DiscountAmount,
                                                 PaiedAt = oi.Order.OrderDate,
                                                 UserId = oi.Order.UserId,
                                                 UserName = oi.Order.UserName,

                                             }).ToListAsync();



        var result = new StudentsPaymentPerCourseDto
        {
            CoursePaiedDetails = coursesPaiedDetails,
            NumberOfStudentInthisCourse = studentsInCourse.Count,
            NumberOfStudentPaiedForThis = coursesPaiedDetails.Count,
            AllStudents = studentsInCourse,
        };

        return Success(result);
    }

    public async Task<Response<List<OrderDto>>> GetPaymentsPerStudents(int userId)
    {
        var orders = await _context.Orders
                                                .Select(o => new OrderDto
                                                {
                                                    FinalPrice = o.FinalPrice,
                                                    TotalPrice = o.TotalPrice,
                                                    OrderStatus = o.OrderStatus,
                                                    OrderDate = o.OrderDate,
                                                    DiscountAmount = o.DiscountAmount,
                                                    NumberOfTotalItems = o.NumberOfTotalItems,
                                                    CodeDiscount = o.CodeDiscount,
                                                    IsCompleted = o.IsCompleted,
                                                    ServiceOrderID = o.ServiceOrderID,
                                                    Items = o.OrderItems.Select(oi => new OrderItemDto
                                                    {
                                                        CourseName = oi.CourseName,
                                                        CourseId = oi.CourseId,
                                                        CoursePrice = oi.CoursePrice,
                                                        PriceAfterVoucher = oi.PriceAfterVoucher,
                                                        DiscountAmount = oi.DiscountAmount,
                                                        IsApplayedVoucher = oi.IsApplayedVoucher
                                                    }).ToList()
                                                })
                                                .ToListAsync();


        if (orders == null)
        {
            return BadRequest<List<OrderDto>>("no courses for this student");
        }

        return Success(orders);
    }
    #endregion
}



public class OrderItemDto
{
    public string CourseName { get; set; } = string.Empty;
    public int CourseId { get; set; }
    public double CoursePrice { get; set; }
    public double? PriceAfterVoucher { get; set; }
    public double? DiscountAmount { get; set; }
    public bool IsApplayedVoucher { get; set; }
}
public class OrderDto
{
    public decimal FinalPrice { get; set; }
    public decimal TotalPrice { get; set; }
    public EnOrderStatus OrderStatus { get; set; }
    public DateTime OrderDate { get; set; }
    public decimal? DiscountAmount { get; set; }
    public int NumberOfTotalItems { get; set; }
    public string? CodeDiscount { get; set; }
    public bool IsCompleted { get; set; }
    public int ServiceOrderID { get; set; }

    public List<OrderItemDto> Items { get; set; } = new();
}





















public class StudentsPaymentPerCourseDto
{
    public int NumberOfStudentInthisCourse { get; set; }
    public int NumberOfStudentPaiedForThis { get; set; }

    public List<CoursePaiedDetails> CoursePaiedDetails { get; set; }

    public List<AllStudentsDto> AllStudents { get; set; }
}

public class AllStudentsDto
{
    public int? UserId { get; set; }
    public string? UserName { get; set; }
    public string? UserRole { get; set; }
}

public class CoursePaiedDetails
{
    public int UserId { get; set; }
    public string UserName { get; set; }
    public DateTime PaiedAt { get; set; }
    public double CoursePrice { get; set; }
    public double CoursePriceAfterDiscount { get; set; }
    public double? DiscountAmount { get; set; }
}