import { ImageWithFallback } from "@/shared/components/ImageWithFallback";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Card } from "@/shared/ui/card";
import {
    PLACEHOLDER_MEDIA,
    calculateProgress,
    formatCurrency,
    formatDate,
    getDealMedia,
    getDealName,
    getStatusMeta,
} from "../utils/dealUtils";

export default function DealCard({ deal, onNavigate, onRequestDelete, onEdit }) {
  const media = getDealMedia(deal);
  const imageSrc = media[0] || PLACEHOLDER_MEDIA;
  const name = getDealName(deal);
  const progress = calculateProgress(deal.raisedAmount, deal.goalAmount);
  const progressPercent = Math.round(progress * 100);
  const statusMeta = getStatusMeta(deal.status);

  return (
    <Card className="bg-[#0c0c0c] border-white/10 p-4 space-y-4">
      <div
        className="flex gap-4 cursor-pointer"
        onClick={() => onNavigate?.("deal-detail", deal.id ?? deal._id)}
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
            <h4 className="font-semibold text-white">{name}</h4>
            <Badge className={`border ${statusMeta.className}`}>
              {statusMeta.label}
            </Badge>
          </div>
          <p className="text-xs text-white/50 mt-1">
            {deal.category || "-"} • {deal.stage || "-"}
          </p>
          <p className="text-xs text-white/40 mt-1 flex justify-between">
            <span>Deadline: {formatDate(deal.deadline)}</span>
            <span className="text-blue-400">Profile: {deal.profileCompletionScore || 0}%</span>
          </p>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between text-xs text-white/60 mb-2">
          <span>{formatCurrency(deal.raisedAmount)} raised</span>
          <span>{formatCurrency(deal.goalAmount)} goal</span>
        </div>
        <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#01F27B]"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <div className="text-xs text-white/50 mt-1">{progressPercent}%</div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          className="border-white/10 text-white/70 hover:text-white"
          onClick={(event) => {
            event.stopPropagation();
            onEdit ? onEdit(deal) : onNavigate?.("deal-detail", deal.id ?? deal._id);
          }}
        >
          Edit
        </Button>
        <Button
          variant="outline"
          className="border-white/10 text-white/70 hover:text-white"
        >
          Submit
        </Button>
        <Button
          variant="outline"
          className="border-red-500/30 text-red-300 hover:text-red-200"
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
