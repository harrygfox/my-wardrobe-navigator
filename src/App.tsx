
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import GarmentDetail from "./pages/GarmentDetail";
import NotFound from "./pages/NotFound";
import { UnitProvider } from "@/contexts/UnitContext";
import { MeasurementProvider } from "@/contexts/MeasurementContext";
import React from 'react'; // Explicitly importing React

// Create a new QueryClient instance
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter basename="/my-wardrobe-navigator">
      <UnitProvider>
        <MeasurementProvider>
          <Toaster />
          <Sonner />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/garment/:id" element={<GarmentDetail />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </MeasurementProvider>
      </UnitProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
