"use client";
import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileUploader } from "@/components/file-uploader";
import { createBranchAction } from "@/app/api/actions/upload";
import { BranchRes } from "@/types/stats.type";
import { Skeleton } from "@/components/ui/skeleton";

interface Branch {
  branch_id: number;
  branchname: string;
  displayimage: string;
  branchcode: string;
  _count?: {
    // You might need to update your backend getallbranch to include these counts
    // or fetch them separately. For now, we'll gracefully fallback or hide them.
    pyqs?: number;
    notes?: number;
    videos?: number; // Adjust based on your prisma schema relations
  };
}

export function BranchOverview() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [newBranchName, setNewBranchName] = useState("");
  const [newBranchCode, setNewBranchCode] = useState("");
  const [newBranchImage, setNewBranchImage] = useState<File | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchBranches() {
      try {
        const res = await axios.get<BranchRes>(
          "https://veer-preps-api.vercel.app/api/branch",
        );
        if (res.data && res.data.branches) {
          setBranches(res.data.branches);
        }
      } catch (error) {
        console.error("Failed to fetch branches", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchBranches();
  }, []);

  const handleAddBranch = async () => {
    if (!newBranchName || !newBranchCode || !newBranchImage) {
      toast.error("Please fill all fields and upload an image");
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("branchname", newBranchName);
      formData.append("branchcode", newBranchCode);
      formData.append("image", newBranchImage);

      await createBranchAction(formData);

      toast.success("Branch created successfully!");
      setNewBranchName("");
      setNewBranchCode("");
      setNewBranchImage(null);
      setIsDialogOpen(false);

      // Refresh branches
      const res = await axios.get<BranchRes>(
        "https://veer-preps-api.vercel.app/api/branch",
      );
      if (res.data && res.data.branches) {
        setBranches(res.data.branches);
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Failed to create branch");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {isLoading ? (
        // Render Skeletons while loading
        [...Array(6)].map((_, i) => (
          <Card key={i} className="overflow-hidden h-full">
            <Skeleton className="h-48 w-full" />
            <CardContent className="pt-4 space-y-2">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-full" />
            </CardContent>
          </Card>
        ))
      ) : (
        <>
          {branches.map((branch) => (
            <Link
              key={branch.branch_id}
              href={`/dashboard/branch/${encodeURIComponent(branch.branchname)}`}
              className="block"
            >
              <Card className="group relative h-[280px] w-full overflow-hidden border-0 bg-transparent ring-1 ring-border shadow-md transition-shadow hover:shadow-xl">
                {/* Background Image */}
                <Image
                  src={branch.displayimage}
                  alt={branch.branchname}
                  fill
                  unoptimized
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                {/* Content Overlay */}
                <div className="absolute bottom-0 w-full p-5 text-white">
                  <div className="transform transition-transform duration-300 group-hover:-translate-y-1">
                    <p className="mb-1 text-xs font-medium uppercase tracking-wider text-primary-foreground/80">
                      Code: {branch.branchcode}
                    </p>
                    <h3 className="line-clamp-2 text-xl font-bold leading-tight tracking-tight">
                      {branch.branchname}
                    </h3>
                  </div>
                </div>
              </Card>
            </Link>
          ))}

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Card className="group flex h-[280px] cursor-pointer flex-col items-center justify-center border-dashed border-2 bg-muted/30 transition-colors hover:border-primary hover:bg-muted/50">
                <div className="flex flex-col items-center gap-3 text-muted-foreground transition-colors group-hover:text-primary">
                  <div className="rounded-full bg-background p-4 shadow-sm ring-1 ring-border group-hover:ring-primary">
                    <Plus className="h-8 w-8" />
                  </div>
                  <span className="text-lg font-medium">Add Branch</span>
                </div>
              </Card>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Branch</DialogTitle>
                <DialogDescription>
                  Create a new space for a department.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Branch Name</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Aerospace Engineering"
                    value={newBranchName}
                    onChange={(e) => setNewBranchName(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="code">Branch Code</Label>
                  <Input
                    id="code"
                    placeholder="e.g., AE"
                    value={newBranchCode}
                    onChange={(e) => setNewBranchCode(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Thumbnail Image</Label>
                  <FileUploader
                    accept={{ "image/*": [".png", ".jpg", ".jpeg", ".webp"] }}
                    maxSize={5 * 1024 * 1024}
                    onUpload={async (file) => {
                      setNewBranchImage(file);
                      return Promise.resolve();
                    }}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleAddBranch} disabled={isSubmitting}>
                  {isSubmitting ? "Creating..." : "Create Branch"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  );
}
