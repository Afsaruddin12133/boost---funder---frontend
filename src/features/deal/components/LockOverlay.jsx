import { Button } from "@/shared/ui/button";
import { Lock } from "lucide-react";

export default function LockOverlay({
  title = "Upgrade to unlock this section",
  subtitle = "Available in Pro and Elite plans",
  onUpgrade,
}) {
  return (
    <div className="absolute inset-0 rounded-xl bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center text-center px-6">
      <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mb-3">
        <Lock className="w-5 h-5 text-[#01F27B]" />
      </div>
      <p className="text-sm font-semibold text-white">{title}</p>
      <p className="text-xs text-white/60 mt-1">{subtitle}</p>
      <Button
        type="button"
        onClick={onUpgrade}
        className="mt-4 bg-[#01F27B] hover:bg-[#01F27B]/90 text-black font-semibold"
      >
        Upgrade Plan
      </Button>
    </div>
  );
}
