import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/button";

export default function DynamicListInput({ items = [], onChange, placeholder1, placeholder2, type = "single" }) {
  const [val1, setVal1] = useState("");
  const [val2, setVal2] = useState("");

  const add = () => {
    if (type === "single" && val1.trim()) {
      onChange([...items, val1.trim()]);
      setVal1("");
    } else if (type === "double" && val1.trim() && val2.trim()) {
      onChange([...items, { field1: val1.trim(), field2: val2.trim() }]);
      setVal1("");
      setVal2("");
    }
  };

  const remove = (indexToRemove) => {
    onChange(items.filter((_, idx) => idx !== indexToRemove));
  };

  return (
    <div className="w-full">
      <div className="flex gap-2 mb-3">
        <Input 
          placeholder={placeholder1} 
          value={val1} 
          onChange={(e) => setVal1(e.target.value)}
          onKeyDown={(e) => { if(e.key === 'Enter' && type === 'single') { e.preventDefault(); add(); } }}
          className="flex-1 bg-white/5 border-white/10 text-white focus:border-[#01F27B]/50 h-11 rounded-xl"
        />
        {type === "double" && (
          <Input 
            placeholder={placeholder2} 
            value={val2} 
            onChange={(e) => setVal2(e.target.value)}
            onKeyDown={(e) => { if(e.key === 'Enter') { e.preventDefault(); add(); } }}
            className="flex-1 bg-white/5 border-white/10 text-white focus:border-[#01F27B]/50 h-11 rounded-xl"
          />
        )}
        <Button 
          type="button" 
          onClick={add}
          className="bg-[#01F27B]/10 hover:bg-[#01F27B]/20 text-[#01F27B] border border-[#01F27B]/20 h-11 rounded-xl px-4"
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      {items.length > 0 && (
        <div className="flex flex-col gap-2">
          {items.map((item, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
              {type === "single" ? (
                <span className="text-sm text-white/90">{item}</span>
              ) : (
                <div className="flex gap-4 w-full">
                  <span className="text-sm text-white/90 flex-1">{item.field1}</span>
                  <span className="text-sm text-white/60 flex-1">{item.field2}</span>
                </div>
              )}
              <button 
                type="button" 
                onClick={() => remove(i)} 
                className="text-white/40 hover:text-red-400 p-1 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
