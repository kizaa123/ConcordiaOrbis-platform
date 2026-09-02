"use client";

import { useRef, useState } from "react";
import { Icon, type IconName } from "@/components/icons";
import { Spinner, SpinnerLabel } from "@/components/LoadingPrimitives";

type FileUploadZoneProps = {
  label: string;
  accept: string;
  icon: Extract<IconName, "file" | "image">;
  disabled?: boolean;
  uploading?: boolean;
  onFileSelect: (file: File) => void;
  fileName?: string;
  previewUrl?: string;
  hint?: string;
};

export function FileUploadZone({
  label,
  accept,
  icon,
  disabled = false,
  uploading = false,
  onFileSelect,
  fileName,
  previewUrl,
  hint,
}: FileUploadZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewLoaded, setPreviewLoaded] = useState(false);
  const [dragging, setDragging] = useState(false);
  const hasSelection = Boolean(fileName || previewUrl);
  const isImage = icon === "image";
  const idle = !(disabled || uploading);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreviewLoaded(false);
      onFileSelect(file);
    }
  };

  const takeFile = (file: File | undefined) => {
    if (!file || !idle) return;
    setPreviewLoaded(false);
    onFileSelect(file);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (idle) setDragging(true);
  };

  const onDragLeave = () => setDragging(false);

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    takeFile(e.dataTransfer.files?.[0]);
  };

  const openPicker = () => {
    if (idle) inputRef.current?.click();
  };

  return (
    <div>
      <label className="auth-label">{label}</label>
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        accept={accept}
        disabled={!idle}
        onChange={handleChange}
      />

      {isImage ? (
        <button
          type="button"
          disabled={!idle}
          onClick={openPicker}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          className={`group relative block w-full overflow-hidden rounded-2xl border-2 border-dashed text-left transition ${
            dragging
              ? "border-brand-500 bg-brand-50"
              : hasSelection
                ? "border-brand-200 bg-white hover:border-brand-400"
                : "border-brand-200 bg-brand-50/40 hover:border-brand-400 hover:bg-brand-50/70"
          } ${idle ? "cursor-pointer" : "cursor-not-allowed opacity-60"}`}
        >
          {uploading && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/85">
              <Spinner className="h-8 w-8" />
            </div>
          )}

          {previewUrl ? (
            <div className="relative aspect-[16/9] w-full overflow-hidden bg-brand-50">
              {!previewLoaded && <div className="absolute inset-0 z-20 animate-pulse bg-gray-200" />}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewUrl}
                alt=""
                aria-hidden
                className="pointer-events-none absolute inset-0 h-full w-full scale-110 object-cover blur-xl"
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewUrl}
                alt="Cover preview"
                className={`relative z-10 h-full w-full object-contain ${previewLoaded ? "opacity-100" : "opacity-0"}`}
                onLoad={() => setPreviewLoaded(true)}
              />
              <div className="absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-black/55 to-transparent p-3">
                <p className="text-sm font-semibold text-white">Replace cover</p>
                {fileName ? <p className="mt-0.5 truncate text-xs text-white/80">{fileName}</p> : null}
              </div>
            </div>
          ) : (
            <div className="flex aspect-[16/9] flex-col items-center justify-center gap-2 px-4 py-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-brand-600 shadow-sm ring-1 ring-brand-100">
                <Icon name="image" className="h-6 w-6" />
              </div>
              <p className="text-sm font-semibold text-brand-800">Add cover image</p>
              <p className="text-xs text-gray-500">{hint ?? "PNG, JPG or WebP"}</p>
            </div>
          )}
        </button>
      ) : (
        <button
          type="button"
          disabled={!idle}
          onClick={openPicker}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          className={`group flex w-full items-center gap-4 rounded-2xl border-2 border-dashed px-4 py-4 text-left transition sm:px-5 ${
            dragging
              ? "border-brand-500 bg-brand-50"
              : hasSelection
                ? "border-brand-300 bg-brand-50/60 hover:border-brand-400"
                : "border-brand-200 bg-white hover:border-brand-400 hover:bg-brand-50/40"
          } ${idle ? "cursor-pointer" : "cursor-not-allowed opacity-60"}`}
        >
          <div
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
              hasSelection ? "bg-brand-700 text-white" : "bg-brand-100 text-brand-700"
            }`}
          >
            {uploading ? <Spinner className="h-5 w-5" /> : <Icon name="file" className="h-6 w-6" />}
          </div>
          <div className="min-w-0 flex-1">
            {uploading ? (
              <SpinnerLabel label="Uploading PDF…" />
            ) : hasSelection ? (
              <>
                <p className="text-sm font-semibold text-brand-900">PDF ready</p>
                {fileName ? (
                  <p className="mt-0.5 truncate text-xs text-brand-600">{fileName}</p>
                ) : null}
                <p className="mt-1 text-xs font-medium text-brand-700">Click to replace</p>
              </>
            ) : (
              <>
                <p className="text-sm font-semibold text-brand-900">Drop PDF here or click to browse</p>
                <p className="mt-0.5 text-xs text-gray-500">{hint ?? "PDF only"}</p>
              </>
            )}
          </div>
          {hasSelection && !uploading ? (
            <Icon name="check-circle" className="h-5 w-5 shrink-0 text-brand-600" />
          ) : null}
        </button>
      )}
    </div>
  );
}
