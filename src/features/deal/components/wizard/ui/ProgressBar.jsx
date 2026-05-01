import React from 'react';

export default function ProgressBar({ score }) {
  const roundedScore = Math.min(Math.max(Math.round(score), 0), 100);

  // Determine message based on score
  let message = "Let's get started on your deal!";
  if (roundedScore === 100) message = "🎉 100% complete — you're ready for investors!";
  else if (roundedScore >= 80) message = `🔥 ${roundedScore}% complete — almost there, finish strong!`;
  else if (roundedScore >= 50) message = `🔥 ${roundedScore}% complete — you're halfway to getting investor-ready!`;
  else if (roundedScore > 0) message = `🚀 ${roundedScore}% complete — keep going!`;

  return (
    <div className="mb-6 bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col gap-3">
      <div className="flex justify-between items-center text-sm">
        <span className="font-medium text-white/90">{message}</span>
        <span className="font-mono text-[#01F27B] bg-[#01F27B]/10 px-2 py-0.5 rounded-full text-xs">
          {roundedScore}% Profile Score
        </span>
      </div>
      <div className="w-full h-2.5 bg-black/40 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-[#01F27B]/80 to-[#01F27B] rounded-full transition-all duration-500 ease-out"
          style={{ width: `${roundedScore}%` }}
        />
      </div>
    </div>
  );
}
