import { useEffect, useState } from "react";
import { useParams } from "react-router";
import {
  useGetEquipmentOverview,
  useUpdateEquipmentStatus,
} from "../api/EquipmentHooks";
import useSignalR from "../api/useSignalR";
import { EquipmentOverview } from "../models/EquipmentOverview";
import { EquipmentState } from "../models/EquipmentState";
import { useQueryClient } from "@tanstack/react-query";
import { BASE_URL_SIGNALR } from "../contants/constants";

export default function EquipmentPage() {
  const { equipmentId } = useParams();
  const [overview, setOverview] = useState<EquipmentOverview | undefined>(
    undefined
  );
  const {
    data: equipmentInit,
    isLoading,
    refetch,
  } = useGetEquipmentOverview(Number(equipmentId));
  const queryClient = useQueryClient();
  const { mutate } = useUpdateEquipmentStatus(Number(equipmentId), queryClient);

  useEffect(() => {
    setOverview(equipmentInit);
  }, [equipmentInit]);

  const evnetHandlers = {
    EquipmentStatusChanged: (data: EquipmentOverview) => {
      setOverview(data);
    },
  };

  const [connection, isconnected] = useSignalR(BASE_URL_SIGNALR, evnetHandlers);

  useEffect(() => {
    if (connection === null || !isconnected) {
      return;
    }

    connection
      .invoke("SubscribeToEquipmentChanges", Number(equipmentId))
      .then(() =>
        console.debug(`Subscribe to equipment with id: ${equipmentId}`)
      )
      .catch((err) => console.error(err));
  }, [connection, isconnected]);

  const getEquipmentStatusColor = (
    status: EquipmentState | undefined | null
  ) => {
    switch (status) {
      case EquipmentState.Green:
        return "bg-green-500";
      case EquipmentState.Red:
        return "bg-red-500";
      case EquipmentState.Yellow:
        return "bg-yellow-500";
      default:
        return "bg-gary-500";
    }
  };

  const isCurrentState = (state: EquipmentState) => {
    return state === overview?.state;
  };

  const keys = Object.keys(EquipmentState).filter((x) => isNaN(Number(x)));

  return (
    <>
      {isLoading && <p>Loading...</p>}
      <section>
        <h1 className="text-2xl font-bold p-4">Equipment</h1>
        <div
          className={
            getEquipmentStatusColor(overview?.state) +
            " flex-col justify-between items-center rounded-lg p-4 text-white"
          }
        >
          <div className="text-center">
            <h2 className="text-lg font-bold">{overview?.name}</h2>
            <p>{overview?.location}</p>
            <p>{overview?.changedBy}</p>
            <p>{overview?.changedAt}</p>
          </div>
        </div>
        <div className="flex gap-4 justify-center p-4">
          {keys.map((key) => (
            <button
              key={key}
              className={
                "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded " +
                (isCurrentState(
                  EquipmentState[key as keyof typeof EquipmentState]
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
        <div>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => refetch()}
          >
            Refresh
          </button>
        </div>
      </section>
    </>
  );
}
