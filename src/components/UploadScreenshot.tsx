"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { UploadCloud, X } from "lucide-react";

interface UploadScreenshotProps {
  onUpload: (base64: string) => void;
  onRemove: () => void;
  previewUrl: string | null;
}

export function UploadScreenshot({
  onUpload,
  onRemove,
  previewUrl,
}: UploadScreenshotProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpload(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="mt-2 text-sm text-center border-2 border-dashed border-border rounded-lg p-6 bg-muted/20 relative group transition-colors hover:border-primary/50">
      <input
        type="file"
        accept="image/*"
        ref={inputRef}
        onChange={handleFileChange}
        className="hidden"
      />
      
      {previewUrl ? (
        <div className="relative w-full h-32 flex items-center justify-center rounded overflow-hidden">
          <Image
            src={previewUrl}
            alt="Trade screenshot"
            className="max-h-full max-w-full object-contain"
            width={300}
            height={128}
          />
          <button
            type="button"
            onClick={onRemove}
            className="absolute top-2 right-2 bg-black/50 p-1.5 rounded-full text-white hover:bg-black/80 transition-opacity"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-2 cursor-pointer" onClick={() => inputRef.current?.click()}>
          <UploadCloud className="h-8 w-8 text-muted-foreground group-hover:text-primary transition-colors" />
          <div>
            <span className="font-semibold text-primary">Click to upload</span> or drag and drop
          </div>
          <p className="text-xs text-muted-foreground">
            PNG, JPG up to 5MB
          </p>
        </div>
      )}
    </div>
  );
}
