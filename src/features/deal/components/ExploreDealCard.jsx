import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Card } from "@/shared/ui/card";
import { ArrowRight, Building2, Clock, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router";
import { calculateDaysLeft, calculateProgress, formatCurrency } from "../utils/dealUtils";
import BookmarkButton from "./BookmarkButton";
import { useBookmark } from "../hooks/useBookmark";

export default function ExploreDealCard({ deal }) {
  const navigate = useNavigate();
  
  const handleNavigate = (e) => {
    if (e) {
      e.stopPropagation();
    }
    navigate(`/dashboard/investor/deals/${deal._id || deal.id}`);
  };

  const progressPercent = calculateProgress(deal.raisedAmount || 0, deal.goalAmount || 0) * 100;
  const daysLeft = calculateDaysLeft(deal.deadline);
  const { isSaved, isLoading, toggleBookmark } = useBookmark(deal._id || deal.id, deal.isSaved || false);
  
  return (
    <Card 
      className="bg-[#0c0c0c] border-white/5 hover:border-[#01F27B]/30 hover:shadow-[0_8px_30px_rgba(1,242,123,0.1)] transition-all duration-300 flex flex-col h-full group cursor-pointer overflow-hidden relative" 
      onClick={handleNavigate}
    >
      <div className="p-6 flex-1 flex flex-col">
        {/* Header: Logo, Verified Badge & Days Left */}
        <div className="flex justify-between items-start mb-5">
          <div className="w-14 h-14 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden shrink-0 group-hover:scale-105 transition-transform duration-500">
            {deal.startupLogo ? (
              <img src={deal.startupLogo} alt={deal.startupName} className="w-full h-full object-cover" />
            ) : (
              <Building2 className="w-6 h-6 text-white/40" />
            )}
          </div>
          
          <div className="flex flex-col items-end gap-2">
             <div className="flex items-center gap-2">
               {deal.verificationBadge?.isVerified && (
                 <Badge className="bg-[#01F27B]/10 text-[#01F27B] border-[#01F27B]/20 flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider py-1">
                   <ShieldCheck className="w-3 h-3" />
                   Verified
                 </Badge>
               )}
               <BookmarkButton isSaved={isSaved} isLoading={isLoading} onClick={toggleBookmark} />
             </div>
             {daysLeft !== null && (
               <div className="flex items-center gap-1 text-xs text-white/50 font-medium bg-white/5 px-2 py-1 rounded-md border border-white/5">
                 <Clock className="w-3 h-3" />
                 <span>{daysLeft > 0 ? `${daysLeft} days left` : 'Ending today'}</span>
               </div>
             )}
          </div>
        </div>

        {/* Title & Category */}
        <div className="mb-6">
          <h3 className="text-xl font-bold text-white mb-1 group-hover:text-[#01F27B] transition-colors line-clamp-1">
            {deal.startupName || "Untitled Startup"}
          </h3>
          <p className="text-sm text-white/50 line-clamp-1">
            {deal.category || "Uncategorized"}
          </p>
        </div>

        {/* Funding Stats */}
        <div className="mt-auto">
          <div className="flex justify-between items-end mb-3">
            <div>
              <p className="text-xs text-white/50 font-medium mb-1">Raised</p>
              <p className="text-lg font-bold text-white leading-none">
                {formatCurrency(deal.raisedAmount || 0)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-white/50 font-medium mb-1">Goal</p>
              <p className="text-sm font-semibold text-white/80 leading-none">
                {formatCurrency(deal.goalAmount || 0)}
              </p>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-white/5 rounded-full h-1.5 mb-2 overflow-hidden">
            <div 
              className="bg-[#01F27B] h-full rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${Math.min(progressPercent, 100)}%` }}
            />
          </div>
          <div className="flex justify-end mb-6">
            <span className="text-xs font-bold text-[#01F27B]">
              {Math.round(progressPercent)}%
            </span>
          </div>
          
          <Button 
            className="w-full bg-white/5 hover:bg-[#01F27B] text-white hover:text-black border border-white/10 hover:border-[#01F27B] transition-all duration-300 font-medium group/btn"
            onClick={handleNavigate}
          >
            View Details
            <ArrowRight className="w-4 h-4 ml-2 opacity-50 group-hover/btn:opacity-100 group-hover/btn:translate-x-1 transition-all" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
