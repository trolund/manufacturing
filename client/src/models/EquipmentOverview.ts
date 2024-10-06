import { Equipment } from "./Equipment";
import { EquipmentState } from "./EquipmentState";

export interface EquipmentOverview extends Equipment {
  state: EquipmentState | null;
  changedAt: string;
  changedBy: string;
}
