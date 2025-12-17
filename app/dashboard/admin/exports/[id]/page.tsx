"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useStore } from "@/lib/store";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { formatDateTime } from "@/lib/utils/formatters";
import { ExportStatus, AuditAction, AuditEntity } from "@/types";
import { generateId } from "@/lib/utils/generators";
import { ArrowLeft, Download, CheckCircle, XCircle } from "lucide-react";

export default function ExportDetailPage() {
  const router = useRouter();
  const params = useParams();
  const exportId = params.id as string;
  
  const getExportById = useStore((state) => state.getExportById);
  const approveExport = useStore((state) => state.approveExport);
  const rejectExport = useStore((state) => state.rejectExport);
  const addAuditLog = useStore((state) => state.addAuditLog);
  const getStudentById = useStore((state) => state.getStudentById);
  const getClassById = useStore((state) => state.getClassById);
  const user = useStore((state) => state.user);
  
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  
  const exportRequest = getExportById(exportId);
  
  if (!exportRequest) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-dark mb-2">Export Not Found</h2>
          <p className="text-gray-600 mb-4">The export request you're looking for doesn't exist.</p>
          <Button onClick={() => router.push("/dashboard/admin/exports")}>
            Back to Exports
          </Button>
        </div>
      </div>
    );
  }
  
  const handleApprove = () => {
    approveExport(exportRequest.id, user?.name || "Admin");
    
    if (user) {
      addAuditLog({
        id: generateId(),
        userId: user.id,
        userName: user.name,
        action: AuditAction.UPDATE,
        entity: AuditEntity.EXPORT,
        entityId: exportRequest.id,
        details: `Approved export request for ${exportRequest.dataType}`,
        timestamp: new Date().toISOString(),
      });
    }
  };
  
  const handleReject = () => {
    if (!rejectionReason.trim()) return;
    
    rejectExport(exportRequest.id, rejectionReason);
    
    if (user) {
      addAuditLog({
        id: generateId(),
        userId: user.id,
        userName: user.name,
        action: AuditAction.UPDATE,
        entity: AuditEntity.EXPORT,
        entityId: exportRequest.id,
        details: `Rejected export request for ${exportRequest.dataType}`,
        timestamp: new Date().toISOString(),
      });
    }
    
    setShowRejectModal(false);
    setRejectionReason("");
  };
  
  const handleDownload = () => {
    const blob = new Blob(
      [`Mock ${exportRequest.format} file for ${exportRequest.dataType}`],
      { type: "text/plain" }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `export_${exportRequest.id}.${exportRequest.format.toLowerCase()}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    if (user) {
      addAuditLog({
        id: generateId(),
        userId: user.id,
        userName: user.name,
        action: AuditAction.EXPORT,
        entity: AuditEntity.EXPORT,
        entityId: exportRequest.id,
        details: `Downloaded export file for ${exportRequest.dataType}`,
        timestamp: new Date().toISOString(),
      });
    }
  };
  
  const student = exportRequest.studentId
    ? getStudentById(exportRequest.studentId)
    : null;
  const classObj = exportRequest.classId
    ? getClassById(exportRequest.classId)
    : null;
  
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-dark mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Exports
        </button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-dark mb-2">Export Request Details</h1>
            <p className="text-gray-600">Request ID: {exportRequest.id.slice(0, 8)}...</p>
          </div>
          <Badge
            variant={
              exportRequest.status === ExportStatus.APPROVED
                ? "success"
                : exportRequest.status === ExportStatus.REJECTED
                ? "danger"
                : "warning"
            }
          >
            {exportRequest.status}
          </Badge>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-semibold text-dark mb-4">Request Information</h3>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-600">Data Type</p>
              <p className="font-medium text-dark">
                {exportRequest.dataType.replace(/_/g, " ")}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Format</p>
              <p className="font-medium text-dark">{exportRequest.format}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Requested By</p>
              <p className="font-medium text-dark">{exportRequest.requestedBy}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Created</p>
              <p className="font-medium text-dark">{formatDateTime(exportRequest.createdAt)}</p>
            </div>
          </div>
        </Card>
        
        <Card>
          <h3 className="text-lg font-semibold text-dark mb-4">Filters Applied</h3>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-600">Student</p>
              <p className="font-medium text-dark">
                {student ? `${student.name} (${student.admissionNo})` : "All Students"}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Class</p>
              <p className="font-medium text-dark">
                {classObj ? classObj.name : "All Classes"}
              </p>
            </div>
            {exportRequest.dateRange && (
              <div>
                <p className="text-sm text-gray-600">Date Range</p>
                <p className="font-medium text-dark">
                  {exportRequest.dateRange.from} to {exportRequest.dateRange.to}
                </p>
              </div>
            )}
          </div>
        </Card>
      </div>
      
      <Card>
        <h3 className="text-lg font-semibold text-dark mb-4">Justification</h3>
        <p className="text-gray-700 whitespace-pre-wrap">{exportRequest.justification}</p>
      </Card>
      
      {exportRequest.status === ExportStatus.APPROVED && (
        <Card>
          <h3 className="text-lg font-semibold text-dark mb-4">Approval Information</h3>
          <div className="space-y-3 mb-4">
            <div>
              <p className="text-sm text-gray-600">Approved By</p>
              <p className="font-medium text-dark">{exportRequest.approvedBy}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Completed</p>
              <p className="font-medium text-dark">
                {exportRequest.completedAt ? formatDateTime(exportRequest.completedAt) : "N/A"}
              </p>
            </div>
          </div>
          <Button onClick={handleDownload}>
            <Download className="w-4 h-4 mr-2" />
            Download Export File
          </Button>
        </Card>
      )}
      
      {exportRequest.status === ExportStatus.REJECTED && (
        <Card className="bg-danger/10 border-danger/20">
          <h3 className="text-lg font-semibold text-danger mb-4">Rejection Reason</h3>
          <p className="text-gray-700 whitespace-pre-wrap">
            {exportRequest.rejectionReason || "No reason provided"}
          </p>
        </Card>
      )}
      
      {exportRequest.status === ExportStatus.PENDING && (
        <Card>
          <h3 className="text-lg font-semibold text-dark mb-4">Approval Actions</h3>
          <div className="flex gap-4">
            <Button onClick={handleApprove}>
              <CheckCircle className="w-4 h-4 mr-2" />
              Approve Request
            </Button>
            <Button variant="danger" onClick={() => setShowRejectModal(true)}>
              <XCircle className="w-4 h-4 mr-2" />
              Reject Request
            </Button>
          </div>
        </Card>
      )}
      
      <Modal
        isOpen={showRejectModal}
        onClose={() => setShowRejectModal(false)}
        title="Reject Export Request"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Please provide a reason for rejecting this export request.
          </p>
          <Input
            label="Rejection Reason"
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            placeholder="Enter reason..."
            required
          />
          <div className="flex gap-4 justify-end">
            <Button variant="ghost" onClick={() => setShowRejectModal(false)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleReject}
              disabled={!rejectionReason.trim()}
            >
              Reject Request
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}