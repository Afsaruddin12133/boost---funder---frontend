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
      <div className="bg-[#01F27B]/10 border border-[#01F27B]/20 rounded-xl p-4 flex items-start gap-3">
        <Lightbulb className="w-5 h-5 text-[#01F27B] shrink-0 mt-0.5" />
        <p className="text-sm text-[#01F27B] font-medium leading-relaxed">
          A clear story increases investor interest by 3x.
        </p>
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
