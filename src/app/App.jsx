import { useState } from "react";
import { Routes, Route, useNavigate, useParams } from "react-router";
import { LandingPage } from "@/features/landing";
import { AuthPage } from "@/features/auth";
import { DealFeed, DealDetailPage } from "@/features/deal";
import { InvestorDashboard, FounderDashboard } from "@/features/dashboard";
import { SubscriptionPage } from "@/features/subscription";
import { ROLES } from "@/features/auth/types/auth.types";

// Extracts :id from URL and passes it down to DealDetailPage
function DealDetailWrapper({ onNavigate, userRole, onLogout }) {
  const { id } = useParams();
  return (
    <DealDetailPage
      dealId={parseInt(id, 10)}
      onNavigate={onNavigate}
      userRole={userRole}
      onLogout={onLogout}
    />
  );
}

export default function App() {
  const rNavigate = useNavigate();
  const [userRole, setUserRole] = useState(ROLES.GUEST);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  /** Central navigate helper — maps logical page names to URL paths */
  const navigate = (page, dealId) => {
    const routes = {
      landing:            "/",
      auth:               "/login",
      "deal-feed":        "/deals",
      "investor-dashboard": "/dashboard",
      "founder-dashboard": "/dashboard/founder",
      subscription:       "/subscription",
    };
    if (page === "deal-detail" && dealId !== undefined) {
      rNavigate(`/deals/${dealId}`);
    } else if (routes[page]) {
      rNavigate(routes[page]);
    }
  };

  const handleAuth = (role) => {
    setUserRole(role);
    setIsAuthenticated(true);
    if (role === ROLES.INVESTOR) navigate("deal-feed");
    else if (role === ROLES.FOUNDER) navigate("founder-dashboard");
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserRole(ROLES.GUEST);
    navigate("landing");
  };

  const sharedProps = { onNavigate: navigate, userRole, onLogout: handleLogout };

  return (
    <div className="min-h-screen bg-black dark text-white relative overflow-hidden">
      {/* Global ambient background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#01F27B]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#01F27B]/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10">
        <Routes>
          <Route path="/"                element={<LandingPage onNavigate={navigate} />} />
          <Route path="/login"           element={<AuthPage onAuth={handleAuth} onBack={() => navigate("landing")} />} />
          <Route path="/deals"           element={<DealFeed {...sharedProps} />} />
          <Route path="/deals/:id"       element={<DealDetailWrapper {...sharedProps} />} />
          <Route path="/dashboard"       element={<InvestorDashboard {...sharedProps} />} />
          <Route path="/dashboard/founder" element={<FounderDashboard {...sharedProps} />} />
          <Route path="/subscription"    element={<SubscriptionPage {...sharedProps} />} />
        </Routes>
      </div>
    </div>
  );
}
