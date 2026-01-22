import { useState, useEffect } from "react"
import { BookOpen, Loader2 } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { addSubject, getSubjects } from "@/app/actions"

interface ManageSubjectsDialogProps {
  branchName: string
}

export function ManageSubjectsDialog({ branchName }: ManageSubjectsDialogProps) {
  const [open, setOpen] = useState(false)
  const [yearId, setYearId] = useState("")
  const [subjectName, setSubjectName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [existingSubjects, setExistingSubjects] = useState<string[]>([])
  const [isLoadingSubjects, setIsLoadingSubjects] = useState(false)

  useEffect(() => {
    if (yearId) {
      fetchSubjects()
    } else {
      setExistingSubjects([])
    }
  }, [yearId])

  const fetchSubjects = async () => {
    if (!yearId) return
    setIsLoadingSubjects(true)
    try {
      const subjects = await getSubjects(branchName, yearId)
      setExistingSubjects(subjects)
    } catch (error) {
      console.error("Failed to fetch subjects", error)
    } finally {
      setIsLoadingSubjects(false)
    }
  }

  const handleAddSubject = async () => {
    if (!yearId || !subjectName) return

    setIsLoading(true)
    try {
      const result = await addSubject(yearId, subjectName, branchName)
      
      if (result.success) {
        toast.success(result.message)
        setSubjectName("")
        // Refresh the list
        fetchSubjects() 
      } else {
        toast.error("Failed to add subject")
      }
    } catch (error) {
      console.error(error)
      toast.error("Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <BookOpen className="h-4 w-4" />
          Manage Subjects
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Manage Subjects</DialogTitle>
          <DialogDescription>
            Add new subjects to {branchName} curriculum.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="grid gap-4">
             <div className="grid gap-2">
                <Label htmlFor="year">Select Year</Label>
                <Select value={yearId} onValueChange={setYearId}>
                  <SelectTrigger id="year">
                    <SelectValue placeholder="Select Year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="First Year">First Year</SelectItem>
                    <SelectItem value="Second Year">Second Year</SelectItem>
                    <SelectItem value="Pre-final Year">Pre-final Year</SelectItem>
                    <SelectItem value="Final Year">Final Year</SelectItem>
                  </SelectContent>
                </Select>
             </div>
             
             {yearId && (
                <div className="grid gap-2">
                    <Label>Existing Subjects ({existingSubjects.length})</Label>
                    <div className="rounded-md border p-4 bg-muted/50 h-[150px] overflow-y-auto">
                        {isLoadingSubjects ? (
                            <div className="flex h-full items-center justify-center">
                                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                            </div>
                        ) : existingSubjects.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                                {existingSubjects.map((sub, i) => (
                                    <Badge key={i} variant="secondary">{sub}</Badge>
                                ))}
                            </div>
                        ) : (
                            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                                No subjects found for this year.
                            </div>
                        )}
                    </div>
                </div>
             )}

            <div className="grid gap-2">
                <Label htmlFor="subject">Add New Subject</Label>
                <div className="flex gap-2">
                    <Input
                    id="subject"
                    placeholder="Subject Name"
                    value={subjectName}
                    onChange={(e) => setSubjectName(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            handleAddSubject()
                        }
                    }}
                    />
                    <Button onClick={handleAddSubject} disabled={isLoading || !yearId || !subjectName}>
                        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Add"}
                    </Button>
                </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
