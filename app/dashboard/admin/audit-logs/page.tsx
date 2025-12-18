"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import { Table } from "@/components/ui/Table";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { AuditLog } from "@/types";
import { formatDateTime } from "@/lib/utils/formatters";
import { Search } from "lucide-react";

export default function AuditLogsPage() {
  const auditLogs = useStore((state) => state.auditLogs);
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredLogs = auditLogs.filter((log) =>
    log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.details.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const columns = [
    {
      header: "User",
      accessor: "userName" as keyof AuditLog,
    },
    {
      header: "Action",
      accessor: (row: AuditLog) => (
        <Badge
          variant={
            row.action === "CREATE"
              ? "success"
              : row.action === "UPDATE"
              ? "info"
              : row.action === "DELETE"
              ? "danger"
              : "default"
          }
        >
          {row.action}
        </Badge>
      ),
    },
    {
      header: "Entity",
      accessor: "entity" as keyof AuditLog,
    },
    {
      header: "Details",
      accessor: "details" as keyof AuditLog,
      className: "max-w-md truncate",
    },
    {
      header: "Timestamp",
      accessor: (row: AuditLog) => formatDateTime(row.timestamp),
    },
  ];
  
  return (
    <div className="space-y-6">
      <div className="lg:pt-8 py-4">
        <h1 className="text-3xl font-bold text-dark mb-2">Audit Logs</h1>
        <p className="text-gray-600">System activity history</p>
      </div>
      
      <Card className="bg-yellow-50 border-yellow-200">
        <p className="text-sm text-yellow-800">
          <strong>Demo Mode:</strong> Audit logs are automatically generated based on your 
          interactions within the system. In production, these would be stored securely 
          with additional metadata like IP addresses.
        </p>
      </Card>
      
      <Card>
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Search logs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <Table
          columns={columns}
          data={filteredLogs}
          emptyMessage="No audit logs available"
        />
      </Card>
    </div>
  );
}