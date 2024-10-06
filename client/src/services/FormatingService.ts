import { EquipmentState } from "../models/EquipmentState";

export const formatDate = (dateString: string | null | undefined) => {
  if (!dateString) {
    return "";
  }

  const date = Date.parse(dateString);
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(date);
};

export const getEquipmentStateName = (
  status: EquipmentState | null | undefined
) => {
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
