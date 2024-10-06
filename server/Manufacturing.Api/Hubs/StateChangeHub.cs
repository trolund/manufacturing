using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;

namespace Manufacturing.Api.Hubs;

public class StateChangeHub : Hub
{
    public async Task SubscribeToEquipmentChanges(int equipmentId)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, equipmentId.ToString());
    }
}