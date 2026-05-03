import React from "react";
import { Bookmark } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger, Loader } from "@/shared/ui";

export default function BookmarkButton({ isSaved, isLoading, onClick }) {
  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              if (!isLoading && onClick) onClick();
            }}
            disabled={isLoading}
            className={`group flex items-center justify-center w-9 h-9 rounded-full transition-all duration-300
              ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110 active:scale-95 cursor-pointer'}
              ${isSaved ? 'bg-[#01F27B]/10 hover:bg-[#01F27B]/20' : 'bg-white/5 hover:bg-white/10 border border-white/10'}
            `}
            aria-label={isSaved ? "Unsave deal" : "Save deal"}
          >
            {isLoading ? (
              <Loader size="sm" />
            ) : (
              <Bookmark 
                className={`w-4 h-4 transition-all duration-300
                  ${isSaved ? 'text-[#01F27B]' : 'text-white/60 group-hover:text-white'}
                `}
                fill={isSaved ? "currentColor" : "none"}
                strokeWidth={isSaved ? 1 : 2}
              />
            )}
          </button>
        </TooltipTrigger>
        <TooltipContent side="top" className="bg-[#0c0c0c] border border-white/10 text-white text-xs">
          {isSaved ? "Unsave deal" : "Save deal"}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
