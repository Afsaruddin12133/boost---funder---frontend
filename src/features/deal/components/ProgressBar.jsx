import { computeProgress } from "../utils/dealAccess";
import { formatCurrency } from "../utils/dealUtils";

export default function ProgressBar({ raised = 0, goal = 0 }) {
  const percent = computeProgress(raised, goal);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs text-white/60">
        <span>{formatCurrency(raised)} raised</span>
        <span>{percent}%</span>
      </div>
      <div className="w-full h-2.5 bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-[#01F27B] to-[#01F27B]/70 rounded-full transition-all duration-700"
          style={{ width: `${percent}%` }}
        />
      </div>
      <p className="text-xs text-white/40">Target {formatCurrency(goal)}</p>
    </div>
  );
}
