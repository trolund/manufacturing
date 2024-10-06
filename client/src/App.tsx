import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import OverviewPage from "./views/OverviewPage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import EquipmentPage from "./views/EquipmentPage";
import HistoryPage from "./views/HistoryPage";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <header className="bg-gray-900 text-white flex items-center h-12 w-full">
        <div className="container mx-auto">
          <a className="navbar-brand" href="/">
            Factory manager
          </a>
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
