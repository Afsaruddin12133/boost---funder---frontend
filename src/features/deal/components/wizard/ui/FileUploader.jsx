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
      <div className="flex items-center gap-4">
        <div 
          onClick={() => fileRef.current?.click()}
          className="relative w-20 h-20 rounded-2xl border-2 border-dashed border-white/10 hover:border-[#01F27B]/50 hover:bg-[#01F27B]/5 transition-all cursor-pointer flex flex-col items-center justify-center group overflow-hidden shrink-0"
        >
          {previewUrl ? (
            <>
              <img src={previewUrl} alt="Preview" className="w-full h-full object-cover transition-transform group-hover:scale-110" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <Upload className="w-5 h-5 text-white" />
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center">
              <Upload className="w-5 h-5 text-white/20 group-hover:text-[#01F27B] mb-1" />
              <span className="text-[10px] text-white/30 font-bold uppercase tracking-tighter">Logo</span>
            </div>
          )}
          <input ref={fileRef} type="file" accept={accept} className="hidden" onChange={handleFileChange} />
        </div>
        
        <div className="flex-1 min-w-0">
          <p className="text-sm font-black text-white/90 truncate mb-1">{file?.name || label}</p>
          <div className="flex items-center gap-2">
            <button 
              type="button"
              onClick={() => fileRef.current?.click()}
              className="text-[10px] font-black uppercase tracking-widest text-[#01F27B] hover:text-[#00d66d] transition-colors"
            >
              Change
            </button>
            {file && (
              <button 
                type="button"
                onClick={() => removeFile(0)}
                className="text-[10px] font-black uppercase tracking-widest text-red-500/60 hover:text-red-400 transition-colors"
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
        className="border-2 border-dashed border-white/10 hover:border-[#01F27B]/50 hover:bg-[#01F27B]/5 rounded-[1.5rem] p-6 lg:p-10 text-center cursor-pointer transition-all group relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[#01F27B]/0 to-[#01F27B]/0 group-hover:to-[#01F27B]/5 transition-all"></div>
        <div className="w-12 h-12 lg:w-16 lg:h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-[#01F27B]/10 group-hover:scale-110 transition-all shadow-xl">
          <Upload className="w-5 h-5 lg:w-7 lg:h-7 text-white/60 group-hover:text-[#01F27B] transition-colors" />
        </div>
        <p className="text-white/80 font-black text-sm lg:text-base mb-1 tracking-tight">{label}</p>
        <p className="text-white/40 text-[11px] font-medium uppercase tracking-widest">Drag & drop or click to browse</p>
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
        <div className="mt-4 space-y-2">
          {files.map((file, i) => (
            <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 group relative overflow-hidden">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#01F27B]/20 to-[#01F27B]/5 flex items-center justify-center shrink-0 shadow-lg">
                {isDocument ? (
                  <FileIcon className="w-5 h-5 text-[#01F27B]" />
                ) : (
                  <ImageIcon className="w-5 h-5 text-[#01F27B]" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white/90 truncate font-black tracking-tight">{file.name || "Uploaded File"}</p>
                <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">{file.size ? (file.size / 1024 / 1024).toFixed(2) + ' MB' : 'Ready to upload'}</p>
              </div>
              <button 
                type="button" 
                onClick={(e) => { e.stopPropagation(); removeFile(i); }} 
                className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/5 hover:bg-red-500/20 text-white/40 hover:text-red-400 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
