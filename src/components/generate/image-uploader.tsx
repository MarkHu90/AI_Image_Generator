"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { ImageIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImageUploaderProps {
  onImageUploaded: (url: string) => void;
  currentImage?: string;
}

export function ImageUploader({
  onImageUploaded,
  currentImage,
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      setUploading(true);
      try {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) throw new Error("Upload failed");
        const data = await res.json();
        onImageUploaded(data.url);
      } catch (err) {
        console.error("Upload error:", err);
      } finally {
        setUploading(false);
      }
    },
    [onImageUploaded]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".png", ".jpg", ".jpeg", ".webp"] },
    maxFiles: 1,
    disabled: uploading,
  });

  if (currentImage) {
    return (
      <div className="relative rounded-lg overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={currentImage}
          alt="Uploaded"
          className="w-full h-48 object-cover"
        />
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-1 right-1"
          onClick={() => onImageUploaded("")}
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
    );
  }

  return (
    <div
      {...getRootProps()}
      className="border-2 border-dashed border-border-primary rounded-lg p-8 text-center cursor-pointer hover:border-accent transition-colors"
    >
      <input {...getInputProps()} />
      <ImageIcon className="w-8 h-8 mx-auto mb-2 text-text-secondary" />
      {uploading ? (
        <p className="text-sm text-text-secondary">Uploading...</p>
      ) : isDragActive ? (
        <p className="text-sm text-text-secondary">Drop image here</p>
      ) : (
        <p className="text-sm text-text-secondary">
          Drag & drop an image, or click to select
        </p>
      )}
    </div>
  );
}
