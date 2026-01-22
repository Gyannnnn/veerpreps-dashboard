"use client";

import { useCallback, useState } from "react";
import { Upload, X, FileText, CheckCircle2 } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface FileUploaderProps {
  onUpload?: (file: File | null) => Promise<void>;
  accept?: Record<string, string[]>;
  maxSize?: number; // in bytes
}

export function FileUploader({
  onUpload,
  accept = { "application/pdf": [".pdf"] },
  maxSize = 10 * 1024 * 1024, // 10MB
}: FileUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const selected = acceptedFiles[0];
      if (selected) {
        setFile(selected);
        setUploaded(false);
        setProgress(0);
        if (onUpload) {
          onUpload(selected);
        }
      }
    },
    [onUpload],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxSize,
    maxFiles: 1,
    disabled: uploading,
  });

  // Simulate upload
  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);

    // Simulation logic
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) {
          clearInterval(interval);
          return prev;
        }
        return prev + 5;
      });
    }, 100);

    try {
      if (onUpload) {
        await onUpload(file);
      } else {
        // Default simulation
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }

      setProgress(100);
      setUploaded(true);
      toast.success("File uploaded successfully!");
    } catch (error) {
      toast.error("Upload failed. Please try again.");
      setProgress(0);
    } finally {
      clearInterval(interval);
      setUploading(false);
    }
  };

  const removeFile = () => {
    setFile(null);
    setUploaded(false);
    setProgress(0);
    if (onUpload) {
      onUpload(null);
    }
  };

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={cn(
          "relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/5 p-12 text-center transition-colors hover:bg-muted/10",
          isDragActive && "border-primary bg-primary/5",
          (uploading || uploaded) && "pointer-events-none opacity-60",
          file && "border-solid border-primary/50",
        )}
      >
        <input {...getInputProps()} />
        {file ? (
          <div className="flex flex-col items-center gap-2">
            <div className="rounded-full bg-primary/10 p-4">
              <FileText className="h-8 w-8 text-primary" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">{file.name}</p>
              <p className="text-xs text-muted-foreground">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
            {!uploading && !uploaded && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-2 top-2 h-8 w-8 p-0"
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile();
                }}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Remove file</span>
              </Button>
            )}
          </div>
        ) : (
          <>
            <div className="rounded-full bg-muted p-4">
              <Upload className="h-8 w-8 text-muted-foreground" />
            </div>
            <div className="mt-4 space-y-1">
              <p className="text-sm font-medium">
                Drag & drop or click to upload
              </p>
              <p className="text-xs text-muted-foreground">PDF up to 10MB</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
