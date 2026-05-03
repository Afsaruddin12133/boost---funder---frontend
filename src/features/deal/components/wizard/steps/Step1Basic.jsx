import { Input } from "@/shared/ui/input";
import { Briefcase, Globe, Layers, MapPin, Phone, Rocket, Tag } from 'lucide-react';
import { cn } from "@/shared/ui/utils";
import Field from '../ui/Field';
import FileUploader from '../ui/FileUploader';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";

const CATEGORIES = [
  { id: "tech", label: "Technology" },
  { id: "health", label: "Healthcare" },
  { id: "finance", label: "Fintech" },
  { id: "education", label: "EdTech" },
  { id: "cleantech", label: "Sustainability" },
  { id: "ecommerce", label: "E-Commerce" },
  { id: "saas", label: "SaaS" },
  { id: "other", label: "Other" }
];

const STAGES = [
  { id: "idea", label: "Idea / Pre-seed" },
  { id: "MVP", label: "MVP / Seed" },
  { id: "growth", label: "Early Growth (Series A+)" },
  { id: "scale", label: "Scaling (Series B+)" }
];

export default function Step1Basic({ data, onChange, errors }) {
  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Motivational Quote */}
      <div className="relative overflow-hidden rounded-2xl bg-[#01F27B]/5 border border-[#01F27B]/10 p-5 group">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <Rocket className="w-12 h-12 text-[#01F27B]" />
        </div>
        <div className="relative z-10 flex items-start gap-4">
          <div className="mt-1 flex-none w-1 h-10 bg-gradient-to-b from-[#01F27B] to-transparent rounded-full" />
          <div>
            <h4 className="text-sm font-black text-[#01F27B] uppercase tracking-tighter mb-1">Founder's Mission</h4>
            <p className="text-sm text-white/70 italic leading-relaxed">
              "Your brand is the handshake that starts every investor meeting. Let's make it legendary."
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
        {/* Startup Logo Area with Frame */}
        <div className="lg:col-span-1">
          <Field label="Startup Logo" icon={Briefcase} error={errors.startupLogo} required>
            <div className="mt-2 p-3 rounded-xl bg-white/5 border border-white/10 hover:border-[#01F27B]/30 transition-all flex items-center justify-start h-[90px]">
              <FileUploader 
                files={data.startupLogo ? [data.startupLogo] : []}
                onChange={(files) => onChange("startupLogo", files[0] || null)}
                accept="image/*"
                variant="compact"
                maxFiles={1}
              />
            </div>
          </Field>
        </div>

        {/* Startup Name Area */}
        <div className="lg:col-span-1 flex flex-col justify-end">
          <Field label="Startup Name" icon={Rocket} error={errors.startupName} required>
            <Input
              placeholder="What is your startup called?"
              value={data.startupName || ""}
              onChange={(e) => onChange("startupName", e.target.value)}
              className="bg-white/5 border-white/10 text-white focus:border-[#01F27B]/50 h-11 lg:h-12 rounded-xl transition-all"
            />
          </Field>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Field label="Startup Website" icon={Globe} error={errors.startupWebsite} required>
          <Input
            placeholder="https://yourstartup.com"
            value={data.startupWebsite || ""}
            onChange={(e) => onChange("startupWebsite", e.target.value)}
            className="bg-white/5 border-white/10 text-white focus:border-[#01F27B]/50 h-11 lg:h-12 rounded-xl transition-all"
          />
        </Field>

        <Field label="Founder WhatsApp Number" icon={Phone} error={errors.whatsappNumber} required>
          <Input
            placeholder="+971 5X XXX XXXX (Country Code Required)"
            value={data.whatsappNumber || ""}
            onChange={(e) => onChange("whatsappNumber", e.target.value)}
            className="bg-white/5 border-white/10 text-white focus:border-[#01F27B]/50 h-11 lg:h-12 rounded-xl transition-all"
          />
        </Field>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Field label="Location" icon={MapPin} error={errors.location} required>
          <Input
            placeholder="e.g. Abu Dhabi, UAE"
            value={data.location || ""}
            onChange={(e) => onChange("location", e.target.value)}
            className="bg-white/5 border-white/10 text-white focus:border-[#01F27B]/50 h-11 lg:h-12 rounded-xl transition-all"
          />
        </Field>

        <Field 
          label="Tagline" 
          icon={Tag} 
          error={errors.tagline}
          description={
            <div className="flex justify-between items-center mt-1">
              <span className="text-[10px] text-white/30 uppercase tracking-widest">A powerful one-sentence pitch</span>
              <span className={cn(
                "text-[10px] font-bold tracking-widest",
                (data.tagline?.length > 60) ? "text-red-500" : "text-white/30"
              )}>
                {data.tagline?.length || 0}/60
              </span>
            </div>
          }
        >
          <div className="space-y-2">
            <Input
              placeholder="Describe your mission in one powerful sentence"
              value={data.tagline || ""}
              onChange={(e) => onChange("tagline", e.target.value)}
              className={cn(
                "bg-white/5 border-white/10 text-white focus:border-[#01F27B]/50 h-11 lg:h-12 rounded-xl transition-all",
                (data.tagline?.length > 60) && "border-red-500/50 focus:border-red-500"
              )}
            />
            {data.tagline?.length > 60 && (
              <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest animate-in fade-in slide-in-from-top-1">
                Warning: Tagline exceeds 60 characters. Investors prefer brevity.
              </p>
            )}
          </div>
        </Field>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4 border-t border-white/5">
        <div className="space-y-4">
          <Field label="Category" icon={Layers} error={errors.category} required>
            <Select 
              value={data.category} 
              onValueChange={(val) => onChange("category", val)}
            >
              <SelectTrigger className="bg-white/5 border-white/10 text-white h-11 lg:h-12 rounded-xl focus:border-[#01F27B]/50">
                <SelectValue placeholder="Select industry category" />
              </SelectTrigger>
              <SelectContent className="bg-[#0c0c0c] border-white/10 text-white">
                {CATEGORIES.map(c => (
                  <SelectItem key={c.id} value={c.id} className="hover:bg-[#01F27B]/10 focus:bg-[#01F27B]/10 cursor-pointer">
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          {/* Conditional Other Category Field */}
          {data.category === "other" && (
            <div className="animate-in slide-in-from-top-2 duration-300">
              <Field label="Custom Category" icon={Tag} error={errors.customCategory} required>
                <Input
                  placeholder="What is your industry?"
                  value={data.customCategory || ""}
                  onChange={(e) => onChange("customCategory", e.target.value)}
                  className="bg-white/5 border-white/10 text-white focus:border-[#01F27B]/50 h-11 lg:h-12 rounded-xl transition-all"
                />
              </Field>
            </div>
          )}
        </div>

        <Field label="Stage" icon={Briefcase} error={errors.stage} required>
          <Select 
            value={data.stage} 
            onValueChange={(val) => onChange("stage", val)}
          >
            <SelectTrigger className="bg-white/5 border-white/10 text-white h-11 lg:h-12 rounded-xl focus:border-[#01F27B]/50">
              <SelectValue placeholder="Current startup stage" />
            </SelectTrigger>
            <SelectContent className="bg-[#0c0c0c] border-white/10 text-white">
              {STAGES.map(s => (
                <SelectItem key={s.id} value={s.id} className="hover:bg-[#01F27B]/10 focus:bg-[#01F27B]/10 cursor-pointer">
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
      </div>
    </div>
  );
}
