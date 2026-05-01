import React, { useRef } from 'react';
import { Upload, X, File as FileIcon, Image as ImageIcon } from 'lucide-react';

export default function FileUploader({ 
  files = [], 
  onChange, 
  accept = "image/*,application/pdf", 
  label = "Upload file",
  maxFiles = 5,
  isDocument = false
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

  return (
    <div className="w-full">
      <div 
        onClick={() => fileRef.current?.click()}
        className="border-2 border-dashed border-white/10 hover:border-[#01F27B]/50 hover:bg-[#01F27B]/5 rounded-2xl p-6 text-center cursor-pointer transition-all group relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[#01F27B]/0 to-[#01F27B]/0 group-hover:to-[#01F27B]/5 transition-all"></div>
        <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-[#01F27B]/10 group-hover:scale-110 transition-all">
          <Upload className="w-5 h-5 text-white/60 group-hover:text-[#01F27B] transition-colors" />
        </div>
        <p className="text-white/80 font-medium text-sm mb-1">{label}</p>
        <p className="text-white/40 text-xs">Drag & drop or click to browse</p>
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
        <div className="mt-3 space-y-2">
          {files.map((file, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 group relative overflow-hidden">
              <div className="w-8 h-8 rounded-lg bg-[#01F27B]/10 flex items-center justify-center shrink-0">
                {isDocument ? (
                  <FileIcon className="w-4 h-4 text-[#01F27B]" />
                ) : (
                  <ImageIcon className="w-4 h-4 text-[#01F27B]" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white/90 truncate font-medium">{file.name || "Uploaded File"}</p>
                <p className="text-xs text-white/40">{file.size ? (file.size / 1024 / 1024).toFixed(2) + ' MB' : 'Ready to upload'}</p>
              </div>
              <button 
                type="button" 
                onClick={(e) => { e.stopPropagation(); removeFile(i); }} 
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-red-500/20 text-white/40 hover:text-red-400 transition-colors"
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
