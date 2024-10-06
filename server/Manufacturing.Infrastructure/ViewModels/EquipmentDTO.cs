namespace Manufacturing.Infrastructure.ViewModels;

public class EquipmentDTO
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Location { get; set; }

    // Navigation property for related orders
    // public ICollection<Order> Orders { get; set; }
    //
    // // Navigation property for state change history
    // public ICollection<StateChangeHistory> StateChangeHistories { get; set; }
}