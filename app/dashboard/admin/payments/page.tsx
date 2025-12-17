"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { Table } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Payment } from "@/types";
import { formatCurrency, formatDate } from "@/lib/utils/formatters";
import { Plus, Search } from "lucide-react";

export default function PaymentsPage() {
  const router = useRouter();
  const payments = useStore((state) => state.payments);
  const students = useStore((state) => state.students);
  const [searchTerm, setSearchTerm] = useState("");
  
  const getStudentName = (studentId: string) => {
    const student = students.find((s) => s.id === studentId);
    return student?.name || "Unknown";
  };
  
  const filteredPayments = payments.filter((payment) => {
    const studentName = getStudentName(payment.studentId);
    return (
      studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.receiptNo.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });
  
  const columns = [
    {
      header: "Receipt No",
      accessor: "receiptNo" as keyof Payment,
    },
    {
      header: "Student",
      accessor: (row: Payment) => getStudentName(row.studentId),
    },
    {
      header: "Amount",
      accessor: (row: Payment) => formatCurrency(row.amount),
    },
    {
      header: "Method",
      accessor: (row: Payment) => (
        <Badge variant="info">{row.method}</Badge>
      ),
    },
    {
      header: "Date",
      accessor: (row: Payment) => formatDate(row.date),
    },
    {
      header: "Status",
      accessor: (row: Payment) => (
        <Badge
          variant={
            row.status === "COMPLETED"
              ? "success"
              : row.status === "PENDING"
              ? "warning"
              : "danger"
          }
        >
          {row.status}
        </Badge>
      ),
    },
  ];
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-dark mb-2">Payments</h1>
          <p className="text-gray-600">Track fee payments</p>
        </div>
        <Button
          onClick={() => router.push("/dashboard/admin/payments/add")}
        >
          <Plus className="w-4 h-4 mr-2" />
          Record Payment
        </Button>
      </div>
      
      <Card>
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Search by student name or receipt number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <Table
          columns={columns}
          data={filteredPayments.sort((a, b) => 
            new Date(b.date).getTime() - new Date(a.date).getTime()
          )}
          emptyMessage="No payments recorded yet"
        />
      </Card>
    </div>
  );
}