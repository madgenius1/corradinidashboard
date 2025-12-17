"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { isAdmin } from "@/lib/constants/roles";

export default function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const user = useStore((state) => state.user);
  
  useEffect(() => {
    if (user && isAdmin(user.role)) {
      router.push("/dashboard/admin/overview");
    }
  }, [user, router]);
  
  return <>{children}</>;
}