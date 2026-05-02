import React from 'react';
import Field from '../ui/Field';
import DynamicListInput from '../ui/DynamicListInput';
import { Input } from "@/shared/ui/input";
import { Users, Briefcase, Zap, Shield, PieChart } from 'lucide-react';

export default function Step4Execution({ data, onChange, errors }) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Premium Motivational Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-[#01F27B]/5 border border-[#01F27B]/10 p-5 group mb-8">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <Zap className="w-12 h-12 text-[#01F27B]" />
        </div>
        <div className="relative z-10 flex items-start gap-4">
          <div className="mt-1 flex-none w-1 h-10 bg-gradient-to-b from-[#01F27B] to-transparent rounded-full" />
          <div>
            <h4 className="text-sm font-black text-[#01F27B] uppercase tracking-tighter mb-1">Founder's Execution</h4>
            <p className="text-sm text-white/70 italic leading-relaxed">
              "Execution is everything. Ideas are cheap, but the team that delivers is worth its weight in gold."
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-5">
        <Field label="Current ARR / Revenue (AED)" icon={Zap} error={errors.revenue} required>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40">$</span>
            <Input
              type="number"
              placeholder="120000"
              value={data.revenue || ""}
              onChange={(e) => onChange("revenue", e.target.value)}
              className="pl-8 bg-white/5 border-white/10 text-white focus:border-[#01F27B]/50 h-11 rounded-xl"
            />
          </div>
        </Field>

        <Field label="Business Model" icon={Briefcase} error={errors.businessModel} required>
          <textarea
            rows={3}
            placeholder="How do you make money? (e.g. B2B SaaS, $99/mo subscription)"
            value={data.businessModel || ""}
            onChange={(e) => onChange("businessModel", e.target.value)}
            className="w-full rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-[#01F27B]/50 px-3 py-3 text-sm resize-none"
          />
        </Field>

        <Field label="Go-to-Market Strategy" icon={Zap} error={errors.goToMarket} required>
          <textarea
            rows={3}
            placeholder="How are you acquiring customers?"
            value={data.goToMarket || ""}
            onChange={(e) => onChange("goToMarket", e.target.value)}
            className="w-full rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-[#01F27B]/50 px-3 py-3 text-sm resize-none"
          />
        </Field>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Field label="Top Competitor" icon={Shield} error={errors.topCompetitor} required>
            <Input
              placeholder="Who is your biggest rival?"
              value={data.topCompetitor || ""}
              onChange={(e) => onChange("topCompetitor", e.target.value)}
              className="bg-white/5 border-white/10 text-white focus:border-[#01F27B]/50 h-11 rounded-xl"
            />
          </Field>
        </div>

        <Field label="Unfair Advantage" icon={Shield} error={errors.advantage} required>
          <textarea
            rows={3}
            placeholder="What's your moat? Why will you win?"
            value={data.advantage || ""}
            onChange={(e) => onChange("advantage", e.target.value)}
            className="w-full rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-[#01F27B]/50 px-3 py-3 text-sm resize-none"
          />
        </Field>

        <div className="pt-4 border-t border-white/5">
          <Field label="Core Team" icon={Users} error={errors.team} required>
            <DynamicListInput
              type="double"
              placeholder1="Member Name"
              placeholder2="Role / Title"
              key1="name"
              key2="role"
              items={data.team || []}
              onChange={(val) => onChange("team", val)}
            />
          </Field>
        </div>

        <div className="pt-4 border-t border-white/5">
          <Field label="Use of Funds" icon={PieChart} error={errors.useOfFunds} required>
            <DynamicListInput
              type="double"
              placeholder1="Category (e.g. Marketing)"
              placeholder2="Percentage (%)"
              key1="category"
              key2="percentage"
              inputType2="number"
              items={data.useOfFunds || []}
              onChange={(val) => onChange("useOfFunds", val)}
            />
          </Field>
        </div>

        <div className="pt-4 border-t border-white/5">
          <Field label="Founder Q&A" icon={Users} error={errors.qa} required>
            <p className="text-[10px] text-white/30 uppercase tracking-widest mb-3">Anticipate investor questions</p>
            <DynamicListInput
              type="double"
              placeholder1="The Question"
              placeholder2="Your Answer"
              key1="question"
              key2="answer"
              items={data.qa || []}
              onChange={(val) => onChange("qa", val)}
            />
          </Field>
        </div>
      </div>
    </div>
  );
}
