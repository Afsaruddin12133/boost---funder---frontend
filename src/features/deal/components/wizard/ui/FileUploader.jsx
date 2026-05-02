import React, { useRef } from 'react';
import { Upload, X, File as FileIcon, Image as ImageIcon } from 'lucide-react';

export default function FileUploader({ 
  files = [], 
  onChange, 
  accept = "image/*,application/pdf", 
  label = "Upload file",
  maxFiles = 5,
  isDocument = false,
  variant = "default" // "default" or "compact"
}) {
  const fileRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const newFiles = [...files, ...selectedFiles].slice(0, maxFiles);
    onChange(newFiles);
  };

  const removeFile = (indexToRemove) => {
    onChange(files.filter((_, idx) => idx !== indexToRemove));
  };

  const isCompact = variant === "compact";

  if (isCompact) {
    const file = files[0];
    const previewUrl = file instanceof File ? URL.createObjectURL(file) : typeof file === 'string' ? file : null;

    return (
      <div className="flex items-center gap-3">
        <div 
          onClick={() => fileRef.current?.click()}
          className="relative w-12 h-12 rounded-xl border border-dashed border-white/10 hover:border-[#01F27B]/50 hover:bg-[#01F27B]/5 transition-all cursor-pointer flex flex-col items-center justify-center group overflow-hidden shrink-0"
        >
          {previewUrl ? (
            <>
              <img src={previewUrl} alt="Preview" className="w-full h-full object-cover transition-transform group-hover:scale-110" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <Upload className="w-4 h-4 text-white" />
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center">
              <Upload className="w-3.5 h-3.5 text-white/20 group-hover:text-[#01F27B]" />
            </div>
          )}
          <input ref={fileRef} type="file" accept={accept} className="hidden" onChange={handleFileChange} />
        </div>
        
        <div className="flex-1 min-w-0">
          <p className="text-[11px] font-black text-white/90 truncate mb-0.5">{file?.name || label}</p>
          <div className="flex items-center gap-2">
            <button 
              type="button"
              onClick={() => fileRef.current?.click()}
              className="text-[9px] font-black uppercase tracking-widest text-[#01F27B] hover:text-[#00d66d] transition-colors"
            >
              Change
            </button>
            {file && (
              <button 
                type="button"
                onClick={() => removeFile(0)}
                className="text-[9px] font-black uppercase tracking-widest text-red-500/60 hover:text-red-400 transition-colors"
              >
                Remove
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div 
        onClick={() => fileRef.current?.click()}
        className="border-2 border-dashed border-white/10 hover:border-[#01F27B]/50 hover:bg-[#01F27B]/5 rounded-xl p-2 lg:p-3 text-center cursor-pointer transition-all group relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[#01F27B]/0 to-[#01F27B]/0 group-hover:to-[#01F27B]/5 transition-all"></div>
        <div className="flex items-center justify-center gap-3">
          <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center group-hover:bg-[#01F27B]/10 transition-all">
            <Upload className="w-3.5 h-3.5 text-white/60 group-hover:text-[#01F27B] transition-colors" />
          </div>
          <div className="text-left">
            <p className="text-white/80 font-black text-xs tracking-tight">{label} <span className="text-white/40 font-medium uppercase tracking-widest ml-1">- Click to upload</span></p>
          </div>
        </div>
        <input 
          ref={fileRef} 
          type="file" 
          multiple={maxFiles > 1} 
          accept={accept} 
          className="hidden" 
          onChange={handleFileChange} 
        />
      </div>

      {files.length > 0 && (
        <div className="mt-2 space-y-1.5">
          {files.map((file, i) => (
            <div key={i} className="flex items-center gap-3 p-2 rounded-xl bg-white/5 border border-white/10 group relative overflow-hidden">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#01F27B]/20 to-[#01F27B]/5 flex items-center justify-center shrink-0 shadow-lg">
                {isDocument ? (
                  <FileIcon className="w-3.5 h-3.5 text-[#01F27B]" />
                ) : (
                  <ImageIcon className="w-3.5 h-3.5 text-[#01F27B]" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] text-white/90 truncate font-black tracking-tight">{file.name || "Uploaded"}</p>
              </div>
              <button 
                type="button" 
                onClick={(e) => { e.stopPropagation(); removeFile(i); }} 
                className="w-7 h-7 rounded-lg flex items-center justify-center bg-white/5 hover:bg-red-500/20 text-white/40 hover:text-red-400 transition-all"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
