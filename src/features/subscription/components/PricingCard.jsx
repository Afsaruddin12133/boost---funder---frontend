import React from "react";
import { Check, Rocket, Zap, Crown } from "lucide-react";
import { Card } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";

const PLAN_ICONS = {
  free: Rocket,
  pro: Zap,
  elite: Crown,
};

export default function PricingCard({ plan, currentPlan, isGuest, onUpgrade }) {
  const isCurrentPlan = currentPlan?.toLowerCase() === plan.name.toLowerCase();
  const isPro = plan.name.toLowerCase() === "pro";
  const isElite = plan.name.toLowerCase() === "elite";
  
  const Icon = PLAN_ICONS[plan.name.toLowerCase()] || Rocket;

  const handleUpgradeClick = () => {
    if (isCurrentPlan) return;
    onUpgrade(plan.name.toLowerCase());
  };

  const renderButtonText = () => {
    if (isGuest) return "Sign in to upgrade";
    if (isCurrentPlan) return "Current Plan";
    return "Upgrade";
  };

  return (
    <Card
      className={`relative overflow-hidden p-8 transition-all duration-300 hover:-translate-y-1 flex flex-col h-full
        ${isCurrentPlan ? "border-[#01F27B] bg-gradient-to-b from-[#01F27B]/10 to-[#0c0c0c] shadow-[0_0_30px_rgba(1,242,123,0.15)]" : "bg-[#0c0c0c] border-white/10 hover:border-white/30"}
        ${isPro && !isCurrentPlan ? "border-[#01F27B]/50 hover:border-[#01F27B] shadow-[0_0_20px_rgba(1,242,123,0.05)]" : ""}
      `}
    >
      {/* Top Accent Line for Pro */}
      {isPro && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#01F27B] to-transparent" />
      )}
      
      {/* Ambient background glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#01F27B]/10 to-transparent rounded-full blur-2xl" />

      <div className="relative z-10 flex-1 flex flex-col">
        {/* Badges */}
        <div className="absolute -top-1 right-0 flex gap-2">
           {isCurrentPlan && (
             <Badge className="bg-[#01F27B] text-black border-[#01F27B] font-bold">
               Current Plan
             </Badge>
           )}
           {!isCurrentPlan && isPro && (
             <Badge className="bg-[#01F27B] text-black border-[#01F27B] font-bold">
               Most Popular
             </Badge>
           )}
           {!isCurrentPlan && isElite && (
             <Badge className="bg-[#f59e0b] text-black border-[#f59e0b] font-bold">
               Best Value
             </Badge>
           )}
        </div>

        <div className="mb-6 mt-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${isPro || isCurrentPlan ? 'bg-[#01F27B]/10' : 'bg-white/5'}`}>
            <Icon className={`w-6 h-6 ${isPro || isCurrentPlan ? 'text-[#01F27B]' : 'text-white/70'}`} />
          </div>
          
          <h3 className="text-2xl font-bold mb-2 capitalize">{plan.name}</h3>
          
          <div className="mb-2 flex items-end gap-1">
            <span className="text-4xl font-bold">${plan.price}</span>
            <span className="text-white/60 mb-1">/{plan.duration}</span>
          </div>
        </div>

        <Button
          onClick={handleUpgradeClick}
          disabled={isCurrentPlan && !isGuest}
          className={`w-full mb-8 font-semibold rounded-xl
            ${isCurrentPlan ? "bg-white/10 text-white/50 cursor-not-allowed hover:bg-white/10" : ""}
            ${!isCurrentPlan && (isPro || isElite) ? "bg-[#01F27B] text-black hover:bg-[#01F27B]/90" : ""}
            ${!isCurrentPlan && !isPro && !isElite ? "bg-white text-black hover:bg-white/90" : ""}
          `}
        >
          {renderButtonText()}
        </Button>

        <div className="space-y-4 flex-1">
          <p className="text-sm font-medium text-white/80 mb-4">What's included:</p>
          {plan.features?.map((feature, idx) => (
            <div key={idx} className="flex items-start gap-3">
              <Check className="w-5 h-5 text-[#01F27B] flex-shrink-0" />
              <span className="text-sm text-white/70 leading-tight">{feature}</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
