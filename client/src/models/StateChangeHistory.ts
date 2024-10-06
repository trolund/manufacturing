import { EquipmentOverview } from "./EquipmentOverview";
import { EquipmentState } from "./EquipmentState";

export interface StateChangeHistory {
  id: number;
  equipmentId: number;
  state: EquipmentState;
  changedAt: string;
  changedBy: string;
  equipment: EquipmentOverview;
}
