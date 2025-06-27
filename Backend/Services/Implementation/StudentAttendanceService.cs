namespace Backend.Services.Implementation;
using Backend.DTOs.StudentDOs;
public class StudentAttendanceService : ResponseHandler, IStudentAttendanceService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IStructuredLogger _logger;
    private readonly IMapper _mapper;

    public StudentAttendanceService(IUnitOfWork unitOfWork, IStructuredLogger logger, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _logger = logger;
        _mapper = mapper;
    }

    public async Task<Response<string>> MarkAttendanceAsync(int meetingId, List<StudentAttendanceDto> attendances)
    {
        try
        {
            _logger.LogInfo($"Attempting to mark attendance for MeetingId: {meetingId}");

            foreach (var attendanceDto in attendances)
            {
                var existingAttendance = await _unitOfWork.Repository<StudentAttendance>()
                    .GetTableAsTracking()
                    .FirstOrDefaultAsync(a => a.StudentId == attendanceDto.StudentId && a.MeetingId == meetingId);

                if (existingAttendance != null)
                {
                    // Update existing record
                    existingAttendance.Status = attendanceDto.Status;
                    existingAttendance.Note = attendanceDto.Note;
                    _unitOfWork.Repository<StudentAttendance>().Update(existingAttendance);
                    _logger.LogInfo($"Updated attendance for StudentId: {attendanceDto.StudentId} in MeetingId: {meetingId}");
                }
                else
                {
                    // Create new record
                    var newAttendance = new StudentAttendance
                    {
                        StudentId = attendanceDto.StudentId,
                        MeetingId = meetingId,
                        Status = attendanceDto.Status,
                        Note = attendanceDto.Note,
                        Date = DateTime.Now,
                      
                    };
                    await _unitOfWork.Repository<StudentAttendance>().AddAsync(newAttendance);
                    _logger.LogInfo($"Created new attendance for StudentId: {attendanceDto.StudentId} in MeetingId: {meetingId}");
                }
            }

            var result =  _unitOfWork.Complete();
            if (result > 0)
            {
                _logger.LogInfo($"Successfully marked attendance for MeetingId: {meetingId}");
                return Success("Attendance marked successfully.");
            }

            _logger.LogInfo($"Failed to save attendance for MeetingId: {meetingId}");
            return BadRequest<string>("Failed to mark attendance.");
        }
        catch (Exception ex)
        {
            _logger.LogInfo($"An error occurred while marking attendance for MeetingId: {meetingId}. Exception: {ex.Message}");
            return BadRequest<string>($"An error occurred: {ex.Message}");
        }
    }

    public async Task<Response<List<StudentAttendanceDto>>> GetAttendanceByMeetingAsync(int meetingId)
    {
        try
        {
            _logger.LogInfo($"Fetching attendance for MeetingId: {meetingId}");
            var attendanceRecords = await _unitOfWork.Repository<StudentAttendance>()
                .GetTableNoTracking()
                .Where(a => a.MeetingId == meetingId)
                .ToListAsync();

            if (!attendanceRecords.Any())
            {
                _logger.LogInfo($"No attendance records found for MeetingId: {meetingId}");
                return Success(new List<StudentAttendanceDto>(), "No attendance records found.");
            }

            var attendanceDtos = _mapper.Map<List<StudentAttendanceDto>>(attendanceRecords);
            _logger.LogInfo($"Successfully fetched {attendanceDtos.Count} attendance records for MeetingId: {meetingId}");
            return Success(attendanceDtos);
        }
        catch (Exception ex)
        {
            _logger.LogInfo($"An error occurred while fetching attendance for MeetingId: {meetingId}. Exception: {ex.Message}");
            return BadRequest<List<StudentAttendanceDto>>($"An error occurred: {ex.Message}");
        }
    }

    public async Task<Response<List<StudentAttendanceDto>>> GetAttendanceByStudentAsync(int studentId)
    {
        try
        {
            _logger.LogInfo($"Fetching attendance for StudentId: {studentId}");
            var attendanceRecords = await _unitOfWork.Repository<StudentAttendance>()
                .GetTableNoTracking()
                .Where(a => a.StudentId == studentId)
                .ToListAsync();

            if (!attendanceRecords.Any())
            {
                _logger.LogInfo($"No attendance records found for StudentId: {studentId}");
                return Success(new List<StudentAttendanceDto>(), "No attendance records found.");
            }

            var attendanceDtos = _mapper.Map<List<StudentAttendanceDto>>(attendanceRecords);
            _logger.LogInfo($"Successfully fetched {attendanceDtos.Count} attendance records for StudentId: {studentId}");
            return Success(attendanceDtos);
        }
        catch (Exception ex)
        {
            _logger.LogInfo($"An error occurred while fetching attendance for StudentId: {studentId}. Exception: {ex.Message}");
            return BadRequest<List<StudentAttendanceDto>>($"An error occurred: {ex.Message}");
        }
    }

   
}
