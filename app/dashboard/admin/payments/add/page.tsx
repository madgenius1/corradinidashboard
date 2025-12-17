"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { PaymentMethod, PaymentStatus, AuditAction, AuditEntity } from "@/types";
import { generateId, generateReceiptNumber } from "@/lib/utils/generators";
import { ArrowLeft } from "lucide-react";

export default function AddPaymentPage() {
  const router = useRouter();
  const addPayment = useStore((state) => state.addPayment);
  const updateStudent = useStore((state) => state.updateStudent);
  const addAuditLog = useStore((state) => state.addAuditLog);
  const students = useStore((state) => state.students);
  const user = useStore((state) => state.user);
  
  const [formData, setFormData] = useState({
    studentId: students[0]?.id || "",
    amount: "",
    method: PaymentMethod.CASH,
    description: "",
  });
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const student = students.find((s) => s.id === formData.studentId);
    if (!student) return;
    
    const payment = {
      id: generateId(),
      studentId: formData.studentId,
      amount: parseFloat(formData.amount),
      method: formData.method,
      status: PaymentStatus.COMPLETED,
      date: new Date().toISOString(),
      receiptNo: generateReceiptNumber(),
      description: formData.description || "Fee payment",
      recordedBy: user?.name || "Admin",
    };
    
    addPayment(payment);
    
    const newBalance = Math.max(0, student.feeBalance - payment.amount);
    updateStudent(student.id, { feeBalance: newBalance });
    
    if (user) {
      addAuditLog({
        id: generateId(),
        userId: user.id,
        userName: user.name,
        action: AuditAction.CREATE,
        entity: AuditEntity.PAYMENT,
        entityId: payment.id,
        details: `Recorded payment of ${payment.amount} for ${student.name}`,
        timestamp: new Date().toISOString(),
      });
    }
    
    router.push("/dashboard/admin/payments");
  };
  
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  
  const selectedStudent = students.find((s) => s.id === formData.studentId);
  
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-dark mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Payments
        </button>
        <h1 className="text-3xl font-bold text-dark mb-2">Record Payment</h1>
        <p className="text-gray-600">Enter payment details</p>
      </div>
      
      {selectedStudent && (
        <Card className="bg-yellow-50 border-yellow-200">
          <div className="space-y-2">
            <h3 className="font-semibold text-dark">Student Information</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-gray-600">Name:</span>{" "}
                <span className="font-medium">{selectedStudent.name}</span>
              </div>
              <div>
                <span className="text-gray-600">Outstanding Balance:</span>{" "}
                <span className="font-medium text-danger">
                  KES {selectedStudent.feeBalance.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </Card>
      )}
      
      <Card>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Select
            label="Student"
            name="studentId"
            value={formData.studentId}
            onChange={handleChange}
            options={students.map((s) => ({
              value: s.id,
              label: `${s.name} (${s.admissionNo})`,
            }))}
            required
          />
          
          <Input
            label="Amount (KES)"
            name="amount"
            type="number"
            min="0"
            step="0.01"
            value={formData.amount}
            onChange={handleChange}
            required
          />
          
          <Select
            label="Payment Method"
            name="method"
            value={formData.method}
            onChange={handleChange}
            options={[
              { value: PaymentMethod.CASH, label: "Cash" },
              { value: PaymentMethod.MPESA, label: "M-Pesa" },
              { value: PaymentMethod.BANK_TRANSFER, label: "Bank Transfer" },
              { value: PaymentMethod.CHEQUE, label: "Cheque" },
            ]}
            required
          />
          
          <Input
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="e.g., Term 1 fees"
          />
          
          <div className="flex gap-4">
            <Button type="submit">Record Payment</Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}