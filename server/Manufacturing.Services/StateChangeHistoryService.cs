using AutoMapper;
using Manufacturing.Data.Repositories.UnitOfWork;
using Manufacturing.Infrastructure.ViewModels;
using Manufacturing.Services.Interfaces;

namespace Manufacturing.Services;

public class StateChangeHistoryService(IUnitOfWork unitOfWork, IMapper mapper) : IStateChangeHistoryService
{
    public async Task<IEnumerable<StateChangeHistoryDTO>> GetAllStateChangeHistory()
    {
        return mapper.Map<IEnumerable<StateChangeHistoryDTO>>(await unitOfWork.StateChangeHistories.GetAll());      
    }
    
    public async Task<IEnumerable<StateChangeHistoryDTO>> GetMostResentStateChangeHistory()
    {
        return mapper.Map<IEnumerable<StateChangeHistoryDTO>>(await unitOfWork.StateChangeHistories.GetMostResentStateChangeHistories(10));
    }
}