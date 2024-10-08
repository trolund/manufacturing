import { useEffect, useState } from "react";
import useSignalR from "../api/useSignalR";
import { EquipmentOverview } from "../models/EquipmentOverview";
import { BASE_URL_SIGNALR } from "../contants/constants";
import { getColorClasses } from "../services/ClassesService";
import ConnectionBar from "../components/ConnectionBar";

export default function OverviewPage() {
  const [overviewItems, setOverviewItems] = useState<
    EquipmentOverview[] | undefined
  >();

  // Set up event listeners
  const eventHandlers = {
    OverviewChanged: (data: EquipmentOverview[]) => {
      setOverviewItems(data);
    },
  };

  const [connection, isconnected] = useSignalR(BASE_URL_SIGNALR, eventHandlers);

  useEffect(() => {
    if (connection === null || !isconnected) {
      return;
    }

    connection
      .invoke("SubscribeToOverviewChanges")
      .then(() => console.debug(`Subscribed to overview changes`))
      .catch((err) => console.error(err));
  }, [connection, isconnected]);

  return (
    <>
      <ConnectionBar isconnected />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
        {overviewItems?.map((item) => (
          <a key={item.id} href={`/equipment/${item.id}`}>
            <div
              key={item.id}
              className={
                getColorClasses(item.state) +
                " rounded-lg p-4 text-white transition-all hover:scale-105"
              }
            >
              <strong>{item.name}</strong>
              <p>{item.location}</p>
              <p>{item.changedBy}</p>
            </div>
          </a>
        ))}
      </div>
    </>
  );
}
