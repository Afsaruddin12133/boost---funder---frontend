import React from 'react';

export default function Field({ label, icon: Icon, error, children, required = false }) {
  return (
    <div className="w-full">
      <label className="flex items-center gap-2 text-sm text-white/80 font-medium mb-2">
        {Icon && <Icon className="w-4 h-4 text-[#01F27B]" />}
        {label}
        {required && <span className="text-[#01F27B] text-xs">*</span>}
      </label>
      {children}
      {error && <p className="mt-1.5 text-xs text-red-400 font-medium flex items-center gap-1"><span className="text-red-400 inline-block w-1 h-1 rounded-full bg-red-400"></span> {error}</p>}
    </div>
  );
}
