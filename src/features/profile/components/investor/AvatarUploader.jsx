import React, { useRef, useState } from "react";
import { Camera, ImagePlus } from "lucide-react";

export default function AvatarUploader({ currentImage, onImageSelect, previewUrl }) {
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      onImageSelect(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      onImageSelect(file);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div 
        className={`relative w-36 h-36 rounded-full overflow-hidden bg-white/5 border-2 group cursor-pointer transition-all duration-300
          ${isDragging ? "border-[#01F27B] scale-105 bg-[#01F27B]/5" : "border-dashed border-white/20 hover:border-[#01F27B]/50"}
        `}
        onClick={() => fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {previewUrl || currentImage ? (
          <img 
            src={previewUrl || currentImage} 
            alt="Profile Avatar" 
            className="w-full h-full object-cover group-hover:opacity-40 transition-opacity duration-300"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-white/40 group-hover:text-[#01F27B] transition-colors">
            <ImagePlus className="w-8 h-8 mb-2" />
            <span className="text-xs font-medium">Upload Image</span>
          </div>
        )}
        
        {/* Hover overlay for changing image */}
        {(previewUrl || currentImage) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Camera className="w-8 h-8 text-white mb-1" />
            <span className="text-[10px] text-white font-medium uppercase tracking-wider">Change</span>
          </div>
        )}
      </div>
      <input 
        type="file" 
        accept="image/png, image/jpeg, image/jpg, image/webp" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        className="hidden" 
      />
      <p className="text-xs text-white/40 mt-4 text-center leading-relaxed">
        Allowed *.jpeg, *.jpg, *.png, *.webp<br />
        Max size of 3MB
      </p>
    </div>
  );
}
