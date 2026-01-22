import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileQuestion } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background p-4 text-center">
      <div className="rounded-full bg-muted p-6 ring-1 ring-border">
        <FileQuestion className="h-12 w-12 text-muted-foreground" />
      </div>
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">Page not found</h1>
        <p className="text-lg text-muted-foreground">
          The page you are looking for does not exist or has been moved.
        </p>
      </div>
      <Button asChild size="lg" className="gap-2">
        <Link href="/dashboard">Return to Dashboard</Link>
      </Button>
    </div>
  );
}
