"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { ROLE_LABELS } from "@/lib/constants/roles";
import { getInitials } from "@/lib/utils/formatters";
import { LogOut, User } from "lucide-react";
import { Badge } from "../ui/Badge";

export const TopBar: React.FC = () => {
  const router = useRouter();
  const user = useStore((state) => state.user);
  const logout = useStore((state) => state.logout);
  
  const handleLogout = () => {
    logout();
    router.push("/login");
  };
  
  if (!user) return null;
  
  return (
    <header className="h-16 bg-light border-b border-gray-200 flex items-center justify-between px-6 fixed top-0 right-0 left-64 z-10">
      <div className="flex items-center gap-4">
        <h2 className="text-lg font-semibold text-dark">Dashboard</h2>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary text-light rounded-full flex items-center justify-center font-semibold">
            {getInitials(user.name)}
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-dark">{user.name}</span>
            <Badge variant="info" className="text-xs">
              {ROLE_LABELS[user.role]}
            </Badge>
          </div>
        </div>
        
        <button
          onClick={handleLogout}
          className="p-2 hover:bg-gray-100 rounded transition-colors"
          title="Logout"
        >
          <LogOut className="w-5 h-5 text-gray-600" />
        </button>
      </div>
    </header>
  );
};