import { Card } from "@/shared/ui/card";
import { Lock } from "lucide-react";
import LockOverlay from "./LockOverlay";

export default function DealSection({ title, content, isLocked, onUpgrade }) {
  return (
    <Card className="relative bg-[#0c0c0c] border-white/10 p-5 transition-all hover:border-[#01F27B]/30">
      {isLocked && (
        <div
          className="absolute top-4 right-4 text-white/40"
          title="Available in Pro / Elite plan"
        >
          <Lock className="w-4 h-4" />
        </div>
      )}
      <h3 className="text-sm font-semibold text-[#01F27B] mb-2">{title}</h3>
      <div className={`text-white/75 text-sm leading-relaxed ${isLocked ? "blur-sm select-none" : ""}`}>
        {content}
      </div>

      {isLocked && <LockOverlay onUpgrade={onUpgrade} />}
    </Card>
  );
}
