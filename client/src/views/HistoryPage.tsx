import { useEffect, useState } from "react";
import useSignalR from "../api/useSignalR";
import { BASE_URL_SIGNALR } from "../contants/constants";
import { StateChangeHistory } from "../models/StateChangeHistory";
import {
  formatDate,
  getEquipmentStateName,
} from "../services/FormatingService";
import { getColorClasses } from "../services/ClassesService";
import ConnectionBar from "../components/ConnectionBar";

export default function HistoryPage() {
  const [overviewItems, setOverviewItems] = useState<
    StateChangeHistory[] | undefined
  >();

  // Set up event listeners
  const eventHandlers = {
    HistoryChanged: (data: StateChangeHistory[]) => {
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
      .then(() => console.debug(`Subscribed to state change history`))
      .catch((err) => console.error(err));
  }, [connection, isconnected]);

  return (
    <>
      <ConnectionBar isconnected />
      <div className="grid grid-cols-1 gap-4">
        {overviewItems?.map((item) => (
          <div
            key={item.id}
            className="items-center justify-between gap-4 rounded-lg border-[1px] border-slate-900 bg-gray-800 p-4 text-white md:flex"
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
                "flex gap-4 rounded-lg p-2 " + getColorClasses(item.state)
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
