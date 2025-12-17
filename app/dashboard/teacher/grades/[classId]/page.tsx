"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useStore } from "@/lib/store";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { Input } from "@/components/ui/Input";
import { Term, AuditAction, AuditEntity } from "@/types";
import { generateId } from "@/lib/utils/generators";
import { ArrowLeft } from "lucide-react";

interface GradeEntry {
  studentId: string;
  score: number;
  comment: string;
}

export default function GradesPage() {
  const router = useRouter();
  const params = useParams();
  const classId = params.classId as string;
  
  const user = useStore((state) => state.user);
  const getClassById = useStore((state) => state.getClassById);
  const getStudentsByClass = useStore((state) => state.getStudentsByClass);
  const addGrade = useStore((state) => state.addGrade);
  const addAuditLog = useStore((state) => state.addAuditLog);
  
  const classObj = getClassById(classId);
  const students = getStudentsByClass(classId);
  
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedTerm, setSelectedTerm] = useState(Term.TERM_1);
  const [grades, setGrades] = useState<Record<string, GradeEntry>>({});
  
  useEffect(() => {
    if (classObj && !selectedSubject && classObj.subjects.length > 0) {
      setSelectedSubject(classObj.subjects[0]);
    }
    
    const initialGrades: Record<string, GradeEntry> = {};
    students.forEach((s) => {
      initialGrades[s.id] = {
        studentId: s.id,
        score: 0,
        comment: "",
      };
    });
    setGrades(initialGrades);
  }, [classObj, students, selectedSubject]);
  
  const handleScoreChange = (studentId: string, score: string) => {
    const numScore = Math.min(100, Math.max(0, parseInt(score) || 0));
    setGrades((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        score: numScore,
      },
    }));
  };
  
  const handleCommentChange = (studentId: string, comment: string) => {
    setGrades((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        comment,
      },
    }));
  };
  
  const calculateGrade = (score: number): string => {
    if (score >= 80) return "A";
    if (score >= 70) return "B";
    if (score >= 60) return "C";
    if (score >= 50) return "D";
    return "E";
  };
  
  const handleSave = () => {
    students.forEach((student) => {
      const gradeEntry = grades[student.id];
      
      addGrade({
        id: generateId(),
        studentId: student.id,
        classId,
        subject: selectedSubject,
        grade: calculateGrade(gradeEntry.score),
        score: gradeEntry.score,
        maxScore: 100,
        term: selectedTerm,
        year: new Date().getFullYear(),
        comment: gradeEntry.comment,
        teacherId: user?.id || "",
        createdAt: new Date().toISOString(),
      });
    });
    
    if (user) {
      addAuditLog({
        id: generateId(),
        userId: user.id,
        userName: user.name,
        action: AuditAction.CREATE,
        entity: AuditEntity.GRADE,
        details: `Entered grades for ${classObj?.name} - ${selectedSubject}`,
        timestamp: new Date().toISOString(),
      });
    }
    
    router.push("/dashboard/teacher/classes");
  };
  
  if (!classObj) {
    return <div>Class not found</div>;
  }
  
  return (
    <div className="space-y-6">
      <div>
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-dark mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Classes
        </button>
        <h1 className="text-3xl font-bold text-dark mb-2">Enter Grades</h1>
        <p className="text-gray-600">{classObj.name}</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Select
          label="Subject"
          value={selectedSubject}
          onChange={(e) => setSelectedSubject(e.target.value)}
          options={classObj.subjects.map((s) => ({ value: s, label: s }))}
        />
        
        <Select
          label="Term"
          value={selectedTerm}
          onChange={(e) => setSelectedTerm(e.target.value as Term)}
          options={[
            { value: Term.TERM_1, label: "Term 1" },
            { value: Term.TERM_2, label: "Term 2" },
            { value: Term.TERM_3, label: "Term 3" },
          ]}
        />
      </div>
      
      <Card padding="none">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-dark">
                  Student
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-dark">
                  Admission No
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-dark">
                  Score (0-100)
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-dark">
                  Grade
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-dark">
                  Comment
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {students.map((student) => {
                const gradeEntry = grades[student.id] || { score: 0, comment: "" };
                const grade = calculateGrade(gradeEntry.score);
                
                return (
                  <tr key={student.id}>
                    <td className="px-4 py-3 text-sm text-dark">
                      {student.name}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {student.admissionNo}
                    </td>
                    <td className="px-4 py-3">
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        value={gradeEntry.score}
                        onChange={(e) =>
                          handleScoreChange(student.id, e.target.value)
                        }
                        className="w-24"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          grade === "A"
                            ? "bg-primary/10 text-primary"
                            : grade === "B"
                            ? "bg-secondary/10 text-secondary"
                            : grade === "C"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-danger/10 text-danger"
                        }`}
                      >
                        {grade}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Input
                        type="text"
                        placeholder="Optional comment"
                        value={gradeEntry.comment}
                        onChange={(e) =>
                          handleCommentChange(student.id, e.target.value)
                        }
                        className="w-full"
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
      
      <div className="flex gap-4">
        <Button onClick={handleSave}>Save Grades</Button>
        <Button variant="ghost" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </div>
  );
}