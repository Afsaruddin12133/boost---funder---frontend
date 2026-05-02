import React from 'react';
import Field from '../ui/Field';
import { Lightbulb, FileText, Target, Crosshair, Clock } from 'lucide-react';

export default function Step2Story({ data, onChange, errors }) {
  const textareas = [
    { key: "problem", label: "The Problem", icon: Target, placeholder: "What major problem are you solving? Explain the pain point clearly.", required: true },
    { key: "solution", label: "The Solution", icon: Lightbulb, placeholder: "How does your product solve this problem better than anyone else?", required: true },
    { key: "vision", label: "Long-term Vision", icon: Crosshair, placeholder: "Where do you see the company in 5 years?", required: false },
    { key: "targetMarket", label: "Target Market", icon: Target, placeholder: "Who exactly is your customer? How big is the market?", type: "input", required: true },
    { key: "whyNow", label: "Why Now?", icon: Clock, placeholder: "Why is this the perfect time for your solution?", required: true },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Premium Motivational Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-[#01F27B]/5 border border-[#01F27B]/10 p-5 group mb-8">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <Lightbulb className="w-12 h-12 text-[#01F27B]" />
        </div>
        <div className="relative z-10 flex items-start gap-4">
          <div className="mt-1 flex-none w-1 h-10 bg-gradient-to-b from-[#01F27B] to-transparent rounded-full" />
          <div>
            <h4 className="text-sm font-black text-[#01F27B] uppercase tracking-tighter mb-1">Founder's Narrative</h4>
            <p className="text-sm text-white/70 italic leading-relaxed">
              "Data tells, but stories sell. Your vision is the bridge between a good idea and a great investment."
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-5">
        {textareas.map(({ key, label, icon, placeholder, type, required }) => (
          <Field key={key} label={label} icon={icon} error={errors[key]} required={required}>
            {type === "input" ? (
              <input
                placeholder={placeholder}
                value={data[key] || ""}
                onChange={(e) => onChange(key, e.target.value)}
                className="w-full bg-white/5 border border-white/10 text-white focus:border-[#01F27B]/50 h-11 rounded-xl px-3 text-sm focus:outline-none"
              />
            ) : (
              <textarea
                rows={4}
                placeholder={placeholder}
                value={data[key] || ""}
                onChange={(e) => onChange(key, e.target.value)}
                className="w-full rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-[#01F27B]/50 px-3 py-3 text-sm resize-none"
              />
            )}
          </Field>
        ))}
      </div>
    </div>
  );
}
