namespace Backend.Mapping;

public class AssignmentProfile : Profile
{
    public AssignmentProfile()
    {
        CreateMap<CreateAssignDto, Assignment>();
        CreateMap<Assignment, ShowAssignmentDto>();

    }
}