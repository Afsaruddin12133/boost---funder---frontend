import { Lock } from "lucide-react";
import { Briefcase, Target } from "lucide-react";
import { cn } from "@/shared/ui/utils";
import { hasValue } from "../utils/dealAccess";

export function ProductStorySection({ story }) {
  if (!story?.problem && !story?.solution && !story?.vision && !story?.strategicVision) return null;

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[24px] p-6 lg:p-10 mb-8 relative overflow-hidden">
      <div className="flex justify-between items-start mb-8 lg:mb-12">
        <div>
          <h3 className="text-sm lg:text-base font-black text-white/90 tracking-[0.2em] uppercase mb-1">Product Story</h3>
          <p className="text-[#01F27B] font-medium text-[13px]">Strategic Vision</p>
        </div>
        <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-[14px] bg-[#01F27B] flex items-center justify-center shrink-0">
          <Briefcase className="w-5 h-5 lg:w-6 lg:h-6 text-black" />
        </div>
      </div>

      <div className="space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-20">
          {story?.problem && (
            <div className="space-y-3">
              <h4 className="text-[#01F27B] text-[10px] font-black uppercase tracking-widest">The Problem</h4>
              <p className="text-white/70 text-sm leading-relaxed">{story.problem}</p>
            </div>
          )}
          {(story?.vision || story?.strategicVision || story?.targetMarket) && (
            <div className="space-y-3">
              <h4 className="text-[#01F27B] text-[10px] font-black uppercase tracking-widest">Strategic Vision</h4>
              <p className="text-white/70 text-sm leading-relaxed">{story.vision || story.strategicVision || story.targetMarket}</p>
            </div>
          )}
        </div>

        {story?.solution && (
          <div className="space-y-3 pt-8 border-t border-white/10">
            <h4 className="text-[#01F27B] text-[10px] font-black uppercase tracking-widest">The Solution</h4>
            <p className="text-white/70 text-sm leading-relaxed">{story.solution}</p>
          </div>
        )}
      </div>
    </div>
  );
}

function MarketStrategyCard({ title, content, locked, onUpgrade }) {
  const hasContent = hasValue(content);

  return (
    <div 
      onClick={locked ? onUpgrade : undefined}
      className={cn(
        "bg-white/[0.02] border border-white/5 rounded-[16px] p-5 relative overflow-hidden group transition-all h-full min-h-[140px]",
        locked ? "cursor-pointer hover:border-amber-500/30" : "hover:border-[#01F27B]/30 hover:bg-white/[0.04]"
      )}
    >
      <h4 className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-3">{title}</h4>
      <div className={cn("text-sm text-white/80 leading-relaxed", locked && "blur-[4px] select-none opacity-30")}>
        {locked ? "This premium strategic data is locked. Upgrade to Pro subscription plan to access full founder insights and competitive intelligence." : (hasContent ? content : <span className="italic text-white/30">Not specified.</span>)}
      </div>
      {locked && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/75 backdrop-blur-[3px] p-4 text-center group cursor-pointer" onClick={onUpgrade}>
          <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center mb-2 shadow-[0_0_15px_rgba(245,158,11,0.2)] group-hover:scale-110 transition-transform">
             <Lock className="text-amber-500 w-4 h-4" />
          </div>
          <p className="text-[9px] text-white/50 mb-2">Requires Pro Plan</p>
          <button className="bg-amber-500 hover:bg-amber-400 text-black font-black text-[9px] uppercase tracking-wider px-3 py-1.5 rounded-lg transition-all active:scale-95">
            Upgrade to Pro
          </button>
        </div>
      )}
    </div>
  );
}

export function MarketStrategySection({ story, execution, topCompetitor, lockedPremium, onUpgrade }) {
  console.log(topCompetitor);
  
  const cards = [
    { title: "Target Market", content: story?.targetMarket },
    { title: "Why Now", content: story?.whyNow },
    { title: "Business Model", content: execution?.businessModel },
    { title: "Go-To-Market", content: execution?.goToMarket },
    { title: "Top Competitor", content: topCompetitor },
    { title: "Core Advantage", content: execution?.advantage },
  ];

  if (cards.every(c => !hasValue(c.content)) && !lockedPremium) {
    // If absolutely everything is empty, maybe we don't render the section at all? 
    // Or we render it with empty cards. Let's render it to maintain structure.
  }

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[24px] p-6 lg:p-10 mb-10 relative overflow-hidden">
      <div className="flex justify-between items-start mb-8 lg:mb-12">
        <div>
          <h3 className="text-sm lg:text-base font-black text-white/90 tracking-[0.2em] uppercase mb-1">Market & Strategy</h3>
          <p className="text-[#01F27B] font-medium text-[13px]">Founder Narrative</p>
        </div>
        <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-[14px] bg-[#01F27B] flex items-center justify-center shrink-0">
          <Target className="w-5 h-5 lg:w-6 lg:h-6 text-black" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
        {cards.map((card, i) => (
          <MarketStrategyCard 
            key={i} 
            title={card.title} 
            content={card.content} 
            locked={lockedPremium} 
            onUpgrade={onUpgrade} 
          />
        ))}
      </div>
    </div>
  );
}
