"use client";

import { useState, useEffect } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
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
import { FileUploader } from "@/components/file-uploader";
import { toast } from "sonner";
import axios from "axios";
import { uploadTypesResponse } from "@/types/Upload";
import { uploadNote } from "@/app/api/actions/upload";

export default function NotesUploadPage() {
  const [UploadData, SetUploadData] = useState<uploadTypesResponse | null>();
  const [subjectId, setSubjectId] = useState<string>("");

  useEffect(() => {
    async function getUploadData() {
      try {
        const res = await axios.get<uploadTypesResponse>(
          "http://localhost:8000/api/admin/upload-data",
        );
        SetUploadData(res.data);
      } catch (error) {
        console.error("Failed to fetch upload data", error);
        toast.error("Failed to load subjects and branches");
      }
    }
    getUploadData();
  }, []);

  const [open, setOpen] = useState(false);
  const [subject, setSubject] = useState("");
  const [branch, setBranch] = useState("");
  const [year, setYear] = useState("");
  const [notesName, setNotesName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadKey, setUploadKey] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!subjectId || !notesName || !file) {
      toast.error("Please fill all fields and upload a file.");
      return;
    }

    const formData = new FormData();
    formData.append("notespdf", file);
    formData.append("notesname", notesName);

    setIsUploading(true);

    toast.promise(uploadNote(formData, subjectId), {
      loading: "Uploading notes...",
      success: () => {
        setNotesName("");
        setFile(null);
        setUploadKey((prev) => prev + 1); // Reset FileUploader
        setIsUploading(false);
        return `Notes "${notesName}" uploaded successfully!`;
      },
      error: (err) => {
        setIsUploading(false);
        return err.message || "Upload failed";
      },
    });
  };

  return (
    <div className="flex max-w-2xl flex-col gap-8 p-4 pt-0">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold tracking-tight">Upload Notes</h2>
        <p className="text-muted-foreground">
          Share lecture notes and study materials.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Branch</Label>
            <Select value={branch} onValueChange={setBranch}>
              <SelectTrigger>
                <SelectValue placeholder="Select Branch" />
              </SelectTrigger>
              <SelectContent>
                {UploadData?.data.branches.map((branch) => (
                  <SelectItem key={branch.branch_id} value={branch.branchname}>
                    {branch.branchname}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Year</Label>
            <Select value={year} onValueChange={setYear}>
              <SelectTrigger>
                <SelectValue placeholder="Select Year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1st Year</SelectItem>
                <SelectItem value="2">2nd Year</SelectItem>
                <SelectItem value="3">3rd Year</SelectItem>
                <SelectItem value="4">4th Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Subject</Label>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-full justify-between"
              >
                {subject ? subject : "Select Subject..."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
              <Command>
                <CommandInput placeholder="Search subject..." />
                <CommandList>
                  <CommandEmpty>No subject found.</CommandEmpty>
                  <CommandGroup>
                    {UploadData?.data.subjects.map((s) => (
                      <CommandItem
                        key={s.subject_id}
                        value={s.subjectname}
                        onSelect={() => {
                          setSubject(s.subjectname);
                          setSubjectId(s.subject_id.toString());
                          setOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            subject === s.subjectname
                              ? "opacity-100"
                              : "opacity-0",
                          )}
                        />
                        {s.subjectname} {s.branchname}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label>Notes Name/Title</Label>
          <Input
            placeholder="e.g. Unit 1 - Graphs Handwritted"
            value={notesName}
            onChange={(e) => setNotesName(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>Upload PDF</Label>
          <FileUploader
            key={uploadKey}
            accept={{ "application/pdf": [".pdf"] }}
            onUpload={async (f) => {
              setFile(f);
              return Promise.resolve();
            }}
          />
        </div>

        <div className="flex justify-end">
          <Button type="submit" size="lg" disabled={!file || isUploading}>
            {isUploading ? "Uploading..." : "Publish Notes"}
          </Button>
        </div>
      </form>
    </div>
  );
}
