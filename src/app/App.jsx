import { Navigate, Routes, Route, useParams, useNavigate } from "react-router";
import { LandingPage } from "@/features/landing";
import { AuthPage } from "@/features/auth";
import { DealFeed, DealDetailPage } from "@/features/deal";
import { InvestorDashboard, FounderDashboard } from "@/features/dashboard";
import { SubscriptionPage } from "@/features/subscription";
import { useAuth } from "@/features/auth/hooks/useAuth";

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
      dealId={parseInt(id, 10)}
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
    const routes = {
      landing: "/",
      auth: "/login",
      "deal-feed": "/deals",
      "investor-dashboard": "/dashboard",
      "founder-dashboard": "/dashboard/founder",
      subscription: "/subscription",
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
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#01F27B]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#01F27B]/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage onNavigate={navigate} />} />
          <Route path="/login" element={
            isAuthenticated
              ? <Navigate to={role === 'founder' ? '/dashboard/founder' : '/dashboard'} replace />
              : <AuthPage onBack={() => window.history.back()} />
          } />
          <Route path="/deals" element={<DealFeed {...sharedProps} />} />
          <Route path="/deals/:id" element={<DealDetailWrapper onNavigate={navigate} />} />
          <Route path="/subscription" element={<SubscriptionPage {...sharedProps} />} />

          {/* Protected routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <InvestorDashboard {...sharedProps} />
            </ProtectedRoute>
          } />
          <Route path="/dashboard/founder" element={
            <ProtectedRoute>
              <FounderDashboard {...sharedProps} />
            </ProtectedRoute>
          } />
        </Routes>
      </div>
    </div>
  );
}
