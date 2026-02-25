import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import AppLayout from "@/components/AppLayout";
import LoginPage from "@/pages/LoginPage";
import SignupPage from "@/pages/SignupPage";
import OnboardingPage from "@/pages/OnboardingPage";
import HomePage from "@/pages/HomePage";
import EventHistoryPage from "@/pages/EventHistoryPage";
import ProductShowcasePage from "@/pages/ProductShowcasePage";
import ProfilePage from "@/pages/ProfilePage";
import SchemesPage from "@/pages/SchemesPage";
import GuidancePage from "@/pages/GuidancePage";
import NotificationsPage from "@/pages/NotificationsPage";
import ProductDiscoveryPage from "@/pages/investor/ProductDiscoveryPage";
import ProductDetailPage from "@/pages/investor/ProductDetailPage";
import EntrepreneurProfilePage from "@/pages/investor/EntrepreneurProfilePage";
import InvestorProfilePage from "@/pages/investor/InvestorProfilePage";
import InvestorNotificationsPage from "@/pages/investor/InvestorNotificationsPage";
import OrganizerDashboardPage from "@/pages/organizer/OrganizerDashboardPage";
import OrganizerInvitationsPage from "@/pages/organizer/OrganizerInvitationsPage";
import OrganizerApplicationsPage from "@/pages/organizer/OrganizerApplicationsPage";
import OrganizerNotificationsPage from "@/pages/organizer/OrganizerNotificationsPage";
import OrganizerProfilePage from "@/pages/organizer/OrganizerProfilePage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function AppRoutes() {
  const { user } = useAuth();

  // Not logged in — show auth pages
  if (!user) {
    return (
      <Routes>
        <Route path="/signup" element={<SignupPage />} />
        <Route path="*" element={<LoginPage />} />
      </Routes>
    );
  }

  // Logged in but not onboarded
  if (!user.onboarded) {
    return <OnboardingPage />;
  }

  return (
    <AppLayout>
      <Routes>
        {user.role === "entrepreneur" && (
          <>
            <Route path="/" element={<HomePage />} />
            <Route path="/history" element={<EventHistoryPage />} />
            <Route path="/products" element={<ProductShowcasePage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/schemes" element={<SchemesPage />} />
            <Route path="/guidance" element={<GuidancePage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
          </>
        )}
        {user.role === "investor" && (
          <>
            <Route path="/investor/discover" element={<ProductDiscoveryPage />} />
            <Route path="/investor/product/:id" element={<ProductDetailPage />} />
            <Route path="/investor/entrepreneur/:id" element={<EntrepreneurProfilePage />} />
            <Route path="/investor/profile" element={<InvestorProfilePage />} />
            <Route path="/investor/notifications" element={<InvestorNotificationsPage />} />
            <Route path="/" element={<Navigate to="/investor/discover" replace />} />
          </>
        )}
        {user.role === "organizer" && (
          <>
            <Route path="/organizer/events" element={<OrganizerDashboardPage />} />
            <Route path="/organizer/invitations" element={<OrganizerInvitationsPage />} />
            <Route path="/organizer/applications" element={<OrganizerApplicationsPage />} />
            <Route path="/organizer/notifications" element={<OrganizerNotificationsPage />} />
            <Route path="/organizer/profile" element={<OrganizerProfilePage />} />
            <Route path="/" element={<Navigate to="/organizer/events" replace />} />
          </>
        )}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AppLayout>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
