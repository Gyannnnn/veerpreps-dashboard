import { StatsCards } from "@/components/stats-cards";
import { BranchOverview } from "@/components/branch-overview";
import { Separator } from "@/components/ui/separator";
import { auth } from "@/auth";
import SignInFirst from "@/components/signIn-first";

export default async function DashboardPage() {
  try {
    const session = await auth();
    if (!session?.user) return <SignInFirst />;

    return (
      <div className="flex flex-1 flex-col gap-8 p-4 pt-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight italic">
            Welcome Back {session.name}
          </h1>
          <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">
            Real-time overview of platform content and health.
          </p>
        </div>

        <StatsCards />

        <Separator />

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Branch Overview</h3>
          <p className="text-sm text-muted-foreground">
            Detailed breakdown of uploaded resources per branch.
          </p>
          <BranchOverview />
        </div>
      </div>
    );
  } catch (error) {
    return <h1>Something Went Wrong</h1>;
  }
}
