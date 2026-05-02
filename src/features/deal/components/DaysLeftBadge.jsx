import { computeDaysLeft } from "../utils/dealAccess";

export default function DaysLeftBadge({ deadline }) {
  const daysLeft = computeDaysLeft(deadline);
  if (daysLeft === null) return null;

  const isClosed = daysLeft <= 0;

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold border ${
        isClosed
          ? "bg-red-500/10 text-red-300 border-red-500/20"
          : "bg-[#01F27B]/10 text-[#01F27B] border-[#01F27B]/20"
      }`}
    >
      {isClosed ? "Closed" : `${daysLeft} days left`}
    </span>
  );
}
