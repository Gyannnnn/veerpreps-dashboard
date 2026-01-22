"use client";

import { useState, useEffect, useRef } from "react"; // Added useRef
import { Check, ChevronsUpDown, Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import axios from "axios";
import { uploadTypesResponse } from "@/types/Upload";
import { uploadPyq } from "@/app/api/actions/upload";

export default function PyqUploadPage() {
  const [uploadData, setUploadData] = useState<uploadTypesResponse | null>(
    null
  );
  const [subjectId, setSubjectId] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null); // Added ref

  useEffect(() => {
    async function getUploadData() {
      try {
        const res = await axios.get<uploadTypesResponse>(
          "http://localhost:8000/api/admin/upload-data"
        );
        setUploadData(res.data);
      } catch (error) {
        console.error("Failed to fetch upload data", error);
        toast.error("Failed to load subjects and branches");
      }
    }
    getUploadData();
  }, []);

  const [open, setOpen] = useState(false);
  const [subjectDisplay, setSubjectDisplay] = useState("");
  const [year, setYear] = useState("");
  const [examType, setExamType] = useState("");
  const [pyqName, setPyqName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const years = Array.from({ length: 31 }, (_, i) => 2000 + i);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type === "application/pdf") {
        setFile(selectedFile);
        setFileName(selectedFile.name);
        toast.success(`Selected: ${selectedFile.name}`);
      } else {
        toast.error("Please select a PDF file");
        e.target.value = ""; // Reset the input
      }
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === "application/pdf") {
      setFile(droppedFile);
      setFileName(droppedFile.name);
      toast.success(`Selected: ${droppedFile.name}`);
    } else {
      toast.error("Please select a PDF file");
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    console.log("Form values:", {
      subjectId,
      examType,
      pyqName,
      year,
      file: file?.name,
      fileName,
    });

    // Validation
    if (!subjectId || !examType || !pyqName || !year || !file) {
      toast.error("All fields are required");
      console.log("Missing fields:", {
        subjectId: !subjectId,
        examType: !examType,
        pyqName: !pyqName,
        year: !year,
        file: !file,
      });
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("pyqpdf", file);
      formData.append("pyqname", pyqName);
      formData.append("pyqtype", examType);
      formData.append("pyqyear", year);
      formData.append("subjectid", subjectId);

      console.log("FormData contents:");
      for (let [key, value] of formData.entries()) {
        console.log(
          key,
          value instanceof File ? `${value.name} (${value.type})` : value
        );
      }

      await uploadPyq(formData, subjectId);
      toast.success("PYQ uploaded successfully");

      // Reset form
      setPyqName("");
      setFile(null);
      setFileName("");
      setSubjectDisplay("");
      setSubjectId("");
      setExamType("");
      setYear("");

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (err: any) {
      console.error("Upload error:", err);
      toast.error(err.message || "Upload failed");
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div className="flex max-w-2xl flex-col gap-8 p-4 pt-4">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold tracking-tight">Upload PYQ</h2>
        <p className="text-muted-foreground">
          Upload Previous Year Questions for students.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Year *</Label>
            <Select value={year} onValueChange={setYear} required>
              <SelectTrigger>
                <SelectValue placeholder="Select Year" />
              </SelectTrigger>
              <SelectContent>
                {years.map((y) => (
                  <SelectItem key={y} value={String(y)}>
                    {y}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Exam Type *</Label>
            <Select value={examType} onValueChange={setExamType} required>
              <SelectTrigger>
                <SelectValue placeholder="Select Exam Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MID">Mid Semester</SelectItem>
                <SelectItem value="END">End Semester</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Subject *</Label>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-full justify-between"
              >
                {subjectDisplay ? subjectDisplay : "Select Subject..."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command>
                <CommandInput placeholder="Search subject..." />
                <CommandList>
                  <CommandEmpty>No subject found.</CommandEmpty>
                  <CommandGroup>
                    {uploadData?.data.subjects.map((s) => (
                      <CommandItem
                        key={s.subject_id}
                        value={`${s.subjectname} (${s.branchname})`}
                        onSelect={(currentValue) => {
                          setSubjectDisplay(currentValue);
                          setSubjectId(s.subject_id.toString());
                          setOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            subjectDisplay ===
                              `${s.subjectname} (${s.branchname})`
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        {s.subjectname} ({s.branchname})
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label>PYQ Name *</Label>
          <Input
            placeholder="e.g. 2025 Mid Sem"
            value={pyqName}
            onChange={(e) => setPyqName(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label>Upload PDF *</Label>
          <div
            className="relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/5 p-12 text-center transition-colors hover:bg-muted/10 cursor-pointer"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="application/pdf"
              className="hidden"
              required
            />
            {file ? (
              <div className="flex flex-col items-center gap-2">
                <div className="rounded-full bg-primary/10 p-4">
                  <Upload className="h-8 w-8 text-primary" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">{fileName}</p>
                  <p className="text-xs text-muted-foreground">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-2 h-8 w-8 p-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    setFile(null);
                    setFileName("");
                    if (fileInputRef.current) {
                      fileInputRef.current.value = "";
                    }
                  }}
                >
                  <span className="sr-only">Remove file</span>
                </Button>
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
                  <p className="text-xs text-muted-foreground">
                    PDF up to 10MB
                  </p>
                </div>
              </>
            )}
          </div>
          {file && (
            <p className="text-sm text-muted-foreground">
              Selected: {fileName}
            </p>
          )}
        </div>

        <div className="flex justify-end">
          <Button type="submit" size="lg" disabled={isUploading}>
            {isUploading ? "Uploading..." : "Save PYQ Entry"}
          </Button>
        </div>
      </form>
    </div>
  );
}
