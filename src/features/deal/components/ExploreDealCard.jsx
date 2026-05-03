import React from "react";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Card } from "@/shared/ui/card";
import { 
  ArrowUpRight, 
  Building2, 
  Clock, 
  ShieldCheck, 
  TrendingUp, 
  Target,
  Zap,
  Globe,
  ChevronRight
} from "lucide-react";
import { useNavigate } from "react-router";
import { calculateDaysLeft, calculateProgress, formatCurrency } from "../utils/dealUtils";
import BookmarkButton from "./BookmarkButton";
import { useBookmark } from "../hooks/useBookmark";
import { useSavedDeals } from "../hooks/useSavedDeals";

export default function ExploreDealCard({ deal }) {
  const rawProgress = calculateProgress(
    deal.raisedAmount || deal.fundingInfo?.raisedAmount || 0,
    deal.goalAmount || deal.fundingInfo?.goalAmount || 0
  );
  const navigate = useNavigate();
  
  const handleNavigate = (e) => {
    if (e) e.stopPropagation();
    navigate(`/dashboard/investor/deals/${deal._id || deal.id}`);
  };

  const { data: savedDealsData } = useSavedDeals();
  const dealId = deal._id || deal.id;

  const startupName = deal.startupName || deal.basicInfo?.startupName || "Untitled Startup";
  const startupLogo = deal.startupLogo || deal.basicInfo?.startupLogo;
  const category = deal.category || deal.basicInfo?.category || "TECH";
  const raisedAmount = deal.raisedAmount || deal.fundingInfo?.raisedAmount || 0;
  const goalAmount = deal.goalAmount || deal.fundingInfo?.goalAmount || 0;
  const pitch = deal.pitch || deal.basicInfo?.startupDescription || deal.basicInfo?.pitch || "";

  const serverIsSaved = React.useMemo(() => {
    if (!savedDealsData) return deal.isSaved || false;
    const list = Array.isArray(savedDealsData) ? savedDealsData : (savedDealsData.bookmarks || savedDealsData.deals || []);
    return list.some(b => {
      const bId = (b.dealId?._id || b.dealId?.id || b._id || b.id);
      return bId === dealId;
    });
  }, [savedDealsData, dealId, deal.isSaved]);

  const progressPercent = rawProgress * 100;
  const daysLeft = calculateDaysLeft(deal.deadline);
  const { isSaved, isLoading, toggleBookmark } = useBookmark(dealId, serverIsSaved);
  
  // Dynamic color based on progress
  const progressColor = progressPercent >= 100 ? "#01F27B" : progressPercent >= 75 ? "#01F27B" : "#01F27B";
  
  return (
    <Card 
      className="group relative bg-[#0c0c0c] border border-white/5 hover:border-[#01F27B]/40 transition-all duration-700 flex flex-col h-full cursor-pointer overflow-hidden rounded-[2rem]" 
      onClick={handleNavigate}
    >
      {/* ── INNOVATIVE BACKGROUND ── */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#01F27B]/5 rounded-full blur-[100px] -mr-32 -mt-32 group-hover:bg-[#01F27B]/10 transition-colors duration-700 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/[0.02] rounded-full blur-[80px] -ml-24 -mb-24 pointer-events-none" />
      
      {/* ── CARD CONTENT ── */}
      <div className="relative z-10 p-6 flex-1 flex flex-col">
        
        {/* Floating Header Section */}
        <div className="flex justify-between items-start mb-6">
          <div className="relative">
            <div className="w-14 h-14 rounded-[1.2rem] bg-white/[0.03] border border-white/10 flex items-center justify-center overflow-hidden shadow-2xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-700">
              {startupLogo ? (
                <img src={startupLogo} alt={startupName} className="w-full h-full object-cover" />
              ) : (
                <Building2 className="w-6 h-6 text-[#01F27B]/40" />
              )}
            </div>
            {deal.verificationBadge?.isVerified && (
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#01F27B] rounded-lg flex items-center justify-center border-4 border-[#0c0c0c] shadow-[0_0_10px_rgba(1,242,123,0.4)]">
                <ShieldCheck className="w-3.5 h-3.5 text-black" strokeWidth={3} />
              </div>
            )}
          </div>
          
          <div className="flex flex-col items-end gap-2">
            <BookmarkButton isSaved={isSaved} isLoading={isLoading} onClick={toggleBookmark} className="w-9 h-9 shadow-xl bg-white/5 border-white/10 hover:bg-[#01F27B]/10 transition-colors" />
            {daysLeft !== null && (
              <Badge className="bg-white/5 text-white/40 border-white/10 px-2.5 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {daysLeft > 0 ? `${daysLeft}D LEFT` : 'FINAL'}
              </Badge>
            )}
          </div>
        </div>

        {/* Identity & Mission */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[9px] font-black text-[#01F27B] uppercase tracking-[0.3em]">{category}</span>
            <div className="h-[1px] flex-1 bg-gradient-to-r from-[#01F27B]/20 to-transparent" />
          </div>
          <h3 className="text-2xl font-black text-white italic tracking-tighter uppercase leading-none mb-2.5 group-hover:translate-x-1 transition-transform duration-500">
            {startupName}
          </h3>
          <p className="text-white/40 text-xs font-medium line-clamp-2 leading-relaxed italic">
            {pitch || "Revolutionizing the future through disruptive innovation and scalable technology."}
          </p>
        </div>

        {/* Innovative Stats Dashboard */}
        <div className="mt-auto space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-0.5">
              <p className="text-[8px] font-black text-white/20 uppercase tracking-[0.2em]">Raised Capital</p>
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-black text-white italic tracking-tighter">{formatCurrency(raisedAmount)}</span>
              </div>
            </div>
            <div className="space-y-0.5 text-right">
              <p className="text-[8px] font-black text-white/20 uppercase tracking-[0.2em]">Target Goal</p>
              <p className="text-xs font-black text-white/60 tracking-tight">{formatCurrency(goalAmount)}</p>
            </div>
          </div>

          {/* High-Energy Progress Bar */}
          <div className="relative py-1">
             <div className="flex justify-between items-center mb-1.5">
                <div className="flex items-center gap-1.5">
                   <TrendingUp className="w-2.5 h-2.5 text-[#01F27B]" />
                   <span className="text-[9px] font-black text-white/60 uppercase tracking-widest">Traction</span>
                </div>
                <span className="text-[10px] font-black text-[#01F27B] italic tracking-tighter">{Math.round(progressPercent)}%</span>
             </div>
             <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden border border-white/5 shadow-inner">
                <div 
                  className="h-full bg-gradient-to-r from-[#01F27B] to-[#00d66d] shadow-[0_0_15px_rgba(1,242,123,0.4)] transition-all duration-1000 ease-out relative"
                  style={{ width: `${Math.min(progressPercent, 100)}%` }}
                >
                  <div className="absolute top-0 right-0 h-full w-4 bg-white/30 blur-sm animate-pulse" />
                </div>
             </div>
          </div>

          {/* Action Footer */}
          <div className="pt-1">
            <Button 
              className="w-full h-11 rounded-xl bg-white/[0.03] hover:bg-[#01F27B] border border-white/10 hover:border-[#01F27B] text-white hover:text-black font-black uppercase tracking-[0.15em] text-[10px] transition-all duration-500 group/btn shadow-xl"
              onClick={handleNavigate}
            >
              Examine Pitch Deck
              <ArrowUpRight className="w-3.5 h-3.5 ml-2 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-all duration-500" />
            </Button>
          </div>
        </div>
      </div>
      
      {/* Bottom Glowing Accent */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#01F27B] to-transparent opacity-0 group-hover:opacity-40 transition-opacity" />
    </Card>

  );
}
