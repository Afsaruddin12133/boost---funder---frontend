import React from 'react';
import { CheckCircle } from 'lucide-react';

export default function StepIndicator({ steps, currentStep }) {
  return (
    <div className="flex items-center gap-0 mb-8">
      {steps.map((s, i) => {
        const active = currentStep === s.id;
        const done = currentStep > s.id;
        return (
          <div key={s.id} className="flex items-center flex-1">
            <div className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                done ? "bg-[#01F27B] text-black shadow-[0_0_15px_rgba(1,242,123,0.3)]" :
                active ? "bg-[#01F27B]/20 border-2 border-[#01F27B] text-[#01F27B]" :
                "bg-white/5 border border-white/10 text-white/30"
              }`}>
                {done ? <CheckCircle className="w-5 h-5" /> : <span className="font-semibold">{s.id}</span>}
              </div>
              <span className={`mt-2 text-xs font-medium text-center whitespace-nowrap ${active ? "text-[#01F27B]" : done ? "text-white/70" : "text-white/30"}`}>
                {s.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className={`flex-1 h-0.5 mx-3 mt-[-20px] rounded-full transition-colors ${done ? "bg-[#01F27B]" : "bg-white/10"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}
