import { useEffect, useState } from "react";
import {
  HubConnectionBuilder,
  HubConnection,
  HttpTransportType,
} from "@microsoft/signalr";

const useSignalR = (
  url: string,
  eventHandlers = {}
): [HubConnection | null, boolean] => {
  const [hubConnection, setHubConnection] = useState<HubConnection | null>(
    null
  );
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Create the HubConnection
    const connection = new HubConnectionBuilder()
      .withAutomaticReconnect()
      .configureLogging("debug")
      .withUrl(url, {
        skipNegotiation: true, // skipNegotiation as we specify WebSockets
        transport: HttpTransportType.WebSockets, // force WebSocket transport
      })
      .build();

    // Start the connection
    const startConnection = async () => {
      try {
        await connection.start();
        console.debug("SignalR connected");
        setIsConnected(true);
        setHubConnection(connection);
      } catch (error) {
        console.error("Error while starting connection:", error);
      }
    };

    const stopConnection = async () => {
      try {
        await connection.stop();
        console.debug("SignalR stopped");
      } catch (error) {
        console.error("Error while starting connection:", error);
      }
    };

    // Set up event handlers
    for (const [eventName, handler] of Object.entries(eventHandlers)) {
      connection.on(eventName, handler as (...args: any[]) => any);
    }

    connection.onreconnecting(() => {
      console.debug("Reconnecting");
      setIsConnected(false);
    });

    connection.onreconnected(() => {
      console.debug("Reconnected");
      setIsConnected(true);
    });

    connection.onclose(() => {
      console.debug("Connection closed");
      setIsConnected(false);
    });

    // Start the connection when the hook is first used
    stopConnection().then(() => {
      startConnection();
    });

    // Clean up the connection when the component unmounts
    return () => {
      connection.stop().then(() => {
        console.debug("SignalR connection stopped");
        setIsConnected(false);
      });
    };
  }, []); // Depend on the URL to recreate the connection if it changes

  return [hubConnection, isConnected];
};

export default useSignalR;
