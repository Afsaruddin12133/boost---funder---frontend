import { Card } from "@/shared/ui/card";
import { Lock } from "lucide-react";
import LockOverlay from "./LockOverlay";
import { cn } from "@/shared/ui/utils";

export default function DealSection({ title, content, isLocked, onUpgrade, className }) {
  return (
    <Card className={cn(
      "relative bg-white/[0.03] border-white/5 p-6 md:p-8 rounded-[2rem] transition-all duration-500 overflow-hidden",
      !isLocked && "hover:border-[#01F27B]/30 hover:bg-white/[0.05]",
      className
    )}>
      {isLocked && (
        <div className="absolute top-6 right-6 text-white/20">
          <Lock className="w-4 h-4" />
        </div>
      )}
      
      <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#01F27B] mb-4 opacity-80">
        {title}
      </h3>
      
      <div className={cn(
        "text-white/80 text-sm md:text-base leading-relaxed transition-all duration-700",
        isLocked && "blur-md select-none opacity-40"
      )}>
        {content || "No details provided for this section."}
      </div>

      {isLocked && <LockOverlay onUpgrade={onUpgrade} />}
    </Card>
  );
}
