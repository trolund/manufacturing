namespace Manufacturing.Infrastructure.ViewModels;

public class PaginatedResponse<T>
{
    public IEnumerable<T>? Items { get; init; }
    public int TotalCount { get; init; }
    public int PageNumber { get; init; }
    public int PageSize { get; init; }
    public int NumberOfPages { get; init; }
}