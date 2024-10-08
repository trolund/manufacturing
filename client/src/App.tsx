import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import OverviewPage from "./views/OverviewPage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import EquipmentPage from "./views/EquipmentPage";
import HistoryPage from "./views/HistoryPage";
import { useEffect, useState } from "react";
import ConnectionBar from "./components/ConnectionBar";

const queryClient = new QueryClient();

function App() {
  const [isconnected, setIsconnected] = useState(true);

  useEffect(() => {
    const handleEvent = (event: CustomEvent<boolean>) => {
      setIsconnected(event.detail);
    };

    window.addEventListener("connectionUpdate", handleEvent as EventListener);

    return () => {
      window.removeEventListener(
        "connectionUpdate",
        handleEvent as EventListener,
      );
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <header className="sticky top-0 flex h-12 w-full items-center bg-gray-900 text-white">
        <div className="container mx-auto flex max-w-screen-lg justify-between p-10">
          <a className="navbar-brand" href="/">
            Factory manager
          </a>
          <div>
            <ConnectionBar isconnected={isconnected} />
          </div>
          <nav>
            <ul className="flex gap-4">
              <li>
                <a href="/">Overview</a>
              </li>
              <li>
                <a href="/history">History</a>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <main>
        <div className="container mx-auto max-w-screen-lg p-10">
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<OverviewPage />} />
              <Route
                path="equipment/:equipmentId"
                element={<EquipmentPage />}
              />
              <Route path="history" element={<HistoryPage />} />
            </Routes>
          </BrowserRouter>
        </div>
      </main>
    </QueryClientProvider>
  );
}

export default App;
