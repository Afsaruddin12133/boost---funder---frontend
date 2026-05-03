import { ImageWithFallback } from "@/shared/components/ImageWithFallback";
import { Badge, Button, Loader } from "@/shared/ui";
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

export default function DealCard({ 
  deal, 
  onNavigate, 
  onRequestDelete, 
  onEdit, 
  onView, 
  onSubmitForReview, 
  hideActions = false,
  isSubmitting = false
}) {
  const media = getDealMedia(deal);
  const imageSrc = media[0] || PLACEHOLDER_MEDIA;
  const name = getDealName(deal);
  const progressPercent = typeof deal.profileCompletionScore === "number" ? deal.profileCompletionScore : 0;
  const statusMeta = getStatusMeta(deal.status);
  const isDraft = progressPercent < 100 && deal.status === 'draft';
  const isPending = deal?.status === 'pendingReview';
  const isVerified = deal?.isVerified || deal?.status === 'verified';
  const isComplete = deal?.status === 'complete';
  const isApproved = deal?.status === 'approved' || deal?.status === 'published' || deal?.status === 'active';
  const canShowActions = !hideActions && (onEdit || onRequestDelete || isComplete);

  return (
    <div className="h-full transition-all duration-500">
      <Card 
        className={`group relative bg-[#0a0a0a] border transition-all duration-500 overflow-hidden rounded-[2.5rem] flex flex-col cursor-pointer shadow-2xl hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)] ${isDraft ? 'border-amber-500/20 hover:border-amber-500/40' : isPending ? 'border-blue-500/20 hover:border-blue-500/40' : 'border-white/5 hover:border-[#01F27B]/30'} ${canShowActions ? '' : 'hover:scale-[1.02]'}`}
        onClick={() => onView?.(deal)}
      >
        {/* Sophisticated Glow */}
        <div className={`absolute top-0 right-0 w-48 h-48 rounded-full blur-[60px] pointer-events-none transition-all duration-1000 ${isDraft ? 'bg-amber-500/10 group-hover:bg-amber-500/20' : isPending ? 'bg-blue-500/10 group-hover:bg-blue-500/20' : 'bg-[#01F27B]/5 group-hover:bg-[#01F27B]/15'}`} />
        
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
                <h3 className={`text-lg font-black tracking-tighter leading-none mb-1.5 transition-colors duration-500 ${isDraft ? 'text-amber-500' : isPending ? 'text-blue-400' : 'text-white group-hover:text-[#01F27B]'}`}>
                  {name}
                </h3>
                <Badge variant="outline" className="bg-white/5 border-white/10 text-[9px] font-bold text-white/40 uppercase tracking-widest px-2 py-0">
                  {deal?.basicInfo?.category || deal.category || "General"}
                </Badge>
              </div>
            </div>
            
            <div className="flex flex-col items-end gap-1.5">
              {isVerified && (
                <div className="bg-[#01F27B]/10 backdrop-blur-md border border-[#01F27B]/30 px-2.5 py-1 rounded-xl flex items-center gap-1.5 shadow-xl shrink-0">
                  <ShieldCheck className="w-3 h-3 text-[#01F27B]" />
                  <span className="text-[8px] font-black text-[#01F27B] uppercase tracking-widest">Verified</span>
                </div>
              )}
              {isPending && (
                <div className="bg-blue-500/10 backdrop-blur-md border border-blue-500/30 px-2.5 py-1 rounded-xl flex items-center gap-1.5 shadow-xl shrink-0 animate-pulse">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  <span className="text-[8px] font-black text-blue-400 uppercase tracking-widest">In Review</span>
                </div>
              )}
              <div className={`backdrop-blur-md border px-2.5 py-1 rounded-xl shadow-xl shrink-0 ${statusMeta.className}`}>
                <span className="text-[8px] font-black uppercase tracking-widest">{statusMeta.label}</span>
              </div>
            </div>
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
                <span className={`text-[9px] font-black uppercase tracking-widest ${isDraft ? 'text-amber-500/60' : isPending ? 'text-blue-500/60' : 'text-white/20'}`}>Deal Setup</span>
                <span className={`w-1 h-1 rounded-full ${isDraft ? 'bg-amber-500/30' : isPending ? 'bg-blue-500/30' : 'bg-[#01F27B]/30'}`} />
              </div>
              <span className={`text-sm font-black tracking-widest ${isDraft ? 'text-amber-500' : isPending ? 'text-blue-400' : 'text-[#01F27B]'}`}>
                {progressPercent}% <span className="text-[9px] text-white/20">Complete</span>
              </span>
            </div>

            {/* Glowing Bar */}
            <div className="relative h-3 bg-white/5 rounded-full overflow-hidden border border-white/5 p-1 shadow-inner">
              <div
                className={`h-full rounded-full transition-all duration-1000 ease-out shadow-lg ${isDraft ? 'bg-gradient-to-r from-amber-600 to-amber-400 shadow-amber-500/20' : isPending ? 'bg-gradient-to-r from-blue-600 to-blue-400 shadow-blue-500/20' : 'bg-gradient-to-r from-[#01F27B] to-[#00d66d] shadow-[#01F27B]/20'}`}
                style={{ width: `${Math.max(progressPercent, 5)}%` }}
              />
            </div>

            <div className="flex justify-between items-center px-1">
              <div className="flex items-center gap-1.5 text-white/30">
                <Calendar className="w-2.5 h-2.5" />
                <span className="text-[9px] font-black uppercase tracking-widest">
                  Ends {deal.deadline ? new Date(deal.deadline).toLocaleDateString() : 'TBD'}
                </span>
              </div>
              {isDraft && (
                <p className="text-[7px] sm:text-[9px] font-semibold text-amber-500 uppercase italic tracking-wider animate-bounce">Finish your setup</p>
              )}
              {isPending && (
                <p className="text-[8px] font-bold text-blue-400 uppercase tracking-tighter animate-pulse">Waiting for Admin Approval</p>
              )}
              {isComplete && (
                <p className="text-[8px] font-bold text-[#01F27B] uppercase tracking-tighter animate-pulse">Ready for Review</p>
              )}
              {isApproved && (
                <p className="text-[8px] font-bold text-[#01F27B] uppercase tracking-tighter italic">Live on Feed</p>
              )}
            </div>
          </div>
        </div>

        {/* Dynamic Expansion Area (Grows on hover for Desktop, Always shown on Mobile) */}
        {canShowActions && (
          <div className={`max-h-48 sm:max-h-0 sm:group-hover:max-h-28 transition-all duration-500 ease-in-out overflow-hidden bg-white/[0.02] border-t ${isDraft ? 'border-amber-500/10' : isPending ? 'border-blue-500/10' : 'border-white/5'}`}>
            <div className="p-4 flex items-center justify-around gap-2">
              <button
                disabled={isApproved}
                className={`flex flex-col items-center gap-2 transition-all group/btn ${isApproved ? 'opacity-20 cursor-not-allowed grayscale' : isDraft ? 'text-white/40 hover:text-amber-500' : isPending ? 'text-white/40 hover:text-blue-400' : 'text-white/40 hover:text-[#01F27B]'}`}
                onClick={(e) => { e.stopPropagation(); !isApproved && onEdit?.(deal); }}
              >
                <div className={`w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center transition-colors ${isDraft ? 'group-hover/btn:border-amber-500/50' : isPending ? 'group-hover/btn:border-blue-500/50' : 'group-hover/btn:border-[#01F27B]/50'}`}>
                  <Edit3 className="w-3.5 h-3.5" />
                </div>
                <span className="text-[8px] font-black uppercase tracking-widest">Edit</span>
              </button>
              
              <button
                className={`flex flex-col items-center gap-2 hover:scale-110 transition-all group/btn ${isDraft ? 'text-amber-500' : isPending ? 'text-blue-400' : 'text-[#01F27B]'}`}
                onClick={(e) => { e.stopPropagation(); onView?.(deal); }}
              >
                <div className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-all ${isDraft ? 'bg-amber-500/10 border-amber-500/30 group-hover/btn:shadow-[0_0_20px_rgba(245,158,11,0.2)]' : isPending ? 'bg-blue-500/10 border-blue-500/30 group-hover/btn:shadow-[0_0_20px_rgba(59,130,246,0.2)]' : 'bg-[#01F27B]/10 border-[#01F27B]/30 group-hover/btn:shadow-[0_0_20px_rgba(1,242,123,0.2)]'}`}>
                  <Eye className="w-4 h-4" />
                </div>
                <span className="text-[8px] font-black uppercase tracking-widest">Open</span>
              </button>

              {isComplete && (
                <button
                  className="flex flex-col items-center gap-2 text-[#01F27B] hover:scale-105 transition-all group/btn"
                  onClick={(e) => { e.stopPropagation(); onSubmitForReview?.(deal); }}
                >
                  <div className="w-11 h-11 rounded-2xl bg-[#01F27B] flex items-center justify-center shadow-[0_0_20px_rgba(1,242,123,0.4)] transition-all group-hover/btn:shadow-[0_0_30px_rgba(1,242,123,0.6)]">
                    {isSubmitting ? (
                      <Loader size="sm" className="text-black" />
                    ) : (
                      <ShieldCheck className="w-5 h-5 text-black" />
                    )}
                  </div>
                  <span className="text-[9px] font-black uppercase tracking-tighter text-[#01F27B]">
                    {isSubmitting ? "Submitting..." : "Admin Review"}
                  </span>
                </button>
              )}

              <button
                className="flex flex-col items-center gap-2 text-red-500/50 hover:text-red-500 transition-all group/btn"
                onClick={(e) => { e.stopPropagation(); onRequestDelete?.(deal); }}
              >
                <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover/btn:border-red-500/50 transition-colors">
                  <Trash2 className="w-3.5 h-3.5" />
                </div>
                <span className="text-[8px] font-black uppercase tracking-widest">Delete</span>
              </button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
