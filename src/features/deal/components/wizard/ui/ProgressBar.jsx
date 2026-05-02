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
    <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col gap-3">
      <div className="flex justify-between items-center text-sm">
        <span className="font-medium text-white/90 truncate mr-2">
          {message}
        </span>
        <span className="shrink-0 font-mono text-[#01F27B] bg-[#01F27B]/10 px-2 py-0.5 rounded-full text-[10px] md:text-xs">
          <span className="hidden md:inline">Profile Score: </span>{roundedScore}%
        </span>
      </div>
      <div className="w-full h-2 bg-black/40 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-[#01F27B] to-[#00d66d] rounded-full transition-all duration-700 ease-out shadow-[0_0_15px_rgba(1,242,123,0.3)]"
          style={{ width: `${roundedScore}%` }}
        />
      </div>
    </div>
  );
}
