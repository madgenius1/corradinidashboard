"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { isAdmin } from "@/lib/constants/roles";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const user = useStore((state) => state.user);
  
  useEffect(() => {
    if (user && !isAdmin(user.role)) {
      router.push("/dashboard/teacher/overview");
    }
  }, [user, router]);
  
  if (!user || !isAdmin(user.role)) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-danger mb-2">Access Denied</h2>
          <p className="text-gray-600">You do not have permission to access this area.</p>
        </div>
      </div>
    );
  }
  
  return <>{children}</>;
}