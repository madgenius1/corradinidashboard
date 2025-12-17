"use client";

import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { Table } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { ExportRequest } from "@/types";
import { formatDateTime } from "@/lib/utils/formatters";
import { Plus } from "lucide-react";

export default function ExportsPage() {
  const router = useRouter();
  const exports = useStore((state) => state.exports);
  
  const columns = [
    {
      header: "Data Type",
      accessor: (row: ExportRequest) => row.dataType.replace(/_/g, " "),
    },
    {
      header: "Format",
      accessor: "format" as keyof ExportRequest,
    },
    {
      header: "Requested By",
      accessor: "requestedBy" as keyof ExportRequest,
    },
    {
      header: "Status",
      accessor: (row: ExportRequest) => (
        <Badge
          variant={
            row.status === "APPROVED"
              ? "success"
              : row.status === "REJECTED"
              ? "danger"
              : "warning"
          }
        >
          {row.status}
        </Badge>
      ),
    },
    {
      header: "Created",
      accessor: (row: ExportRequest) => formatDateTime(row.createdAt),
    },
  ];
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-dark mb-2">Exports</h1>
          <p className="text-gray-600">Manage data export requests</p>
        </div>
        <Button
          onClick={() => router.push("/dashboard/admin/exports/request")}
        >
          <Plus className="w-4 h-4 mr-2" />
          New Export Request
        </Button>
      </div>
      
      <Card>
        <Table
          columns={columns}
          data={exports}
          onRowClick={(exportReq) =>
            router.push(`/dashboard/admin/exports/${exportReq.id}`)
          }
          emptyMessage="No export requests yet"
        />
      </Card>
    </div>
  );
}