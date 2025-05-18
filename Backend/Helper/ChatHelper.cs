using Backend.DTOs.MessageDTOs;

namespace Backend.Helper;

public class ChatHelper : ResponseHandler, IChatHelper
{
    #region    Fields
    private readonly IMapper _mapper;
    private readonly IUnitOfWork _unitOfWork;
    #endregion

    #region    Constructor
    public ChatHelper(IMapper mapper, IUnitOfWork unitOfWork)
    {
        _mapper = mapper;
        _unitOfWork = unitOfWork;
    }
    #endregion

    #region   Handle Methods
    public async Task<int> SaveMessage(MessageDto message)
    {
        var mapper = _mapper.Map<Message>(message);

        await _unitOfWork.Repository<Message>().AddAsync(mapper);
        var result = _unitOfWork.Complete();

        return result;
    }
    public async Task<MessageDto> GetAllMessageInGroup(string groupName)
    {
        var messages = await _unitOfWork.Repository<Message>()
                                                    .GetTableNoTracking()
                                                    .Where(m => m.IsDeleted == false)
                                                    .OrderBy(m => m.CreatedAt)
                                                    .ToListAsync();

        var mapper = _mapper.Map<MessageDto>(messages);

        return mapper;
    }


    public async Task<Response<string>> CreateGroup(string groupName, int courseId)
    {
        var isExist = await _unitOfWork.Repository<ChatGroup>()
                                           .GetTableNoTracking()
                                           .AnyAsync(cg => cg.Name == groupName && cg.CourseId == courseId);

        if (isExist) BadRequest<string>($"this group with this name : {groupName} is already exist");

        var chatGroup = new ChatGroup()
        {
            Name = groupName,
            CourseId = courseId
        };

        await _unitOfWork.Repository<ChatGroup>().AddAsync(chatGroup);
        var result = _unitOfWork.Complete();

        return result > 0 ? Success("Group Create Successfully") :
                            BadRequest<string>("can not create this group error in adding");
    }

    public Task<MessageDto> JoinToGroup(int courseId)
    {
        throw new NotImplementedException();
    }
    #endregion
}