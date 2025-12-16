"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useStore } from "@/lib/store";
import { isAdmin } from "@/lib/constants/roles";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  School,
  DollarSign,
  CreditCard,
  FileDown,
  FileText,
  BookOpen,
  ClipboardCheck,
} from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const user = useStore((state) => state.user);
  
  if (!user) return null;
  
  const adminNavItems: NavItem[] = [
    {
      label: "Overview",
      href: "/dashboard/admin/overview",
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      label: "Students",
      href: "/dashboard/admin/students",
      icon: <Users className="w-5 h-5" />,
    },
    {
      label: "Teachers",
      href: "/dashboard/admin/teachers",
      icon: <GraduationCap className="w-5 h-5" />,
    },
    {
      label: "Classes",
      href: "/dashboard/admin/classes",
      icon: <School className="w-5 h-5" />,
    },
    {
      label: "Fees",
      href: "/dashboard/admin/fees",
      icon: <DollarSign className="w-5 h-5" />,
    },
    {
      label: "Payments",
      href: "/dashboard/admin/payments",
      icon: <CreditCard className="w-5 h-5" />,
    },
    {
      label: "Exports",
      href: "/dashboard/admin/exports",
      icon: <FileDown className="w-5 h-5" />,
    },
    {
      label: "Audit Logs",
      href: "/dashboard/admin/audit-logs",
      icon: <FileText className="w-5 h-5" />,
    },
  ];
  
  const teacherNavItems: NavItem[] = [
    {
      label: "Overview",
      href: "/dashboard/teacher/overview",
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      label: "My Classes",
      href: "/dashboard/teacher/classes",
      icon: <School className="w-5 h-5" />,
    },
    {
      label: "Attendance",
      href: "/dashboard/teacher/classes",
      icon: <ClipboardCheck className="w-5 h-5" />,
    },
    {
      label: "Grades",
      href: "/dashboard/teacher/classes",
      icon: <BookOpen className="w-5 h-5" />,
    },
  ];
  
  const navItems = isAdmin(user.role) ? adminNavItems : teacherNavItems;
  
  return (
    <aside className="w-64 bg-dark text-light h-screen flex flex-col fixed left-0 top-0">
      <div className="p-6 border-b border-gray-700">
        <h1 className="text-xl font-bold">School MS</h1>
      </div>
      
      <nav className="flex-1 overflow-y-auto py-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-6 py-3 transition-colors ${
                isActive
                  ? "bg-primary text-light"
                  : "text-gray-300 hover:bg-gray-800 hover:text-light"
              }`}
            >
              {item.icon}
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};