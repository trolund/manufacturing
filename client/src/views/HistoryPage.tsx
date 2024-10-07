import { useEffect, useState } from "react";
import useSignalR from "../api/useSignalR";
import { BASE_URL_SIGNALR } from "../contants/constants";
import { useGetHistory } from "../api/HIstoryHooks";
import { StateChangeHistory } from "../models/StateChangeHistory";
import {
  formatDate,
  getEquipmentStateName,
} from "../services/FormatingService";
import { getColorClasses } from "../services/ClassesService";

export default function HistoryPage() {
  const { data: initHistory, isLoading } = useGetHistory();

  const [overviewItems, setOverviewItems] = useState<
    StateChangeHistory[] | undefined
  >(undefined);

  useEffect(() => {
    setOverviewItems(initHistory);
  }, [initHistory]);

  // Set up event listeners
  const eventHandlers = {
    history: (data: StateChangeHistory[]) => {
      setOverviewItems(data);
    },
  };

  const [connection, isconnected] = useSignalR(BASE_URL_SIGNALR, eventHandlers);

  useEffect(() => {
    if (connection === null || !isconnected) {
      return;
    }

    connection
      .invoke("SubscribeToHistory")
      .then(() => console.debug(`Subscribed to history`))
      .catch((err) => console.error(err));
  }, [connection, isconnected]);

  return (
    <>
      {isconnected ? (
        <p className="text-green-500 p-5">Connected</p>
      ) : (
        <p className="text-red-500 p-5">Not connected</p>
      )}
      {isLoading && <p>Loading...</p>}
      <div className="grid gap-4 grid-cols-1">
        {overviewItems?.map((item) => (
          <div
            key={item.id}
            className="p-4 text-white rounded-lg md:flex gap-4 justify-between items-center bg-gray-800 border-slate-900 border-[1px]"
          >
            <div className="flex gap-4">
              <p>Machine ID:</p>
              <strong>{item.equipmentId}</strong>
            </div>

            <div className="flex gap-4">
              <p>Changed by:</p>
              <strong>{item.changedBy}</strong>
            </div>

            <div className="flex gap-4">
              <p>Changed at:</p>
              <strong>{formatDate(item.changedAt)}</strong>
            </div>

            <div
              className={
                "flex gap-4 p-2 rounded-lg " + getColorClasses(item.state)
              }
            >
              <p>State:</p>
              <strong>{getEquipmentStateName(item.state)}</strong>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
