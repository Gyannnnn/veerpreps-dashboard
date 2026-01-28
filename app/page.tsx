"use client"

import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowRight, ShieldCheck, Zap, Database } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground selection:bg-primary/10">
      
      {/* Navbar Placeholder - Minimal */}
      <header className="flex items-center justify-between p-6 md:px-12">
        <div className="text-xl font-bold tracking-tighter">IITKirba.xyz</div>
        <nav>
          <Button variant="ghost" asChild>
            <Link href="/login">Admin Login</Link>
          </Button>
        </nav>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center px-4 text-center">
        
        {/* Anti-gravity Hero */}
        <div className="max-w-3xl space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-4"
          >
            <div className="inline-flex items-center rounded-full border border-border bg-muted/50 px-3 py-1 text-xs font-medium backdrop-blur-sm">
              <span className="mr-2 h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              System Operational
            </div>
            
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl md:text-7xl bg-gradient-to-br from-foreground to-muted-foreground bg-clip-text text-transparent pb-2">
              Academic Resource <br /> Control Center
            </h1>
            
            <p className="mx-auto max-w-[600px] text-lg text-muted-foreground md:text-xl">
              Secure admin portal for managing VSSUT Burla's academic repository. 
              Upload notes, PYQs, and lectures with zero friction.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
          >
            <Button size="lg" className="h-12 min-w-[150px] gap-2 rounded-full text-base" asChild>
              <Link href="/login">
                Access Portal <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="h-12 min-w-[150px] rounded-full text-base" asChild>
              <Link href="https://veerpreps.com" target="_blank">
                Visit Student Site
              </Link>
            </Button>
          </motion.div>
        </div>

        {/* Feature Grid - Minimal */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
          className="mt-24 grid gap-8 text-left md:grid-cols-3 md:gap-16 max-w-5xl"
        >
          <div className="space-y-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/5 text-primary">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h3 className="font-semibold">Secure Access</h3>
            <p className="text-sm text-muted-foreground">
              Encrypted admin credentials required. Restricted to core team members only.
            </p>
          </div>
          <div className="space-y-2">
             <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/5 text-primary">
              <Database className="h-5 w-5" />
            </div>
            <h3 className="font-semibold">Central Repository</h3>
            <p className="text-sm text-muted-foreground">
              Unified storage for PYQs, Lecture Notes, and Video tutorials across all branches.
            </p>
          </div>
          <div className="space-y-2">
             <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/5 text-primary">
              <Zap className="h-5 w-5" />
            </div>
            <h3 className="font-semibold">High Performance</h3>
            <p className="text-sm text-muted-foreground">
              Optimized for speed. Uploads and content management in milliseconds.
            </p>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="py-8 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} IITKirba.xyz. Internal Tool.</p>
      </footer>
    </div>
  )
}
