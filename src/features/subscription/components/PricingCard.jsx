import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Card } from "@/shared/ui/card";
import { Check, Crown, Rocket, Zap, ChevronRight } from "lucide-react";

const PLAN_ICONS = {
  free: Rocket,
  pro: Zap,
  elite: Crown,
};

const PLAN_THEMES = {
  free: {
    color: "#ffffff",
    bg: "bg-white/5",
    border: "border-white/10",
    glow: "bg-white/10",
    button: "bg-white/10 text-white hover:bg-white/20",
    iconBg: "bg-white/5",
    accent: "text-white/40"
  },
  pro: {
    color: "#01F27B",
    bg: "bg-[#01F27B]/5",
    border: "border-[#01F27B]/40",
    glow: "bg-[#01F27B]/20",
    button: "bg-[#01F27B] text-black hover:bg-[#00d66d] shadow-[0_0_25px_rgba(1,242,123,0.4)]",
    iconBg: "bg-[#01F27B]/10",
    accent: "text-[#01F27B]"
  },
  elite: {
    color: "#f59e0b",
    bg: "bg-amber-500/5",
    border: "border-amber-500/40",
    glow: "bg-amber-500/20",
    button: "bg-amber-500 text-black hover:bg-amber-600 shadow-[0_0_25px_rgba(245,158,11,0.4)]",
    iconBg: "bg-amber-500/10",
    accent: "text-amber-500"
  }
};

export default function PricingCard({ plan, currentPlan, isGuest, onUpgrade }) {
  const planName = plan.name.toLowerCase();
  const isCurrentPlan = currentPlan?.toLowerCase() === planName;
  const theme = PLAN_THEMES[planName] || PLAN_THEMES.free;
  const Icon = PLAN_ICONS[planName] || Rocket;

  const handleUpgradeClick = () => {
    if (isCurrentPlan) return;
    onUpgrade(planName);
  };

  return (
    <Card
      className={`relative overflow-hidden p-6 transition-all duration-500 hover:-translate-y-2 group flex flex-col h-full
        ${isCurrentPlan ? `bg-black ${theme.bg} shadow-[0_0_50px_rgba(1,242,123,0.15)]` : `bg-[#0c0c0c] border-white/10 hover:border-white/30 shadow-2xl`}
      `}
      style={{ 
        borderColor: isCurrentPlan ? theme.color : undefined,
        borderWidth: isCurrentPlan ? '2px' : '1px'
      }}
    >
      {/* Intense Decorative Glow */}
      <div className={`absolute -top-20 -right-20 w-64 h-64 ${theme.glow} rounded-full blur-[80px] opacity-20 group-hover:opacity-60 transition-all duration-700 pointer-events-none`} />
      
      {/* Accent Line for all cards */}
      <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[${theme.color}] to-transparent opacity-50 group-hover:opacity-100 transition-opacity`} 
           style={{ background: `linear-gradient(90deg, transparent, ${theme.color}, transparent)` }} />
      
      <div className="relative z-10 flex-1 flex flex-col">
        {/* Header Section */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${theme.iconBg} border border-white/10 shadow-[inset_0_0_15px_rgba(255,255,255,0.05)]`}>
              <Icon className="w-6 h-6" style={{ color: theme.color }} />
            </div>
            {planName === 'pro' && (
              <Badge className="bg-[#01F27B] text-black border-[#01F27B] text-[9px] font-black uppercase tracking-widest px-3 py-1 shadow-[0_0_15px_rgba(1,242,123,0.4)]">Most Popular</Badge>
            )}
            {planName === 'elite' && (
              <Badge className="bg-amber-500 text-black border-amber-500 text-[9px] font-black uppercase tracking-widest px-3 py-1 shadow-[0_0_15px_rgba(245,158,11,0.4)]">Elite Choice</Badge>
            )}
          </div>
          
          <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter mb-1">{plan.name}</h3>
          <p className="text-xs text-white/50 font-semibold leading-tight">
            {plan.description || "Unlock premium features and scale."}
          </p>
        </div>

        {/* Pricing Section */}
        <div className="mb-6 flex items-baseline gap-1">
          <span className="text-5xl font-black text-white italic tracking-tighter group-hover:scale-110 transition-transform duration-500 origin-left">${plan.price}</span>
          <span className="text-[11px] font-black text-white/40 uppercase tracking-widest">/ {plan.duration}</span>
        </div>

        {/* Action Button */}
        <Button
          onClick={handleUpgradeClick}
          disabled={isCurrentPlan && !isGuest}
          className={`w-full h-12 rounded-2xl font-black uppercase tracking-[0.15em] text-[11px] transition-all duration-300 flex items-center justify-center gap-2 group/btn
            ${isCurrentPlan ? "bg-white/5 text-white/30 border border-white/10 cursor-not-allowed" : theme.button}
          `}
        >
          {isCurrentPlan ? "Current Active Plan" : (
            <>
              {isGuest ? "Sign in to Unlock" : "Upgrade to " + plan.name}
              <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
            </>
          )}
        </Button>

        {/* Features List - Stronger & Bigger Font */}
        <div className="mt-8 space-y-4 flex-1">
          <div className="flex items-center gap-3">
            <div className={`h-[1px] flex-1 bg-gradient-to-r from-transparent to-[${theme.color}] opacity-20`} style={{ background: `linear-gradient(90deg, transparent, ${theme.color})`, opacity: 0.2 }} />
            <p className={`text-[10px] font-black uppercase tracking-[0.25em] ${theme.accent}`}>Key Benefits</p>
            <div className={`h-[1px] flex-1 bg-gradient-to-l from-transparent to-[${theme.color}] opacity-20`} style={{ background: `linear-gradient(270deg, transparent, ${theme.color})`, opacity: 0.2 }} />
          </div>
          
          <div className="space-y-3.5">
            {plan.features?.map((feature, idx) => (
              <div key={idx} className="flex items-center gap-3.5 group/item">
                <div className={`w-5 h-5 rounded-lg flex items-center justify-center ${isCurrentPlan || planName !== 'free' ? 'bg-[#01F27B]/20 border border-[#01F27B]/30' : 'bg-white/10 border border-white/10'} shrink-0 group-hover/item:scale-110 transition-transform`}>
                  <Check className={`w-3 h-3 ${isCurrentPlan || planName !== 'free' ? 'text-[#01F27B]' : 'text-white/40'}`} strokeWidth={4} />
                </div>
                <span className="text-[13px] md:text-sm text-white/80 group-hover/item:text-white transition-colors leading-none font-bold tracking-tight">
                  {feature}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Intense Bottom Glow */}
      {isCurrentPlan && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#01F27B] shadow-[0_0_20px_rgba(1,242,123,0.8)]" />
      )}
    </Card>
  );
}
