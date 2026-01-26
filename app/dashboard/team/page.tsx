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
    branch: "IT",
    batch: "2027",
    avatar: "/avatars/gyan.jpg",
    email: "hi.gyanaranjanpatra@gmai.com",
    github: "https://github.com/gyannnnn",
    linkedin: "https://www.linkedin.com/in/higyan/",
  },
  {
    name: "Rahul Patra",
    role: "Admin",
    branch: "ETC 28",
    batch: "2028",
    avatar: "/images/admins/rahul.jpeg",
    email: "kanhapatra801@gmail.com",
    linkedin: "https://www.linkedin.com/in/rahulfullstackpatra/",
  },
  {
    name: "ALOK KUMAR SAHU",
    role: "Admin",
    branch: "CSE",
    batch: "2028",
    avatar: "/images/admins/alokcse.jpeg",
    email: "alok.vssut28@gmail.com",
    linkedin: "https://www.linkedin.com/in/alok-kumar-sahu-7a7059370/?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
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
