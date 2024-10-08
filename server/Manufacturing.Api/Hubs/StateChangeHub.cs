using System.Threading.Tasks;
using Manufacturing.Services.Interfaces;
using Microsoft.AspNetCore.SignalR;

namespace Manufacturing.Api.Hubs;

public class StateChangeHub(IEquipmentService equipmentService, IStateChangeHistoryService stateChangeHistoryService)
    : Hub
{
    public async Task SubscribeToEquipmentChanges(int equipmentId)
    {
        // subscribe to changes
        await Groups.AddToGroupAsync(Context.ConnectionId, equipmentId.ToString());
        // get initial state 
        await Clients.Client(Context.ConnectionId)
            .SendAsync("EquipmentStatusChanged", await equipmentService.GetEquipmentOverview(equipmentId));
    }

    public async Task SubscribeToHistory()
    {
        // subscribe to changes
        await Groups.AddToGroupAsync(Context.ConnectionId, "HistoryGroup");
        // get initial state
        await Clients.Group("HistoryGroup").SendAsync("HistoryChanged",
            await stateChangeHistoryService.GetMostResentStateChangeHistory(10));
    }

    public async Task SubscribeToOverviewChanges()
    {
        // subscribe to changes
        await Groups.AddToGroupAsync(Context.ConnectionId, "OverviewGroup");
        // get initial state
        await Clients.Group("OverviewGroup").SendAsync("OverviewChanged",
            await equipmentService.GetEquipmentOverviews());
    }
}