"use client";

import { useStore } from "@/lib/store";
import { Card } from "@/components/ui/Card";
import { Table } from "@/components/ui/Table";
import { formatCurrency } from "@/lib/utils/formatters";
import { Class } from "@/types";

export default function FeesPage() {
  const classes = useStore((state) => state.classes);
  
  const feeData = classes.map((classObj) => ({
    id: classObj.id,
    className: classObj.name,
    tuitionFee: 25000,
    boardingFee: classObj.type === "UPPER" ? 15000 : 0,
    examFee: 5000,
    activityFee: 3000,
    totalFee: 25000 + (classObj.type === "UPPER" ? 15000 : 0) + 5000 + 3000,
  }));
  
  const columns = [
    {
      header: "Class",
      accessor: "className" as keyof typeof feeData[0],
    },
    {
      header: "Tuition Fee",
      accessor: (row: typeof feeData[0]) => formatCurrency(row.tuitionFee),
    },
    {
      header: "Boarding Fee",
      accessor: (row: typeof feeData[0]) => formatCurrency(row.boardingFee),
    },
    {
      header: "Exam Fee",
      accessor: (row: typeof feeData[0]) => formatCurrency(row.examFee),
    },
    {
      header: "Activity Fee",
      accessor: (row: typeof feeData[0]) => formatCurrency(row.activityFee),
    },
    {
      header: "Total",
      accessor: (row: typeof feeData[0]) => (
        <span className="font-semibold">{formatCurrency(row.totalFee)}</span>
      ),
    },
  ];
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-dark mb-2">Fee Structure</h1>
        <p className="text-gray-600">View and manage school fees</p>
      </div>
      
      <Card className="bg-yellow-50 border-yellow-200">
        <p className="text-sm text-yellow-800">
          <strong>Note:</strong> In this demo, fee structures are displayed with sample values. 
          In production, these would be fully editable and stored in the database.
        </p>
      </Card>
      
      <Card>
        <Table
          columns={columns}
          data={feeData}
          emptyMessage="No fee structures configured"
        />
      </Card>
    </div>
  );
}