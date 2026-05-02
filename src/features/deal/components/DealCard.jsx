import { ImageWithFallback } from "@/shared/components/ImageWithFallback";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Card } from "@/shared/ui/card";
import { 
  Building2, 
  ChevronRight, 
  Edit3, 
  Eye, 
  Trash2, 
  TrendingUp, 
  Target,
  ShieldCheck,
  Calendar
} from "lucide-react";
import {
    PLACEHOLDER_MEDIA,
    formatCurrency,
    getDealMedia,
    getDealName,
    getStatusMeta,
} from "../utils/dealUtils";

export default function DealCard({ deal, onNavigate, onRequestDelete, onEdit, onView, hideActions = false }) {
  const media = getDealMedia(deal);
  const imageSrc = media[0] || PLACEHOLDER_MEDIA;
  const name = getDealName(deal);
  const progressPercent = typeof deal.profileCompletionScore === "number" ? deal.profileCompletionScore : 0;
  const statusMeta = getStatusMeta(deal.status);

  const isVerified = deal?.isVerified || deal?.status === 'verified';
  const canShowActions = !hideActions && (onEdit || onRequestDelete);

  return (
    <div className="h-full transition-all duration-500">
      <Card 
        className={`group relative bg-[#0a0a0a] border border-white/5 hover:border-[#01F27B]/30 transition-all duration-500 overflow-hidden rounded-[2.5rem] flex flex-col cursor-pointer shadow-2xl hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)] ${canShowActions ? '' : 'hover:scale-[1.02]'}`}
        onClick={() => onView?.(deal)}
      >
        {/* Sophisticated Glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-[#01F27B]/5 rounded-full blur-[60px] pointer-events-none group-hover:bg-[#01F27B]/15 transition-all duration-1000" />
        
        <div className="p-6 relative z-10 flex-1 flex flex-col">
          {/* Header Section */}
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white p-2 flex items-center justify-center overflow-hidden shrink-0 shadow-2xl transition-transform duration-700 group-hover:scale-110">
                {imageSrc && imageSrc !== PLACEHOLDER_MEDIA ? (
                  <img src={imageSrc} alt={name} className="w-full h-full object-contain" />
                ) : (
                  <div className="w-full h-full bg-[#111] flex items-center justify-center text-white/5 uppercase font-black text-xl italic">
                    {name.charAt(0)}
                  </div>
                )}
              </div>
              <div>
                <h3 className="text-lg font-black text-white tracking-tighter leading-none mb-1.5 group-hover:text-[#01F27B] transition-colors duration-500">
                  {name}
                </h3>
                <Badge variant="outline" className="bg-white/5 border-white/10 text-[9px] font-bold text-white/40 uppercase tracking-widest px-2 py-0">
                  {deal?.basicInfo?.category || deal.category || "General"}
                </Badge>
              </div>
            </div>
            
            {isVerified && (
              <div className="bg-black/40 backdrop-blur-md border border-[#01F27B]/30 px-3 py-1.5 rounded-2xl flex items-center gap-2 shadow-xl shrink-0">
                <ShieldCheck className="w-3.5 h-3.5 text-[#01F27B]" />
                <span className="hidden sm:inline text-[9px] font-black text-[#01F27B] uppercase tracking-[0.2em]">Verified</span>
              </div>
            )}
          </div>

          {/* Progress Section */}
          <div className="mt-auto space-y-5">
            <div className="flex justify-between items-end px-1">
              <div className="space-y-0.5">
                <span className="block text-[9px] font-black text-white/20 uppercase tracking-widest">Raised</span>
                <span className="text-base font-black text-white">
                  {formatCurrency(deal?.funding?.raisedAmount || deal.raisedAmount || 0)}
                </span>
              </div>
              <div className="text-right space-y-0.5">
                <span className="block text-[9px] font-black text-white/20 uppercase tracking-widest">Goal</span>
                <span className="text-xs font-black text-white/60">
                  {formatCurrency(deal?.funding?.goalAmount || deal.goalAmount || 0)}
                </span>
              </div>
            </div>

            {/* User-Friendly Progress Label */}
            <div className="flex justify-between items-end px-1">
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-black text-white/20 uppercase tracking-widest">Deal Setup</span>
                <span className="w-1 h-1 rounded-full bg-[#01F27B]/30" />
              </div>
              <span className="text-sm font-black text-[#01F27B] tracking-widest">
                {progressPercent}% <span className="text-[9px] text-white/20">Complete</span>
              </span>
            </div>

            {/* Glowing Bar */}
            <div className="relative h-3 bg-white/5 rounded-full overflow-hidden border border-white/5 p-1 shadow-inner">
              <div
                className="h-full bg-gradient-to-r from-[#01F27B] to-[#00d66d] rounded-full transition-all duration-1000 ease-out shadow-[0_0_20px_rgba(1,242,123,0.3)]"
                style={{ width: `${Math.min(progressPercent, 100)}%` }}
              />
            </div>

            <div className="flex justify-between items-center px-1">
              <div className="flex items-center gap-1.5 text-white/30">
                <Calendar className="w-2.5 h-2.5" />
                <span className="text-[9px] font-black uppercase tracking-widest">
                  Ends {deal.deadline ? new Date(deal.deadline).toLocaleDateString() : 'TBD'}
                </span>
              </div>
              {progressPercent < 100 && (
                <p className="text-[8px] font-bold text-white/20 uppercase italic tracking-tight">Finish setup</p>
              )}
            </div>
          </div>
        </div>

        {/* Dynamic Expansion Area (Grows on hover for Desktop, Always shown on Mobile) */}
        {canShowActions && (
          <div className="max-h-40 sm:max-h-0 sm:group-hover:max-h-24 transition-all duration-500 ease-in-out overflow-hidden bg-white/[0.02] border-t border-white/5">
            <div className="p-4 flex items-center justify-around">
              <button
                className="flex flex-col items-center gap-2 text-white/40 hover:text-[#01F27B] transition-all group/btn"
                onClick={(e) => { e.stopPropagation(); onEdit?.(deal); }}
              >
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover/btn:border-[#01F27B]/50 transition-colors">
                  <Edit3 className="w-4 h-4" />
                </div>
                <span className="text-[9px] font-black uppercase tracking-[0.2em]">Edit</span>
              </button>
              
              <button
                className="flex flex-col items-center gap-2 text-[#01F27B] hover:scale-110 transition-all group/btn"
                onClick={(e) => { e.stopPropagation(); onView?.(deal); }}
              >
                <div className="w-12 h-12 rounded-2xl bg-[#01F27B]/10 border border-[#01F27B]/30 flex items-center justify-center shadow-[0_0_20px_rgba(1,242,123,0.2)]">
                  <Eye className="w-5 h-5" />
                </div>
                <span className="text-[9px] font-black uppercase tracking-[0.2em]">Open</span>
              </button>

              <button
                className="flex flex-col items-center gap-2 text-red-500/50 hover:text-red-500 transition-all group/btn"
                onClick={(e) => { e.stopPropagation(); onRequestDelete?.(deal); }}
              >
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover/btn:border-red-500/50 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </div>
                <span className="text-[9px] font-black uppercase tracking-[0.2em]">Delete</span>
              </button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
