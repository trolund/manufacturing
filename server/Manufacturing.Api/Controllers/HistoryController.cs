using System.Threading.Tasks;
using Manufacturing.Api.Hubs;
using Manufacturing.Infrastructure.ViewModels;
using Manufacturing.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;

namespace Manufacturing.Api.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
public class HistoryController(IStateChangeHistoryService stateChangeHistoryService)
    : ControllerBase
{
    /// <summary>
    ///     Get most recent state change history.
    /// </summary>
    /// <returns>Most recent state change history</returns>
    [HttpGet]
    public async Task<IActionResult> Get()
    {
        return Ok(await stateChangeHistoryService.GetMostResentStateChangeHistory());
    }
}