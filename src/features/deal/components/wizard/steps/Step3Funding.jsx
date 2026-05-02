import React from 'react';
import Field from '../ui/Field';
import { Input } from "@/shared/ui/input";
import { DollarSign, TrendingUp, Calendar, Users, BarChart3 } from 'lucide-react';

export default function Step3Funding({ data, onChange, errors }) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Premium Motivational Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-[#01F27B]/5 border border-[#01F27B]/10 p-5 group mb-8">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <TrendingUp className="w-12 h-12 text-[#01F27B]" />
        </div>
        <div className="relative z-10 flex items-start gap-4">
          <div className="mt-1 flex-none w-1 h-10 bg-gradient-to-b from-[#01F27B] to-transparent rounded-full" />
          <div>
            <h4 className="text-sm font-black text-[#01F27B] uppercase tracking-tighter mb-1">Founder's Growth</h4>
            <p className="text-sm text-white/70 italic leading-relaxed">
              "Capital is fuel. Precision in your numbers gives investors the confidence to ignite your growth."
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Field label="Goal Amount" icon={DollarSign} error={errors.goalAmount} required>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40">$</span>
            <Input
              type="number"
              placeholder="500000"
              value={data.goalAmount || ""}
              onChange={(e) => onChange("goalAmount", e.target.value)}
              className="pl-8 bg-white/5 border-white/10 text-white focus:border-[#01F27B]/50 h-11 rounded-xl"
            />
          </div>
        </Field>

        <Field label="Raised Amount" icon={DollarSign} error={errors.raisedAmount} required>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40">$</span>
            <Input
              type="number"
              placeholder="100000"
              value={data.raisedAmount || ""}
              onChange={(e) => onChange("raisedAmount", e.target.value)}
              className="pl-8 bg-white/5 border-white/10 text-white focus:border-[#01F27B]/50 h-11 rounded-xl"
            />
          </div>
        </Field>

        <Field label="Minimum Investment" icon={DollarSign} error={errors.minimumInvestment} required>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40">$</span>
            <Input
              type="number"
              placeholder="1000"
              value={data.minimumInvestment || ""}
              onChange={(e) => onChange("minimumInvestment", e.target.value)}
              className="pl-8 bg-white/5 border-white/10 text-white focus:border-[#01F27B]/50 h-11 rounded-xl"
            />
          </div>
        </Field>

        <Field label="Deadline" icon={Calendar} error={errors.deadline} required>
          <Input
            type="date"
            value={data.deadline || ""}
            onChange={(e) => onChange("deadline", e.target.value)}
            className="bg-white/5 border-white/10 text-white focus:border-[#01F27B]/50 h-11 rounded-xl cursor-pointer"
          />
        </Field>

        <Field label="Current Users / Customers" icon={Users} error={errors.users} required>
          <Input
            type="number"
            placeholder="1500"
            value={data.users || ""}
            onChange={(e) => onChange("users", e.target.value)}
            className="bg-white/5 border-white/10 text-white focus:border-[#01F27B]/50 h-11 rounded-xl"
          />
        </Field>

        <Field label="Growth Rate (MoM %)" icon={BarChart3} error={errors.growthRate} required>
          <div className="relative">
            <Input
              type="number"
              placeholder="15"
              value={data.growthRate || ""}
              onChange={(e) => onChange("growthRate", e.target.value)}
              className="pr-8 bg-white/5 border-white/10 text-white focus:border-[#01F27B]/50 h-11 rounded-xl"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40">%</span>
          </div>
        </Field>
      </div>
    </div>
  );
}
