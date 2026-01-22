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
import { toast } from "sonner";
import axios from "axios";
import { uploadTypesResponse } from "@/types/Upload";
import { uploadYoutubeVideo } from "@/app/api/actions/upload";

export default function YoutubeUploadPage() {
  const [uploadData, setUploadData] = useState<uploadTypesResponse | null>(
    null,
  );
  const [subjectId, setSubjectId] = useState<string>("");

  useEffect(() => {
    async function getUploadData() {
      try {
        const res = await axios.get<uploadTypesResponse>(
          "https://veer-preps-api.vercel.app/api/admin/upload-data",
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
  const [branch, setBranch] = useState("");
  const [year, setYear] = useState("");
  const [videoName, setVideoName] = useState("");
  const [youtubeLink, setYoutubeLink] = useState("");
  const [isValidLink, setIsValidLink] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  const validateLink = (link: string) => {
    // Basic YouTube URL validation
    const regExp =
      /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?(.+)$/;
    setIsValidLink(regExp.test(link) || link === "");
    setYoutubeLink(link);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!subjectId || !videoName || !youtubeLink) {
      toast.error("Please fill all fields.");
      return;
    }

    if (!isValidLink) {
      toast.error("Please enter a valid YouTube URL.");
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("videoname", videoName);
      formData.append("link", youtubeLink);

      await uploadYoutubeVideo(formData, subjectId);

      toast.success("Video added successfully!", {
        description: `"${videoName}" linked to platform.`,
      });

      setVideoName("");
      setYoutubeLink("");
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to add video");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex max-w-2xl flex-col gap-8 p-4 pt-0">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold tracking-tight">
          Connect YouTube Video
        </h2>
        <p className="text-muted-foreground">
          Link educational videos from YouTube.
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
                {uploadData?.data.branches.map((b) => (
                  <SelectItem key={b.branch_id} value={b.branchname}>
                    {b.branchname}
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
                {subjectDisplay ? subjectDisplay : "Select Subject..."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
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
                              : "opacity-0",
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
          <Label>Video Name</Label>
          <Input
            placeholder="e.g. Lecture 1 - Introduction"
            value={videoName}
            onChange={(e) => setVideoName(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>YouTube Link</Label>
          <Input
            placeholder="https://youtube.com/watch?v=..."
            value={youtubeLink}
            onChange={(e) => validateLink(e.target.value)}
            className={
              !isValidLink && youtubeLink
                ? "border-red-500 focus-visible:ring-red-500"
                : ""
            }
          />
          {!isValidLink && youtubeLink && (
            <p className="text-xs text-red-500">Invalid YouTube URL</p>
          )}
        </div>

        <div className="flex justify-end">
          <Button type="submit" size="lg" disabled={isUploading}>
            {isUploading ? "Adding Video..." : "Add Video"}
          </Button>
        </div>
      </form>
    </div>
  );
}
