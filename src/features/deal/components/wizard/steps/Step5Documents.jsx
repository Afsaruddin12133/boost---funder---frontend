import React from 'react';
import Field from '../ui/Field';
import FileUploader from '../ui/FileUploader';
import { Lock, ShieldCheck } from 'lucide-react';

export default function Step5Documents({ data, onChange, errors }) {
  const docTypes = [
    { key: "pitchDeck", label: "Pitch Deck", desc: "Your main presentation" },
    { key: "safeAgreement", label: "SAFE Agreement / Term Sheet", desc: "Investment terms" },
    { key: "registrationCertificate", label: "Registration Certificate", desc: "Proof of incorporation" },
    { key: "tradeLicense", label: "Trade License", desc: "If applicable" },
    { key: "balanceSheet", label: "Balance Sheet", desc: "Latest financial statement" },
    { key: "revenueProof", label: "Revenue Proof", desc: "Bank statements or Stripe screenshots" },
    { key: "capTable", label: "Cap Table", desc: "Current ownership structure" },
    { key: "shareholderAgreement", label: "Shareholder Agreement", desc: "Legal structural doc" }
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-[#01F27B]/10 border border-[#01F27B]/20 rounded-xl p-4 flex items-start gap-3">
        <Lock className="w-5 h-5 text-[#01F27B] shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="text-sm text-[#01F27B] font-medium leading-relaxed">
            Verified startups get more investment. Upload documents to build trust.
          </p>
          <p className="text-xs text-[#01F27B]/70 mt-1 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            Secure & private. Only verified investors can request access.
          </p>
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
