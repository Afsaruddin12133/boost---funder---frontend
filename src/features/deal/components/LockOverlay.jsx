import { Button } from "@/shared/ui/button";
import { Lock } from "lucide-react";

export default function LockOverlay({
  title = "Unlock Detailed Intelligence",
  subtitle = "Exclusive to Pro and Elite partners",
  onUpgrade,
}) {
  return (
    <div className="absolute inset-0 z-20 bg-black/40 backdrop-blur-md flex flex-col items-center justify-center text-center p-8 group-hover:backdrop-blur-sm transition-all duration-700">
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-[#01F27B] blur-2xl opacity-20" />
        <div className="relative w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
          <Lock className="w-6 h-6 text-[#01F27B]" />
        </div>
      </div>
      
      <p className="text-base font-black text-white tracking-tight mb-2">{title}</p>
      <p className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] mb-8">{subtitle}</p>
      
      <Button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onUpgrade?.();
        }}
        className="bg-[#01F27B] hover:bg-[#00d66d] text-black font-black px-8 h-12 rounded-xl shadow-[0_0_20px_rgba(1,242,123,0.3)] transition-all"
      >
        Upgrade Access
      </Button>
    </div>
  );
}
