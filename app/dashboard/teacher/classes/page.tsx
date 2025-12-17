"use client";

import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ClipboardCheck, BookOpen } from "lucide-react";

export default function TeacherClassesPage() {
  const router = useRouter();
  const user = useStore((state) => state.user);
  const classes = useStore((state) => state.classes);
  const teachers = useStore((state) => state.teachers);
  
  const currentTeacher = teachers.find((t) => t.email === user?.email);
  const myClasses = classes.filter((c) =>
    currentTeacher?.assignedClasses.includes(c.id)
  );
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-dark mb-2">My Classes</h1>
        <p className="text-gray-600">Manage your assigned classes</p>
      </div>
      
      {myClasses.length === 0 ? (
        <Card>
          <p className="text-gray-500 text-center py-12">
            No classes assigned yet
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myClasses.map((classObj) => (
            <Card key={classObj.id} className="hover:shadow-lg transition-shadow">
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold text-dark mb-1">
                    {classObj.name}
                  </h3>
                  <p className="text-gray-600">Room {classObj.room}</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Students</span>
                    <span className="font-semibold">{classObj.studentCount}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Capacity</span>
                    <span className="font-semibold">{classObj.capacity}</span>
                  </div>
                </div>
                
                <div className="pt-3 border-t border-gray-200 space-y-2">
                  <Button
                    className="w-full"
                    size="sm"
                    onClick={() =>
                      router.push(`/dashboard/teacher/attendance/${classObj.id}`)
                    }
                  >
                    <ClipboardCheck className="w-4 h-4 mr-2" />
                    Mark Attendance
                  </Button>
                  <Button
                    className="w-full"
                    size="sm"
                    variant="ghost"
                    onClick={() =>
                      router.push(`/dashboard/teacher/grades/${classObj.id}`)
                    }
                  >
                    <BookOpen className="w-4 h-4 mr-2" />
                    Enter Grades
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}