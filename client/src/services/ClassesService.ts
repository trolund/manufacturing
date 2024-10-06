import { EquipmentState } from "../models/EquipmentState";

export const getColorClasses = (status: EquipmentState | null) => {
  switch (status) {
    case EquipmentState.Green:
      return "bg-green-500";
    case EquipmentState.Yellow:
      return "bg-yellow-500";
    case EquipmentState.Red:
      return "bg-red-500";
    default:
      return "bg-gray-500";
  }
};
