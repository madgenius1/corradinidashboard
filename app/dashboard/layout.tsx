"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const user = useStore((state) => state.user);
  
  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);
  
  if (!user) {
    return null;
  }
  
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-64">
        <TopBar />
        <main className="pt-16 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}