import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useUpdateEquipmentStatus } from "../api/EquipmentHooks";
import useSignalR from "../api/useSignalR";
import { EquipmentOverview } from "../models/EquipmentOverview";
import { EquipmentState } from "../models/EquipmentState";
import { useQueryClient } from "@tanstack/react-query";
import { BASE_URL_SIGNALR } from "../contants/constants";
import { getColorClasses } from "../services/ClassesService";
import {
  formatDate,
  getEquipmentStateName,
} from "../services/FormatingService";
import ConnectionBar from "../components/ConnectionBar";

export default function EquipmentPage() {
  const { equipmentId } = useParams();
  const [overview, setOverview] = useState<EquipmentOverview | undefined>();

  const queryClient = useQueryClient();
  const { mutate } = useUpdateEquipmentStatus(Number(equipmentId), queryClient);

  const eventHandlers = {
    EquipmentStatusChanged: (data: EquipmentOverview) => {
      setOverview(data);
    },
  };

  const [connection, isconnected] = useSignalR(BASE_URL_SIGNALR, eventHandlers);

  useEffect(() => {
    if (connection === null || !isconnected) {
      return;
    }

    connection
      .invoke("SubscribeToEquipmentChanges", Number(equipmentId))
      .then(() =>
        console.debug(`Subscribe to equipment with id: ${equipmentId}`),
      )
      .catch((err) => console.error(err));
  }, [connection, isconnected, equipmentId]);

  const isCurrentState = (state: EquipmentState) => {
    return state === overview?.state;
  };

  const keys = Object.keys(EquipmentState).filter((x) => isNaN(Number(x)));

  return (
    <section>
      <ConnectionBar isconnected />
      <h1 className="p-4 text-2xl font-bold">Equipment</h1>
      <div className="flex-col items-center justify-between rounded-lg border-[1px] border-slate-900 bg-slate-800 p-4 text-white">
        <div className="grid gap-4 text-center">
          <h2 className="text-lg font-bold">{overview?.name}</h2>
          <p>{overview?.location}</p>
          <p>{overview?.changedBy}</p>
          <p>{formatDate(overview?.changedAt)}</p>
          <p
            className={
              "flex justify-center gap-4 rounded-lg p-2 " +
              getColorClasses(overview?.state)
            }
          >
            <p>State:</p>
            <strong>{getEquipmentStateName(overview?.state)}</strong>
          </p>
        </div>
      </div>
      <div className="flex justify-center gap-4 p-4">
        {keys.map((key) => (
          <button
            key={key}
            className={
              "rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700 " +
              (isCurrentState(
                EquipmentState[key as keyof typeof EquipmentState],
              )
                ? "bg-blue-700"
                : "")
            }
            onClick={() =>
              mutate(EquipmentState[key as keyof typeof EquipmentState])
            }
          >
            {key}
          </button>
        ))}
      </div>
      <div></div>
    </section>
  );
}
