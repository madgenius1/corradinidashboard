"use client";

import { useStore } from "@/lib/store";
import { MetricCard } from "@/components/charts/MetricCard";
import { Card } from "@/components/ui/Card";
import { formatCurrency, formatDateTime } from "@/lib/utils/formatters";
import { Users, GraduationCap, DollarSign, AlertCircle } from "lucide-react";
import { StudentStatus, PaymentStatus } from "@/types";

export default function AdminOverviewPage() {
  const students = useStore((state) => state.students);
  const teachers = useStore((state) => state.teachers);
  const payments = useStore((state) => state.payments);
  const auditLogs = useStore((state) => state.auditLogs);
  
  const activeStudents = students.filter(
    (s) => s.status === StudentStatus.ACTIVE
  ).length;
  
  const completedPayments = payments.filter(
    (p) => p.status === PaymentStatus.COMPLETED
  );
  
  const totalFeesCollected = completedPayments.reduce(
    (sum, p) => sum + p.amount,
    0
  );
  
  const totalOutstanding = students.reduce(
    (sum, s) => sum + s.feeBalance,
    0
  );
  
  const recentLogs = auditLogs.slice(0, 5);
  
  return (
    <div className="space-y-6">
      <div className="lg:pt-8 py-4">
        <h1 className="text-3xl font-bold text-dark mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Welcome to the school management system</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
        <MetricCard
          title="Total Students"
          value={activeStudents}
          description="Active students"
          icon={<Users className="w-6 h-6" />}
        />
        
        <MetricCard
          title="Total Teachers"
          value={teachers.length}
          description="Active staff"
          icon={<GraduationCap className="w-6 h-6" />}
        />
        
        <MetricCard
          title="Fees Collected"
          value={formatCurrency(totalFeesCollected)}
          description="This term"
          icon={<DollarSign className="w-6 h-6" />}
        />
        
        <MetricCard
          title="Outstanding Balance"
          value={formatCurrency(totalOutstanding)}
          description="Total pending"
          icon={<AlertCircle className="w-6 h-6" />}
        />
      </div>
      
      <Card>
        <h2 className="text-xl font-semibold text-dark mb-4">Recent Activity</h2>
        {recentLogs.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No recent activity</p>
        ) : (
          <div className="space-y-3">
            {recentLogs.map((log) => (
              <div
                key={log.id}
                className="flex items-start gap-3 pb-3 border-b border-gray-100 last:border-0"
              >
                <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                <div className="flex-1">
                  <p className="text-sm text-dark">{log.details}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {log.userName} - {formatDateTime(log.timestamp)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h2 className="text-xl font-semibold text-dark mb-4">Quick Stats</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Classes</span>
              <span className="font-semibold">{useStore.getState().classes.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Payments This Month</span>
              <span className="font-semibold">{completedPayments.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Average Fee Balance</span>
              <span className="font-semibold">
                {formatCurrency(totalOutstanding / students.length || 0)}
              </span>
            </div>
          </div>
        </Card>
        
        <Card>
          <h2 className="text-xl font-semibold text-dark mb-4">System Status</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full" />
              <span className="text-sm">All systems operational</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full" />
              <span className="text-sm">Data last synced: Just now</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full" />
              <span className="text-sm">No pending issues</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}