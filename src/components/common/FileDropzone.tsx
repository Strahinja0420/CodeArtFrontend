import React from "react";
import { CheckCircle2 } from "lucide-react";

interface FileDropzoneProps {
  label: string;
  icon: React.ElementType;
  accept: string;
  file: File | null;
  onFileSelect: (file: File | null) => void;
}

export const FileDropzone: React.FC<FileDropzoneProps> = ({
  label,
  icon: Icon,
  accept,
  file,
  onFileSelect,
}) => {
  return (
    <div className="flex-1">
      <label className="block text-sm font-medium mb-2 text-fg/60 ml-1">
        {label}
      </label>
      <div
        className={`relative h-32 glass rounded-2xl border-dashed border-2 transition-all flex flex-col items-center justify-center gap-2 cursor-pointer
        ${
          file
            ? "border-accent/50 bg-accent/5"
            : "border-fg/10 hover:border-fg/20"
        }`}
      >
        <input
          type="file"
          accept={accept}
          className="absolute inset-0 opacity-0 cursor-pointer"
          onChange={(e) => onFileSelect(e.target.files?.[0] || null)}
        />
        {file ? (
          <>
            <CheckCircle2 className="text-accent" size={24} />
            <span className="text-xs font-medium text-accent truncate max-w-[90%]">
              {file.name}
            </span>
          </>
        ) : (
          <>
            <Icon className="text-fg/20" size={24} />
            <span className="text-xs font-medium text-fg/40">
              Drop or click
            </span>
          </>
        )}
      </div>
    </div>
  );
};
