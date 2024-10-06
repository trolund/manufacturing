import { useEffect, useState } from "react";
import useSignalR from "../api/useSignalR";
import { useGetEquipmentOverviews } from "../api/EquipmentHooks";
import { EquipmentOverview } from "../models/EquipmentOverview";
import { EquipmentState } from "../models/EquipmentState";
import { BASE_URL_SIGNALR } from "../contants/constants";

export default function OverviewPage() {
  const { data: initOverview, isLoading } = useGetEquipmentOverviews();

  const [overviewItems, setOverviewItems] = useState<
    EquipmentOverview[] | undefined
  >(undefined);

  useEffect(() => {
    setOverviewItems(initOverview);
  }, [initOverview]);

  // Set up event listeners
  const eventHandlers = {
    EquipmentsStatusChanged: (data: EquipmentOverview[]) => {
      setOverviewItems(data);
    },
  };

  const [_, isconnected] = useSignalR(BASE_URL_SIGNALR, eventHandlers);

  const getColor = (status: EquipmentState | null) => {
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

  return (
    <>
      {isconnected ? (
        <p className="text-green-500 p-5">Connected</p>
      ) : (
        <p className="text-red-500 p-5">Not connected</p>
      )}
      {isLoading && <p>Loading...</p>}
      <div className="grid md:grid-cols-4 gap-4 sm:grid-cols-2 grid-cols-1">
        {overviewItems?.map((item) => (
          <a key={item.id} href={`/equipment/${item.id}`}>
            <div
              key={item.id}
              className={
                getColor(item.state) +
                " p-4 text-white rounded-lg hover:scale-105 transition-all"
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
