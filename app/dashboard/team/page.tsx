import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Mail, Github, Linkedin } from "lucide-react"
import Link from "next/link"

const team = [
  {
    name: "Gyananjan",
    role: "Lead Developer",
    branch: "CSE",
    batch: "2026",
    avatar: "/avatars/gyan.jpg",
    email: "gyan@example.com",
    github: "github.com/gyan",
    linkedin: "linkedin.com/in/gyan",
  },
  {
    name: "Aditya",
    role: "UI/UX Designer",
    branch: "IT",
    batch: "2026",
    avatar: "/avatars/adi.jpg",
    email: "aditya@example.com",
    linkedin: "linkedin.com/in/aditya",
  },
  {
    name: "Rahul",
    role: "Content Manager",
    branch: "ECE",
    batch: "2025",
    avatar: "/avatars/rahul.jpg",
    email: "rahul@example.com",
  },
  {
    name: "Priya",
    role: "Backend Dev",
    branch: "CSE",
    batch: "2027",
    avatar: "/avatars/priya.jpg",
    email: "priya@example.com",
    github: "github.com/priya",
  },
]

export default function TeamPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold tracking-tight">Team</h2>
        <p className="text-muted-foreground">
          The minds behind IITKirba.xyz.
        </p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {team.map((member) => (
          <Card key={member.name} className="overflow-hidden">
            <CardHeader className="flex flex-row items-center gap-4 pb-2">
              <Avatar className="h-12 w-12">
                <AvatarImage src={member.avatar} alt={member.name} />
                <AvatarFallback>{member.name.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <CardTitle className="text-base">{member.name}</CardTitle>
                <CardDescription>{member.role}</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2 text-sm text-muted-foreground">
                <div className="flex items-center justify-between">
                  <span>Branch:</span>
                  <span className="font-medium text-foreground">{member.branch}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Batch:</span>
                  <span className="font-medium text-foreground">{member.batch}</span>
                </div>
                
                <div className="mt-4 flex items-center gap-4 text-foreground">
                  {member.email && (
                    <Link href={`mailto:${member.email}`} className="hover:text-primary">
                      <Mail className="h-4 w-4" />
                      <span className="sr-only">Email</span>
                    </Link>
                  )}
                  {member.github && (
                    <Link href={`https://${member.github}`} className="hover:text-primary">
                      <Github className="h-4 w-4" />
                      <span className="sr-only">GitHub</span>
                    </Link>
                  )}
                  {member.linkedin && (
                    <Link href={`https://${member.linkedin}`} className="hover:text-primary">
                      <Linkedin className="h-4 w-4" />
                      <span className="sr-only">LinkedIn</span>
                    </Link>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
