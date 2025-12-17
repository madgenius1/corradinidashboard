"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useStore, initializeStore } from "@/lib/store";
import { isAdmin } from "@/lib/constants/roles";

export default function HomePage() {
  const router = useRouter();
  const user = useStore((state) => state.user);
  
  useEffect(() => {
    initializeStore();
    
    if (!user) {
      router.push("/login");
    } else {
      if (isAdmin(user.role)) {
        router.push("/dashboard/admin/overview");
      } else {
        router.push("/dashboard/teacher/overview");
      }
    }
  }, [user, router]);
  
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-2">Loading...</h1>
        <p className="text-gray-600">Redirecting to dashboard</p>
      </div>
    </div>
  );
}