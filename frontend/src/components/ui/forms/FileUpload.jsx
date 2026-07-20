import { useRef, useState } from "react";
import { UploadCloud, FileText, X } from "lucide-react";

export default function FileUpload({ label, required = false, onChange, error, accept }) {
  const inputRef = useRef(null);
  const [fileName, setFileName] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = (file) => {
    if (!file) return;
    setFileName(file.name);
    onChange(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFile(e.dataTransfer.files?.[0]);
  };

  const clear = () => {
    setFileName(null);
    onChange(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-medium text-[var(--color-text-primary)]">
          {label}
          {required && <span className="text-[var(--color-danger)]"> *</span>}
        </label>
      )}

      {fileName ? (
        <div className="flex items-center justify-between rounded-[var(--radius-input)] border border-[var(--color-border)] bg-white px-3.5 py-2.5">
          <div className="flex items-center gap-2 text-sm text-[var(--color-text-primary)] truncate">
            <FileText className="h-4 w-4 text-[var(--color-primary)] shrink-0" />
            <span className="truncate">{fileName}</span>
          </div>
          <button
            type="button"
            onClick={clear}
            className="text-[var(--color-text-secondary)] hover:text-[var(--color-danger)] shrink-0"
            aria-label="Remove file"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`flex flex-col items-center justify-center gap-2 rounded-[var(--radius-input)] border-2 border-dashed px-4 py-6 cursor-pointer transition ${
            isDragging
              ? "border-[var(--color-primary)] bg-[var(--color-primary)]/5"
              : error
              ? "border-[var(--color-danger)]"
              : "border-[var(--color-border)] hover:border-[var(--color-primary)]/50"
          }`}
        >
          <UploadCloud className="h-6 w-6 text-[var(--color-text-secondary)]" />
          <p className="text-sm text-[var(--color-text-secondary)] text-center">
            Drag & drop or <span className="text-[var(--color-primary)] font-medium">browse</span>
          </p>
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
        </div>
      )}
      {error && <p className="text-xs text-[var(--color-danger)]">{error}</p>}
    </div>
  );
}
