import React from 'react';
import { CheckCircle } from 'lucide-react';

export default function StepIndicator({ steps, currentStep }) {
  return (
    <div className="flex items-center justify-between gap-1 bg-white/5 border border-white/10 rounded-2xl p-2 px-3 md:px-6 overflow-hidden">
      {steps.map((s, i) => {
        const active = currentStep === s.id;
        const done = currentStep > s.id;
        
        return (
          <React.Fragment key={s.id}>
            <div className={`flex items-center gap-2 py-2 px-3 rounded-xl transition-all ${active ? "bg-[#01F27B]/10 border border-[#01F27B]/20" : ""}`}>
              <div className={`w-8 h-8 md:w-9 md:h-9 shrink-0 rounded-lg flex items-center justify-center transition-all ${
                done ? "bg-[#01F27B] text-black shadow-[0_0_15px_rgba(1,242,123,0.3)]" :
                active ? "bg-[#01F27B]/20 text-[#01F27B]" :
                "bg-white/5 text-white/20"
              }`}>
                {done ? <CheckCircle className="w-4 h-4 md:w-5 md:h-5" /> : <span className="font-black text-[10px] md:text-xs">{s.id}</span>}
              </div>
              
              {/* Show label only if active OR on desktop */}
              <span className={`text-[10px] md:text-[11px] font-black uppercase tracking-[0.15em] whitespace-nowrap 
                ${active ? "block text-[#01F27B]" : "hidden md:block text-white/20"}
                ${done ? "md:text-white/70" : ""}
              `}>
                {s.label}
              </span>
            </div>
            
            {/* Divider Line (Desktop only) */}
            {i < steps.length - 1 && (
              <div className="hidden md:block flex-1 h-[1px] bg-white/5 mx-2" />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
