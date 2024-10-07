using System.Threading.Tasks;
using Manufacturing.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

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
    [HttpGet("recent")]
    public async Task<IActionResult> Get([FromQuery] int numberOfHistories = 10)
    {
        return Ok(await stateChangeHistoryService.GetMostResentStateChangeHistory(numberOfHistories));
    }
}