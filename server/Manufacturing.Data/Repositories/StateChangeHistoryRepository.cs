using Manufacturing.Data.Contexts;
using Manufacturing.Data.Models;
using Manufacturing.Data.Repositories.Interface;
using Microsoft.Extensions.Logging;

namespace Manufacturing.Data.Repositories;

public class StateChangeHistoryRepository(ApplicationDbContext context, ILogger<StateChangeHistoryRepository> logger)
    : Repository<StateChangeHistory, Guid>(context), IStateChangeHistoryRepository
{
    public Task<StateChangeHistory?> MostEquipmentState(int equipmentId)
    {
        return Task.FromResult(context.StateChangeHistories
            .Where(x => x.EquipmentId == equipmentId)
            .OrderByDescending(x => x.ChangedAt)
            .FirstOrDefault());
    }
}