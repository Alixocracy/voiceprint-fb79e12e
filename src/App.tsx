import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppLayout } from "@/components/AppLayout";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import MyVoice from "./pages/MyVoice.tsx";
import MyDocuments from "./pages/MyDocuments.tsx";
import MyAgents from "./pages/MyAgents.tsx";
import SevenSystems from "./pages/SevenSystems.tsx";
import ToolsPage from "./pages/ToolsPage.tsx";
import SettingsPage from "./pages/SettingsPage.tsx";
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
import Login from "./pages/Login.tsx";
import { RequireAgnicAuth } from "./components/RequireAgnicAuth.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppLayout>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/auth/callback" element={<AuthCallback />} />

            {/* Old dashboard URL → redirect to new home */}
            <Route path="/dashboard" element={<Navigate to="/my-voice" replace />} />

            <Route path="/my-voice" element={<RequireAgnicAuth><MyVoice /></RequireAgnicAuth>} />
            <Route path="/my-documents" element={<RequireAgnicAuth><MyDocuments /></RequireAgnicAuth>} />
            <Route path="/my-agents" element={<RequireAgnicAuth><MyAgents /></RequireAgnicAuth>} />
            <Route path="/7-systems" element={<RequireAgnicAuth><SevenSystems /></RequireAgnicAuth>} />
            <Route path="/tools" element={<RequireAgnicAuth><ToolsPage /></RequireAgnicAuth>} />
            <Route path="/settings" element={<RequireAgnicAuth><SettingsPage /></RequireAgnicAuth>} />

            <Route path="/voice" element={<RequireAgnicAuth><VoicePage /></RequireAgnicAuth>} />
            <Route path="/draft/:id" element={<RequireAgnicAuth><DraftDetail /></RequireAgnicAuth>} />
            <Route path="/onboarding" element={<RequireAgnicAuth><OnboardingLayout /></RequireAgnicAuth>}>
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
        </AppLayout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
