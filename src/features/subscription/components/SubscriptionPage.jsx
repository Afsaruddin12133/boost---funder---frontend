import React, { useState, useEffect } from "react";
import PricingCard from "./PricingCard";
import api from "@/lib/api";
import { AlertCircle } from "lucide-react";
import { Loader, Button, Card } from "@/shared/ui";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import { useAuth } from "@/features/auth/hooks/useAuth";

const FALLBACK_PLANS = [
  {
    name: "free",
    price: 0,
    duration: "forever",
    features: [
      "Browse all deals",
      "Save up to 5 deals",
      "Basic filters"
    ],
  },
  {
    name: "pro",
    price: 99,
    duration: "monthly",
    features: [
      "Everything in Free",
      "Unlimited saved deals",
      "Request access to founders",
      "Full deal details",
      "Priority support"
    ],
  },
  {
    name: "elite",
    price: 299,
    duration: "monthly",
    features: [
      "Everything in Pro",
      "Direct founder messages",
      "Early access to deals",
      "Dedicated account manager"
    ],
  }
];

export default function SubscriptionPage() {
  const [plans, setPlans] = useState([]);
  const [userSub, setUserSub] = useState(null);
  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState(false);
  const [error, setError] = useState(null);
  
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const isGuest = !isAuthenticated;

  const fetchSubscriptionData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const plansRes = await api.get('/api/v1/subscription').catch(() => null);
      let fetchedPlans = Array.isArray(plansRes) ? plansRes : (plansRes?.data?.plans || plansRes?.data?.items || plansRes?.data || plansRes?.plans);
      
      if (!Array.isArray(fetchedPlans) || fetchedPlans.length === 0) {
        fetchedPlans = FALLBACK_PLANS;
      }
      setPlans(fetchedPlans);
      
      if (!isGuest) {
        try {
          const mySubRes = await api.get('/api/v1/subscription/me');
          setUserSub(mySubRes?.data || mySubRes);
        } catch (e) {
          console.error("No active subscription or failed to fetch", e);
        }
      }
    } catch (err) {
      setError(err.message || "Failed to load subscription data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptionData();
    // eslint-disable-next-line
  }, [isGuest]);

  const handleUpgrade = async (planName) => {
    if (isGuest) {
      navigate('/login');
      return;
    }

    try {
      setUpgrading(true);
      // 1. Call the backend to create the MyFatoorah session
      const response = await api.post('/api/v1/payments/create', { planName: planName.toLowerCase() });
      
      // 2. Extract URL and redirect
      const paymentUrl = response?.data?.paymentUrl || response?.paymentUrl || response?.data?.data?.paymentUrl;
      
      if (paymentUrl) {
        window.location.href = paymentUrl;
      } else {
        throw new Error("No payment URL received");
      }
    } catch (err) {
      toast.error(err.message || "Failed to initialize payment. Please try again.");
      setUpgrading(false);
    }
  };

  const getPlanName = (sub) => {
    if (!sub) return 'free';
    if (typeof sub === 'string') return sub;
    const p = sub.activePlan || sub.plan || sub.name;
    if (typeof p === 'string') return p;
    if (p?.name) return p.name;
    return 'free';
  };

  const currentPlan = !isGuest ? getPlanName(userSub) : 'free';
  const expiresAt = userSub?.expiresAt || userSub?.endDate;

  if (loading) {
    return <Loader label="Loading pricing plans..." />;
  }

  if (error) {
    return (
      <div className="w-full flex flex-col items-center justify-center min-h-[50vh] text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <h3 className="text-xl font-bold text-white mb-2">Failed to load plans</h3>
        <p className="text-white/60 mb-6">{error}</p>
        <Button onClick={fetchSubscriptionData} className="bg-[#01F27B] text-black hover:bg-[#01F27B]/90 font-semibold">
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-12 relative z-10">
      {/* Header & User Info section */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
          Choose your <span className="text-[#01F27B]">Plan</span>
        </h1>
        <p className="text-white/60 text-lg max-w-2xl mx-auto">
          Unlock exclusive deal flow and connect directly with top tier founders.
        </p>
      </div>

      {!isGuest && (
        <Card className="bg-[#0c0c0c] border-white/10 p-6 flex flex-col sm:flex-row items-center justify-between max-w-2xl mx-auto">
          <div className="mb-4 sm:mb-0 text-center sm:text-left">
            <p className="text-sm text-white/50 mb-1">Current Status</p>
            <div className="flex items-center gap-3 justify-center sm:justify-start">
              <span className="text-xl font-bold capitalize text-white">{currentPlan} Plan</span>
              {currentPlan.toLowerCase() !== 'free' && (
                <span className="px-2 py-0.5 rounded-full bg-[#01F27B]/10 text-[#01F27B] text-xs font-bold border border-[#01F27B]/20">
                  Active
                </span>
              )}
            </div>
          </div>
          <div className="text-center sm:text-right">
            {currentPlan.toLowerCase() === 'free' ? (
              <span className="text-sm text-white/50">No active premium subscription</span>
            ) : (
              <>
                <p className="text-sm text-white/50 mb-1">Renews on</p>
                <p className="font-medium text-white">
                  {expiresAt ? new Date(expiresAt).toLocaleDateString() : 'Auto-renewing'}
                </p>
              </>
            )}
          </div>
        </Card>
      )}

      {/* Pricing Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
        {/* Loading overlay for upgrade action */}
        {upgrading && (
          <div className="absolute inset-0 z-50 bg-[#0c0c0c]/50 backdrop-blur-sm rounded-3xl flex items-center justify-center">
            <Loader size="lg" label="Preparing checkout..." />
          </div>
        )}

        {plans.map((plan, idx) => (
          <PricingCard
            key={idx}
            plan={plan}
            currentPlan={currentPlan}
            isGuest={isGuest}
            onUpgrade={handleUpgrade}
          />
        ))}
      </div>
    </div>
  );
}
