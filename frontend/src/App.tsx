import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DataProvider } from "@/context/DataContext";
import BottomNav from "@/components/BottomNav";
import Dashboard from "./pages/Dashboard";
import FoodLogPage from "./pages/FoodLog";
import MoodLogPage from "./pages/MoodLog";
import SuggestionsPage from "./pages/Suggestions";
import SettingsPage from "./pages/Settings";
import TrackProgressPage from "./pages/TrackProgress";
import NotFound from "./pages/NotFound";

// Jeremy Richards git commit 3-17: tested app and is ready for deployment

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <DataProvider>
        <Toaster />
        <Sonner position="top-center" toastOptions={{ className: 'font-display' }} />
        <BrowserRouter>
          <div className="max-w-md mx-auto min-h-screen relative">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/food" element={<FoodLogPage />} />
              <Route path="/mood" element={<MoodLogPage />} />
              <Route path="/suggest" element={<SuggestionsPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/progress" element={<TrackProgressPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <BottomNav />
          </div>
        </BrowserRouter>
      </DataProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
