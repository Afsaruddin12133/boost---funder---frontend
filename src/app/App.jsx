import { AuthPage } from "@/features/auth";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { FounderDashboard, InvestorDashboard } from "@/features/dashboard";
import { DealDetailPage, DealFeed, ExploreDealsList } from "@/features/deal";
import { LandingPage } from "@/features/landing";
import { SubscriptionPage } from "@/features/subscription";
import InvestorVerificationPage from "@/features/verification/components/InvestorVerificationPage";
import InvestorProfilePage from "@/features/profile/components/InvestorProfilePage";
import SavedDealsPage from "@/features/deal/components/SavedDealsPage";
import PaymentSuccessPage from "@/features/payment/components/PaymentSuccessPage";
import PaymentCancelPage from "@/features/payment/components/PaymentCancelPage";
import { Navigate, Route, Routes, useNavigate, useParams } from "react-router";
import DashboardLayout from "./layout/DashboardLayout";
import PublicLayout from "./layout/PublicLayout";
import SettingsPage from "@/features/dashboard/components/SettingsPage";
import AboutPage from "@/features/landing/components/legal/AboutPage";
import PrivacyPage from "@/features/landing/components/legal/PrivacyPage";
import TermsPage from "@/features/landing/components/legal/TermsPage";
import DisclaimerPage from "@/features/landing/components/legal/DisclaimerPage";

// ─── Protected route wrapper ──────────────────────────────────────────────────

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

// ─── URL param extractor for deal detail ─────────────────────────────────────

function DealDetailWrapper({ onNavigate }) {
  const { id } = useParams();
  const { role, logout } = useAuth();

  return (
    <DealDetailPage
      dealId={id}
      userRole={role}
      onLogout={logout}
      onNavigate={onNavigate}
    />
  );
}

// ─── App ─────────────────────────────────────────────────────────────────────

export default function App() {
  const rNavigate = useNavigate();
  const { role, logout, isAuthenticated } = useAuth();

  const navigate = (page, dealId) => {
    // If the 'page' starts with a slash or contains one, treat as direct path
    if (typeof page === 'string' && (page.includes('/') || page.includes('?'))) {
      const targetPath = page.startsWith('/') ? page : `/${page}`;
      rNavigate(targetPath);
      return;
    }

    const routes = {
      landing: "/",
      auth: "/login",
      "deal-feed": "/deals",
      "investor-dashboard": "/dashboard/investor",
      "founder-dashboard": "/dashboard/founder",
      subscription: "/subscription",
      about: "/about",
      privacy: "/privacy",
      terms: "/terms",
      disclaimer: "/disclaimer",
    };

    if (page === "deal-detail" && dealId !== undefined) {
      rNavigate(`/deals/${dealId}`);
    } else if (routes[page]) {
      rNavigate(routes[page]);
    }
  };

  const sharedProps = {
    userRole: role,
    onLogout: logout,
    onNavigate: navigate,
  };

  return (
    <div className="min-h-screen bg-black dark text-white relative overflow-hidden">
      {/* Global ambient background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#01F27B]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#01F27B]/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 h-full">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage onNavigate={navigate} />} />
          <Route path="/login" element={
            isAuthenticated 
              ? <Navigate to={role === 'founder' ? '/dashboard/founder' : '/dashboard/investor'} replace />
              : <AuthPage onBack={() => window.history.back()} onNavigate={navigate} />
          } />
          <Route path="/deals" element={<PublicLayout onNavigate={navigate}><DealFeed {...sharedProps} /></PublicLayout>} />
          <Route path="/deals/:id" element={<PublicLayout onNavigate={navigate}><DealDetailWrapper onNavigate={navigate} /></PublicLayout>} />
          <Route path="/subscription" element={<PublicLayout onNavigate={navigate}><SubscriptionPage {...sharedProps} /></PublicLayout>} />
          <Route path="/payment/success" element={<PaymentSuccessPage />} />
          <Route path="/payment/cancel" element={<PaymentCancelPage />} />
          
          {/* Legal and Info Routes */}
          <Route path="/about" element={<PublicLayout onNavigate={navigate}><AboutPage onNavigate={navigate} /></PublicLayout>} />
          <Route path="/privacy" element={<PublicLayout onNavigate={navigate}><PrivacyPage onNavigate={navigate} /></PublicLayout>} />
          <Route path="/terms" element={<PublicLayout onNavigate={navigate}><TermsPage onNavigate={navigate} /></PublicLayout>} />
          <Route path="/disclaimer" element={<PublicLayout onNavigate={navigate}><DisclaimerPage onNavigate={navigate} /></PublicLayout>} />

          {/* Protected routes */}
          <Route path="/dashboard/investor/*" element={
            <ProtectedRoute>
              <DashboardLayout userRole="investor" onNavigate={navigate} onLogout={logout}>
                <Routes>
                  <Route path="/" element={<InvestorDashboard {...sharedProps} />} />
                  <Route path="deals" element={<ExploreDealsList {...sharedProps} />} />
                  <Route path="deals/:id" element={<DealDetailWrapper onNavigate={navigate} />} />
                  <Route path="verification" element={<InvestorVerificationPage />} />
                  <Route path="profile" element={<InvestorProfilePage />} />
                  <Route path="bookmarks" element={<SavedDealsPage />} />
                  <Route path="subscription" element={<SubscriptionPage {...sharedProps} />} />
                  <Route path="settings" element={<SettingsPage />} />
                  <Route path="*" element={<Navigate to="/dashboard/investor" replace />} />
                </Routes>
              </DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/dashboard/founder/*" element={
            <ProtectedRoute>
              <DashboardLayout userRole="founder" onNavigate={navigate} onLogout={logout}>
                <FounderDashboard {...sharedProps} />
              </DashboardLayout>
            </ProtectedRoute>
          } />
        </Routes>
      </div>
    </div>
  );
}
