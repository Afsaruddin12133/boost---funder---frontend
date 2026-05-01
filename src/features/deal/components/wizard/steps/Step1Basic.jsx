import React from 'react';
import Field from '../ui/Field';
import FileUploader from '../ui/FileUploader';
import { Input } from "@/shared/ui/input";
import { Rocket, Tag, Globe, MapPin, Layers, Briefcase } from 'lucide-react';

const CATEGORIES = ["tech", "health", "finance", "education", "cleantech", "ecommerce", "saas", "other"];
const STAGES = ["idea", "MVP", "growth", "scale"];

export default function Step1Basic({ data, onChange, errors }) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-[#01F27B]/10 border border-[#01F27B]/20 rounded-xl p-4 flex items-start gap-3">
        <Rocket className="w-5 h-5 text-[#01F27B] shrink-0 mt-0.5" />
        <p className="text-sm text-[#01F27B] font-medium leading-relaxed">
          Start strong — investors first notice your basics.
        </p>
      </div>

      <div className="space-y-5">
        <Field label="Startup Name" icon={Rocket} error={errors.startupName} required>
          <Input
            placeholder="e.g. EcoPulse Solutions"
            value={data.startupName || ""}
            onChange={(e) => onChange("startupName", e.target.value)}
            className="bg-white/5 border-white/10 text-white focus:border-[#01F27B]/50 h-11 rounded-xl"
          />
        </Field>

        <Field label="Startup Logo" icon={Briefcase} error={errors.startupLogo} required>
          <FileUploader 
            files={data.startupLogo ? [data.startupLogo] : []}
            onChange={(files) => onChange("startupLogo", files[0] || null)}
            accept="image/*"
            label="Upload your logo"
            maxFiles={1}
          />
        </Field>

        <Field label="Startup Website" icon={Globe} error={errors.startupWebsite} required>
          <Input
            placeholder="https://yourstartup.com"
            value={data.startupWebsite || ""}
            onChange={(e) => onChange("startupWebsite", e.target.value)}
            className="bg-white/5 border-white/10 text-white focus:border-[#01F27B]/50 h-11 rounded-xl"
          />
        </Field>

        <Field label="Tagline" icon={Tag} error={errors.tagline}>
          <Input
            placeholder="A catchy one-liner for your brand"
            value={data.tagline || ""}
            onChange={(e) => onChange("tagline", e.target.value)}
            className="bg-white/5 border-white/10 text-white focus:border-[#01F27B]/50 h-11 rounded-xl"
          />
        </Field>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Field label="Category" icon={Layers} error={errors.category} required>
            <select
              value={data.category || ""}
              onChange={(e) => onChange("category", e.target.value)}
              className="w-full h-11 rounded-xl bg-white/5 border border-white/10 text-white px-3 text-sm focus:outline-none focus:border-[#01F27B]/50 appearance-none cursor-pointer"
            >
              <option value="" disabled className="bg-[#0c0c0c]">Select category</option>
              {CATEGORIES.map(c => (
                <option key={c} value={c} className="bg-[#0c0c0c]">
                  {c.charAt(0).toUpperCase() + c.slice(1)}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Stage" icon={Briefcase} error={errors.stage} required>
            <select
              value={data.stage || ""}
              onChange={(e) => onChange("stage", e.target.value)}
              className="w-full h-11 rounded-xl bg-white/5 border border-white/10 text-white px-3 text-sm focus:outline-none focus:border-[#01F27B]/50 appearance-none cursor-pointer"
            >
              <option value="" disabled className="bg-[#0c0c0c]">Select stage</option>
              {STAGES.map(s => (
                <option key={s} value={s} className="bg-[#0c0c0c]">
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <Field label="Location" icon={MapPin} error={errors.location} required>
          <Input
            placeholder="e.g. San Francisco, CA"
            value={data.location || ""}
            onChange={(e) => onChange("location", e.target.value)}
            className="bg-white/5 border-white/10 text-white focus:border-[#01F27B]/50 h-11 rounded-xl"
          />
        </Field>
      </div>
    </div>
  );
}
