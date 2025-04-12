
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import CandidateDashboard from "./pages/CandidateDashboard";
import RecruiterDashboard from "./pages/RecruiterDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import AssessmentPage from "./pages/AssessmentPage";
import Results from "./pages/Results";
import NotFound from "./pages/NotFound";
import Assessments from "./pages/Assessments";
import Profile from "./pages/Profile";
import Candidates from "./pages/Candidates";
import Analytics from "./pages/Analytics";
import AssessmentConfig from "./pages/AssessmentConfig";
import ModuleEditor from "./pages/ModuleEditor";
import SystemSettings from "./pages/SystemSettings";
import { TooltipProvider } from "@/components/ui/tooltip";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <TooltipProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/candidate-dashboard" element={<CandidateDashboard />} />
            <Route path="/recruiter-dashboard" element={<RecruiterDashboard />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/assessment/:assessmentId" element={<AssessmentPage />} />
            <Route path="/results/:assessmentId" element={<Results />} />
            <Route path="/results" element={<Navigate to="/results/1" replace />} />
            <Route path="/assessments" element={<Assessments />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/candidates" element={<Candidates />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/assessment-config" element={<AssessmentConfig />} />
            <Route path="/module-editor" element={<ModuleEditor />} />
            <Route path="/system-settings" element={<SystemSettings />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
          <Sonner />
        </TooltipProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
