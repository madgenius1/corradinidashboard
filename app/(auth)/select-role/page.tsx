"use client";

import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { Role } from "@/types";
import { ROLE_LABELS, ROLE_DESCRIPTIONS, isAdmin } from "@/lib/constants/roles";
import { Card } from "@/components/ui/Card";
import { generateId } from "@/lib/utils/generators";

const TEST_ACCOUNTS = {
  [Role.PRINCIPAL]: {
    email: "principal@school.com",
    password: "principal123",
  },
  [Role.BURSAR]: {
    email: "bursar@school.com",
    password: "bursar123",
  },
  [Role.HEAD_OF_STUDIES]: {
    email: "hos@school.com",
    password: "hos123",
  },
  [Role.TEACHER]: {
    email: "teacher@school.com",
    password: "teacher123",
  },
};

export default function SelectRolePage() {
  const router = useRouter();
  const setUser = useStore((state) => state.setUser);
  
  const handleRoleSelect = (role: Role) => {
    const account = TEST_ACCOUNTS[role];
    
    setUser({
      id: generateId(),
      name: ROLE_LABELS[role],
      email: account.email,
      role,
    });
    
    if (isAdmin(role)) {
      router.push("/dashboard/admin/overview");
    } else {
      router.push("/dashboard/teacher/overview");
    }
  };
  
  const roles = [
    Role.PRINCIPAL,
    Role.BURSAR,
    Role.HEAD_OF_STUDIES,
    Role.TEACHER,
  ];
  
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-dark mb-2">Select Your Role</h1>
        <p className="text-gray-600">Choose a role to explore the system</p>
      </div>
      
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-sm text-yellow-800 text-center">
          <strong>Demo Mode:</strong> In production, this step will be replaced by real authentication and permissions.
        </p>
      </div>
      
      <div className="grid gap-4">
        {roles.map((role) => {
          const account = TEST_ACCOUNTS[role];
          
          return (
            <Card
              key={role}
              className="cursor-pointer hover:shadow-lg transition-shadow"
              padding="lg"
            >
              <button
                onClick={() => handleRoleSelect(role)}
                className="w-full text-left"
              >
                <h3 className="text-lg font-semibold text-dark mb-1">
                  {ROLE_LABELS[role]}
                </h3>
                <p className="text-gray-600 text-sm mb-3">
                  {ROLE_DESCRIPTIONS[role]}
                </p>
                <div className="text-xs text-gray-500 space-y-1">
                  <p>Test Email: {account.email}</p>
                  <p>Test Password: {account.password}</p>
                </div>
              </button>
            </Card>
          );
        })}
      </div>
    </div>
  );
}