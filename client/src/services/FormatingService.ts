import { EquipmentState } from "../models/EquipmentState";

export const formatDate = (dateString: string) => {
  const date = Date.parse(dateString);
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "2-digit",
  }).format(date);
};

export const getEquipmentStateName = (status: EquipmentState | null) => {
  switch (status) {
    case EquipmentState.Green:
      return "Green";
    case EquipmentState.Yellow:
      return "Yellow";
    case EquipmentState.Red:
      return "Red";
    default:
      return "Unknown";
  }
};
