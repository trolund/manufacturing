using System.Threading.Tasks;
using Manufacturing.Api.Hubs;
using Manufacturing.Infrastructure.ViewModels;
using Manufacturing.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;

namespace Manufacturing.Api.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
public class EquipmentController(
    IEquipmentService equipmentService,
    IStateChangeHistoryService stateChangeHistoryService,
    IHubContext<StateChangeHub> stateChangeHub)
    : ControllerBase
{
    /// <summary>
    ///     Get all equipment.
    /// </summary>
    /// <returns>All equipment</returns>
    [HttpGet]
    public async Task<IActionResult> Get()
    {
        return Ok(await equipmentService.GetAllEquipments());
    }

    /// <summary>
    ///     Get a specific equipment.
    /// </summary>
    /// <param name="equipmentId">The equipment ID</param>
    /// <returns>The equipment</returns>
    [HttpGet("{equipmentId}")]
    public async Task<IActionResult> GetById(int equipmentId)
    {
        return Ok(await equipmentService.GetEquipmentsById(equipmentId));
    }

    /// <summary>
    ///     update a specific equipment.
    /// </summary>
    /// <param name="equipment">The equipment</param>
    /// <returns>The updated equipment</returns>
    [HttpPut("{equipmentId}")]
    public async Task<IActionResult> Update([FromBody] EquipmentDTO equipment)
    {
        return Ok(await equipmentService.UpdateEquipments(equipment));
    }

    /// <summary>
    ///     update a specific equipment status.
    /// </summary>
    /// <param name="equipmentId">The equipment ID</param>
    /// <param name="state">The new state</param>
    /// <returns>True if the status was updated, false otherwise</returns>
    [HttpPost("{equipmentId}/status")]
    public async Task<IActionResult> UpdateStatus([FromRoute] int equipmentId, [FromQuery] EquipmentStateDTO state)
    {
        var result = await equipmentService.UpdateEquipmentStatus(equipmentId, state);

        if (result)
        {
            // Notify clients
            await stateChangeHub.Clients.Group("OverviewGroup").SendAsync("OverviewChanged",
                await equipmentService.GetEquipmentOverviews());
            
            await stateChangeHub.Clients.Group(equipmentId.ToString()).SendAsync("EquipmentStatusChanged",
                await equipmentService.GetEquipmentOverview(equipmentId));
            
            await stateChangeHub.Clients.Group("HistoryGroup").SendAsync("HistoryChanged",
                await stateChangeHistoryService.GetMostResentStateChangeHistory(10));
        }

        return result ? Ok() : NotFound();
    }

    /// <summary>
    ///     Get an overview of all equipment and their current status.
    /// </summary>
    /// <returns>All equipment overviews</returns>
    /// '
    [HttpGet("overview")]
    public async Task<IActionResult> GetOverview()
    {
        return Ok(await equipmentService.GetEquipmentOverviews());
    }

    /// <summary>
    ///     Get an overview of a specific equipment and its current status.
    /// </summary>
    /// <returns>The equipment overview</returns>
    /// '
    [HttpGet("{equipmentId}/overview")]
    public async Task<IActionResult> GetOverviewByEquipmentId([FromRoute] int equipmentId)
    {
        return Ok(await equipmentService.GetEquipmentOverview(equipmentId));
    }
}