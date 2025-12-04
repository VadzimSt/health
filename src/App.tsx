import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { RequestsProvider } from "@/contexts/RequestsContext";

import Index from "./pages/Index";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

// Patient pages
import PatientDashboard from "./pages/patient/PatientDashboard";
import NewRequest from "./pages/patient/NewRequest";
import PatientRequestDetail from "./pages/patient/RequestDetail";
import Profile from "./pages/patient/Profile";

// Doctor pages
import DoctorDashboard from "./pages/doctor/DoctorDashboard";
import DoctorRequestDetail from "./pages/doctor/DoctorRequestDetail";

const queryClient = new QueryClient();

// Protected route wrapper
function ProtectedRoute({
  children,
  allowedRole,
}: {
  children: React.ReactNode;
  allowedRole?: "patient" | "admin";
}) {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  if (allowedRole && user?.role !== allowedRole) {
    return (
      <Navigate to={user?.role === "admin" ? "/doctor" : "/patient"} replace />
    );
  }

  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/auth" element={<Auth />} />

      {/* Patient Routes */}
      <Route
        path="/patient"
        element={
          <ProtectedRoute allowedRole="patient">
            <PatientDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/patient/profile"
        element={
          <ProtectedRoute allowedRole="patient">
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/patient/new-request"
        element={
          <ProtectedRoute allowedRole="patient">
            <NewRequest />
          </ProtectedRoute>
        }
      />
      <Route
        path="/patient/request/:id"
        element={
          <ProtectedRoute allowedRole="patient">
            <PatientRequestDetail />
          </ProtectedRoute>
        }
      />

      {/* Doctor Routes */}
      <Route
        path="/doctor"
        element={
          <ProtectedRoute allowedRole="admin">
            <DoctorDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/doctor/request/:id"
        element={
          <ProtectedRoute allowedRole="admin">
            <DoctorRequestDetail />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <RequestsProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter basename="/health">
            <AppRoutes />
          </BrowserRouter>
        </TooltipProvider>
      </RequestsProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
