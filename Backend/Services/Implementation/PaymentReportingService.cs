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