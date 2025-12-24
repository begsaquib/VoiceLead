import { BrowserRouter, Routes, Route } from "react-router-dom";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "./components/ui/toaster";
import { TooltipProvider } from "./components/ui/tooltip";
import NotFound from "./pages/not-found";
import LandingPage from "./pages/LandingPage";
import LandingPage1 from "./pages/LandingPage1";
import AppPage from "./pages/AppPage";

function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage1 />} />
      <Route path="/landing" element={<LandingPage />} />
      <Route path="/app" element={<AppPage />} />
      <Route path="/dashboard" element={<AppPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <Toaster />
          <AppRouter />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
