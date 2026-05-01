import { ImageWithFallback } from "@/shared/components/ImageWithFallback";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Card } from "@/shared/ui/card";
import {
    PLACEHOLDER_MEDIA,
    formatCurrency,
    getDealMedia,
    getDealName,
    getStatusMeta,
} from "../utils/dealUtils";

export default function DealCard({ deal, onNavigate, onRequestDelete, onEdit, onView }) {
  const media = getDealMedia(deal);
  const imageSrc = media[0] || PLACEHOLDER_MEDIA;
  const name = getDealName(deal);
  // Always use the API's profileCompletionScore — never derive it from raisedAmount/goalAmount
  const progressPercent = typeof deal.profileCompletionScore === "number" ? deal.profileCompletionScore : 0;
  const statusMeta = getStatusMeta(deal.status);

  return (
    <Card className="bg-[#0c0c0c] border-white/10 p-4 space-y-4">
      <div
        className="flex gap-4 cursor-pointer"
        onClick={() => onView ? onView(deal) : onNavigate?.("deal-detail", deal.id ?? deal._id)}
      >
        <div className="w-20 h-20 rounded-lg overflow-hidden bg-black/40 shrink-0">
          <ImageWithFallback
            src={imageSrc}
            alt={name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between gap-2">
            <h4 className="font-semibold text-white truncate max-w-[150px]">{name}</h4>
            <Badge className={`border text-[10px] py-0 h-5 ${statusMeta.className}`}>
              {statusMeta.label}
            </Badge>
          </div>
          <p className="text-xs text-white/50 mt-1">
            {deal?.basicInfo?.category || deal.category || "-"} • {deal?.basicInfo?.stage || deal.stage || "-"}
          </p>
          <div className="flex items-center gap-2 mt-2">
            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#01F27B]"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="text-[10px] text-[#01F27B] font-medium min-w-[28px]">{progressPercent}%</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 text-xs p-3 bg-white/5 rounded-xl border border-white/5">
        <div>
          <p className="text-white/40 mb-1">Raised</p>
          <p className="font-medium text-white">{formatCurrency(deal?.funding?.raisedAmount || deal.raisedAmount || 0)}</p>
        </div>
        <div>
          <p className="text-white/40 mb-1">Goal</p>
          <p className="font-medium text-white">{formatCurrency(deal?.funding?.goalAmount || deal.goalAmount || 0)}</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-white/5">
        <Button
          variant="outline"
          className="border-white/10 text-white/70 hover:text-white hover:bg-white/5 transition-all text-xs h-9 px-2"
          onClick={(event) => {
            event.stopPropagation();
            onEdit ? onEdit(deal) : onNavigate?.("deal-detail", deal.id ?? deal._id);
          }}
        >
          Edit
        </Button>
        <Button
          variant="outline"
          className="border-[#01F27B]/20 text-[#01F27B] hover:bg-[#01F27B]/10 hover:text-[#01F27B] transition-all text-xs h-9 px-2"
          onClick={(event) => {
            event.stopPropagation();
            onView ? onView(deal) : onNavigate?.("deal-detail", deal.id ?? deal._id);
          }}
        >
          View Detail
        </Button>
        <Button
          variant="outline"
          className="border-red-500/20 text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all text-xs h-9 px-2"
          onClick={(event) => {
            event.stopPropagation();
            onRequestDelete?.(deal);
          }}
        >
          Delete
        </Button>
      </div>
    </Card>
  );
}
