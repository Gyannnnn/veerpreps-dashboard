"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileText, BookOpen, Video } from "lucide-react";
import { motion, useSpring, useTransform } from "framer-motion";
import { useEffect, useState } from "react";
import axios from "axios";
import { StatsRes } from "@/types/stats.type";
import { Skeleton } from "@/components/ui/skeleton";

interface DashboardStats {
  users: number;
  pyqs: number;
  notes: number;
  videos: number;
}

function AnimatedNumber({ value }: { value: number }) {
  let spring = useSpring(0, { bounce: 0, duration: 2000 });
  let display = useTransform(spring, (current) =>
    Math.round(current).toLocaleString(),
  );

  useEffect(() => {
    spring.set(value);
  }, [spring, value]);

  return <motion.span>{display}</motion.span>;
}

export function StatsCards() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await axios.get<StatsRes>(
          "https://veer-preps-api.vercel.app/api/admin/stats",
        );
        if (res.data && res.data.data) {
          setStats(res.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch stats", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchStats();
  }, []);

  const statItems = [
    {
      title: "Total Admins",
      value: stats?.users || 0,
      icon: Users,
      description: "Registered administrators",
      suffix: "",
    },
    {
      title: "Total PYQs",
      value: stats?.pyqs || 0,
      icon: FileText,
      description: "Across all branches",
      suffix: "",
    },
    {
      title: "Total Notes",
      value: stats?.notes || 0,
      icon: BookOpen,
      description: "Lecture notes & materials",
      suffix: "",
    },
    {
      title: "YouTube Lectures",
      value: stats?.videos || 0,
      icon: Video,
      description: "Linked video resources",
      suffix: "",
    },
  ];

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-[100px]" />
              <Skeleton className="h-4 w-4 rounded-full" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-[60px] mb-1" />
              <Skeleton className="h-3 w-[140px]" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statItems.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <AnimatedNumber value={stat.value} />
              {stat.suffix}
            </div>
            <p className="text-xs text-muted-foreground">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
