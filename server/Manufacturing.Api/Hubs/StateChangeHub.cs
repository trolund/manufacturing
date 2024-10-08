using System.Threading.Tasks;
using Manufacturing.Services.Interfaces;
using Microsoft.AspNetCore.SignalR;

namespace Manufacturing.Api.Hubs;

public class StateChangeHub(IEquipmentService equipmentService) : Hub
{
    public async Task SubscribeToEquipmentChanges(int equipmentId)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, equipmentId.ToString());
    }
    
    public async Task SubscribeToHistory()
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, "History");
    }
    
    public async Task GetEquipmentStateChange(int equipmentId)
    {
        await Clients.Client(Context.ConnectionId).SendAsync("EquipmentStatusChanged", await equipmentService.GetEquipmentOverview(equipmentId));
    }
}