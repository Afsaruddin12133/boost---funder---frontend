import React from 'react';
import Field from '../ui/Field';
import FileUploader from '../ui/FileUploader';
import { Lock, ShieldCheck } from 'lucide-react';

export default function Step5Documents({ data, onChange, errors }) {
  const docTypes = [
    { key: "pitchDeck", label: "Pitch Deck", desc: "Your main presentation" },
    { key: "safeAgreement", label: "SAFE Agreement", desc: "Investment structure" },
    { key: "termSheet", label: "Term Sheet", desc: "Detailed investment terms" },
    { key: "registrationCertificate", label: "Registration Certificate", desc: "Proof of incorporation" },
    { key: "tradeLicense", label: "Trade License", desc: "If applicable" },
    { key: "balanceSheet", label: "Balance Sheet", desc: "Latest financial statement" },
    { key: "revenueProof", label: "Revenue Proof", desc: "Bank statements or screenshots" },
    { key: "capTable", label: "Cap Table", desc: "Current ownership structure" },
    { key: "shareholderAgreement", label: "Shareholder Agreement", desc: "Legal structural doc" }
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Premium Motivational Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-[#01F27B]/5 border border-[#01F27B]/10 p-5 group mb-8">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <ShieldCheck className="w-12 h-12 text-[#01F27B]" />
        </div>
        <div className="relative z-10 flex items-start gap-4">
          <div className="mt-1 flex-none w-1 h-10 bg-gradient-to-b from-[#01F27B] to-transparent rounded-full" />
          <div className="flex-1">
            <h4 className="text-sm font-black text-[#01F27B] uppercase tracking-tighter mb-1">Founder's Trust</h4>
            <p className="text-sm text-white/70 italic leading-relaxed mb-2">
              "Transparency is the foundation of trust. Verified data turns skeptical leads into committed partners."
            </p>
            <div className="flex items-center gap-2 text-[10px] font-bold text-[#01F27B]/60 uppercase tracking-widest">
              <Lock className="w-3 h-3" />
              <span>Secure & Private • Encrypted Storage</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {docTypes.map(({ key, label, desc }) => (
          <Field key={key} label={label} error={errors[key]} required>
            <p className="text-xs text-white/40 mb-2">{desc}</p>
            <FileUploader 
              files={data[key] ? [data[key]] : []}
              onChange={(files) => onChange(key, files[0] || null)}
              accept="application/pdf"
              label={`Upload ${label}`}
              maxFiles={1}
              isDocument={true}
            />
          </Field>
        ))}
      </div>
    </div>
  );
}
