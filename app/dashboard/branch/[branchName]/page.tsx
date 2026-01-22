"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { FileText, Search, Trash2, Filter, ArrowUpDown, Eye } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ManageSubjectsDialog } from "@/components/manage-subjects-dialog"


// Mock Data
// Using the same demo PDF for all resources as requested
const DEMO_PDF_URL = "/ise assignment.pdf"

const initialResources = [
  { id: "1", name: "Engineering Mathematics I - 2023.pdf", subject: "Maths", year: "2023", type: "PYQ", size: "2.4 MB", date: "2023-12-10", url: DEMO_PDF_URL },
  { id: "2", name: "Physics Unit 1 Notes.pdf", subject: "Physics", year: "2024", type: "Notes", size: "1.2 MB", date: "2024-01-15", url: DEMO_PDF_URL },
  { id: "3", name: "Basic Electrical Engineering - 2022.pdf", subject: "Electrical", year: "2022", type: "PYQ", size: "3.1 MB", date: "2023-11-05", url: DEMO_PDF_URL },
  { id: "4", name: "Chemistry Lab Manual.pdf", subject: "Chemistry", year: "2024", type: "Notes", size: "4.5 MB", date: "2024-02-01", url: DEMO_PDF_URL },
  { id: "5", name: "Programming in C - Mid Sem.pdf", subject: "Programming", year: "2023", type: "PYQ", size: "1.8 MB", date: "2023-10-20", url: DEMO_PDF_URL },
  { id: "6", name: "Engineering Graphics Sheets.pdf", subject: "Graphics", year: "2024", type: "Notes", size: "15.2 MB", date: "2024-01-28", url: DEMO_PDF_URL },
]

export default function BranchDetailsPage() {
  const params = useParams()
  const branchName = decodeURIComponent(params.branchName as string)

  const [resources, setResources] = useState(initialResources)
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [yearFilter, setYearFilter] = useState("all")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  
  // Preview State
  const [previewResource, setPreviewResource] = useState<{name: string, url: string} | null>(null)

  // Filter Logic
  const filteredResources = resources.filter((resource) => {
    const matchesSearch = resource.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          resource.subject.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = typeFilter === "all" || resource.type.toLowerCase() === typeFilter
    const matchesYear = yearFilter === "all" || resource.year === yearFilter

    return matchesSearch && matchesType && matchesYear
  }).sort((a, b) => {
    return sortOrder === "asc" 
      ? a.year.localeCompare(b.year) 
      : b.year.localeCompare(a.year)
  })

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this file?")) {
      setResources(resources.filter(r => r.id !== id))
    }
  }

  // Derived options for filters
  const years = Array.from(new Set(resources.map(r => r.year))).sort().reverse()

  return (
    <div className="flex flex-1 flex-col gap-8 p-4 pt-0">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">{branchName}</h2>
            <p className="text-muted-foreground">Manage resources for {branchName} department.</p>
          </div>
        </div>
        
        <Separator />

        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex w-full sm:w-auto items-center gap-2">
              <div className="relative w-full sm:w-[300px]">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search files or subjects..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex w-full sm:w-auto items-center gap-2">
               <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[130px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="pyq">PYQs</SelectItem>
                  <SelectItem value="notes">Notes</SelectItem>
                </SelectContent>
              </Select>

              <Select value={yearFilter} onValueChange={setYearFilter}>
                <SelectTrigger className="w-[130px]">
                  <span className="mr-2 text-muted-foreground">Year:</span>
                  <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Years</SelectItem>
                  {years.map(year => (
                    <SelectItem key={year} value={year}>{year}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                title="Sort by Year"
              >
                <ArrowUpDown className="h-4 w-4" />
              </Button>
              <ManageSubjectsDialog branchName={branchName} />
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Resources ({filteredResources.length})</CardTitle>
              <CardDescription>
                List of all uploaded documents.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>File Name</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Year</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredResources.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
                        No resources found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredResources.map((resource) => (
                      <TableRow key={resource.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-blue-500" />
                            {resource.name}
                          </div>
                        </TableCell>
                        <TableCell>{resource.subject}</TableCell>
                        <TableCell>
                          <Badge variant={resource.type === "PYQ" ? "secondary" : "outline"}>
                            {resource.type}
                          </Badge>
                        </TableCell>
                        <TableCell>{resource.year}</TableCell>
                        <TableCell className="text-muted-foreground">{resource.size}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 text-blue-500 hover:text-blue-600 hover:bg-blue-50"
                              onClick={() => setPreviewResource(resource)}
                              title="Preview PDF"
                            >
                              <Eye className="h-4 w-4" />
                              <span className="sr-only">View</span>
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                              onClick={() => handleDelete(resource.id)}
                              title="Delete File"
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Delete</span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <Dialog open={!!previewResource} onOpenChange={(open) => !open && setPreviewResource(null)}>
          <DialogContent className="w-[90vw] max-w-none h-[90vh] p-0 overflow-hidden">
            <DialogHeader className="p-4 border-b">
              <DialogTitle>{previewResource?.name}</DialogTitle>
            </DialogHeader>
            <div className="flex-1 h-full w-full bg-muted">
              {previewResource && (
                <iframe 
                  src={previewResource.url} 
                  className="w-full h-[calc(90vh-60px)]"
                  title="PDF Preview"
                />
              )}
            </div>
          </DialogContent>
        </Dialog>
    </div>
  )
}
