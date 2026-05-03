import React, { useState, useEffect } from "react";
import PricingCard from "./PricingCard";
import api from "@/lib/api";
import { AlertCircle, Sparkles, Zap, ShieldCheck } from "lucide-react";
import { Loader, Button, Card } from "@/shared/ui";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import { useAuth } from "@/features/auth/hooks/useAuth";

const FALLBACK_PLANS = [
  {
    name: "free",
    price: 0,
    duration: "forever",
    description: "Start exploring the startup ecosystem with zero upfront costs.",
    features: [
      "Browse all public deals",
      "Save up to 5 deals",
      "Basic search filters",
      "Community support"
    ],
  },
  {
    name: "pro",
    price: 99,
    duration: "monthly",
    description: "For active investors looking for consistent deal flow and engagement.",
    features: [
      "Everything in Free",
      "Unlimited saved deals",
      "Request access to founders",
      "Full financial deal details",
      "Priority customer support",
      "Exclusive pitch deck access"
    ],
  },
  {
    name: "elite",
    price: 299,
    duration: "monthly",
    description: "The ultimate tier for institutional investors and high-volume syndicates.",
    features: [
      "Everything in Pro",
      "Direct founder messaging",
      "Early bird deal access",
      "Dedicated account manager",
      "Custom analytics dashboard",
      "Verified Investor badge"
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
      const response = await api.post('/api/v1/payments/create', { planName: planName.toLowerCase() });
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
    return <Loader label="Calibrating pricing tiers..." />;
  }

  if (error) {
    return (
      <div className="w-full flex flex-col items-center justify-center min-h-[50vh] text-center px-6">
        <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-6">
          <AlertCircle className="w-8 h-8 text-red-500" />
        </div>
        <h3 className="text-2xl font-black text-white mb-2 italic uppercase tracking-tighter">Sync Error</h3>
        <p className="text-white/40 mb-8 max-w-sm font-medium">{error}</p>
        <Button onClick={fetchSubscriptionData} className="bg-[#01F27B] text-black hover:bg-[#00d66d] font-black rounded-xl px-8 h-12 shadow-[0_0_20px_rgba(1,242,123,0.3)] transition-all">
          Retry Connection
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full pb-6 space-y-6 md:space-y-8 animate-in fade-in duration-1000">
      {/* Premium Header - More Compact */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/5 pb-4 md:pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#01F27B] animate-pulse" />
            <span className="text-[9px] font-black text-[#01F27B] uppercase tracking-[0.3em]">Premium Access</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tighter uppercase italic leading-none">
            Choose your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#01F27B] to-[#00d66d]">Tier</span>
          </h1>
          <p className="text-white/40 text-xs md:text-sm font-medium tracking-wide max-w-2xl">
            Unlock exclusive deal flow and connect directly with high-impact founders.
          </p>
        </div>

        {!isGuest && (
          <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/10 backdrop-blur-xl">
            <div className="w-8 h-8 rounded-lg bg-[#01F27B]/10 flex items-center justify-center">
              <Zap className="w-4 h-4 text-[#01F27B]" />
            </div>
            <div>
              <p className="text-[9px] font-black text-white/30 uppercase tracking-widest">Active Plan</p>
              <p className="text-sm font-black text-white uppercase italic tracking-tight">{currentPlan}</p>
            </div>
          </div>
        )}
      </div>

      {!isGuest && currentPlan.toLowerCase() !== 'free' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-3xl">
          <Card className="bg-gradient-to-br from-[#01F27B]/10 to-transparent border-[#01F27B]/20 p-4 flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-[#01F27B]" />
            <div>
              <p className="text-xs font-bold text-white">Subscription Active</p>
              <p className="text-[10px] text-white/50">Renews on {expiresAt ? new Date(expiresAt).toLocaleDateString() : 'auto-renewal'}.</p>
            </div>
          </Card>
        </div>
      )}

      {/* Pricing Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 relative pb-10">
        {/* Loading overlay for upgrade action */}
        {upgrading && (
          <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-md rounded-3xl flex flex-col items-center justify-center gap-4">
            <div className="w-12 h-12 border-4 border-[#01F27B]/30 border-t-[#01F27B] rounded-full animate-spin" />
            <p className="text-[#01F27B] font-black uppercase tracking-widest text-xs">Securing Checkout...</p>
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

      {/* Trust Footer */}
      <div className="text-center space-y-4 pt-12 border-t border-white/5">
        <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.5em]">Powered by MyFatoorah Secure Payments</p>
        <div className="flex items-center justify-center gap-8 opacity-20 grayscale filter">
          <div className="h-6 w-12 bg-white/20 rounded" />
          <div className="h-6 w-12 bg-white/20 rounded" />
          <div className="h-6 w-12 bg-white/20 rounded" />
        </div>
      </div>
    </div>
  );
}
