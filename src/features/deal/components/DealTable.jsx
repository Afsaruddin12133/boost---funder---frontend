import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import {
    calculateProgress,
    formatCurrency,
    formatDate,
    getDealName,
    getStatusMeta,
} from "../utils/dealUtils";

export default function DealTable({ deals, onNavigate, onRequestDelete, onEdit }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-white/5 text-xs text-white/40">
            <th className="font-medium p-6 pb-4">DEAL NAME</th>
            <th className="font-medium p-6 pb-4">FUNDING GOAL</th>
            <th className="font-medium p-6 pb-4">PROGRESS</th>
            <th className="font-medium p-6 pb-4">DEADLINE</th>
            <th className="font-medium p-6 pb-4">COMPLETION</th>
            <th className="font-medium p-6 pb-4 text-right">STATUS</th>
            <th className="font-medium p-6 pb-4 text-right">ACTIONS</th>
          </tr>
        </thead>
        <tbody className="text-sm">
          {deals.map((deal) => {
            const progress = calculateProgress(
              deal.raisedAmount,
              deal.goalAmount,
            );
            const progressPercent = Math.round(progress * 100);
            const statusMeta = getStatusMeta(deal.status);

            return (
              <tr
                key={deal.id ?? deal._id}
                className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors"
              >
                <td
                  className="p-6 cursor-pointer"
                  onClick={() =>
                    onNavigate?.("deal-detail", deal.id ?? deal._id)
                  }
                >
                  <div className="font-semibold text-white mb-1">
                    {getDealName(deal)}
                  </div>
                  <div className="text-xs text-white/40">
                    {deal.category || "-"} • {deal.stage || "-"}
                  </div>
                </td>
                <td className="p-6 font-medium">
                  {formatCurrency(deal.goalAmount)}
                </td>
                <td className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="w-24 h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#01F27B]"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                    <span className="text-xs text-white/60">
                      {formatCurrency(deal.raisedAmount)}
                    </span>
                  </div>
                </td>
                <td className="p-6 text-white/70">
                  {formatDate(deal.deadline)}
                </td>
                <td className="p-6">
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500"
                        style={{ width: `${deal.profileCompletionScore || 0}%` }}
                      />
                    </div>
                    <span className="text-xs text-white/60">
                      {deal.profileCompletionScore || 0}%
                    </span>
                  </div>
                </td>
                <td className="p-6 text-right">
                  <Badge className={`border ${statusMeta.className}`}>
                    {statusMeta.label}
                  </Badge>
                </td>
                <td className="p-6 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="outline"
                      className="border-white/10 text-white/70 hover:text-white"
                      onClick={() => onEdit ? onEdit(deal) : onNavigate?.("deal-detail", deal.id ?? deal._id)}
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
                      onClick={() => onRequestDelete?.(deal)}
                    >
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
