import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import DraftDetail from "./pages/DraftDetail.tsx";
import VoicePage from "./pages/VoicePage.tsx";
import OnboardingLayout from "./pages/onboarding/OnboardingLayout.tsx";
import StepName from "./pages/onboarding/StepName.tsx";
import StepSubstance from "./pages/onboarding/StepSubstance.tsx";
import StepGallery from "./pages/onboarding/StepGallery.tsx";
import StepMix from "./pages/onboarding/StepMix.tsx";
import StepDNA from "./pages/onboarding/StepDNA.tsx";
import StepWow from "./pages/onboarding/StepWow.tsx";
import AuthCallback from "./pages/AuthCallback.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/voice" element={<VoicePage />} />
          <Route path="/draft/:id" element={<DraftDetail />} />
          <Route path="/onboarding" element={<OnboardingLayout />}>
            <Route index element={<Navigate to="/onboarding/name" replace />} />
            <Route path="name" element={<StepName />} />
            <Route path="substance" element={<StepSubstance />} />
            <Route path="gallery" element={<StepGallery />} />
            <Route path="mix" element={<StepMix />} />
            <Route path="dna" element={<StepDNA />} />
            <Route path="wow" element={<StepWow />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
