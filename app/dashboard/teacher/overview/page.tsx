"use client";

import { useStore } from "@/lib/store";
import { MetricCard } from "@/components/charts/MetricCard";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import { School, Users, ClipboardCheck, BookOpen } from "lucide-react";

export default function TeacherOverviewPage() {
  const router = useRouter();
  const user = useStore((state) => state.user);
  const classes = useStore((state) => state.classes);
  const students = useStore((state) => state.students);
  const teachers = useStore((state) => state.teachers);
  
  const currentTeacher = teachers.find((t) => t.email === user?.email);
  const myClasses = classes.filter((c) => 
    currentTeacher?.assignedClasses.includes(c.id)
  );
  
  const myStudents = students.filter((s) =>
    myClasses.some((c) => c.id === s.classId)
  );
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-dark mb-2">
          Welcome, {user?.name}
        </h1>
        <p className="text-gray-600">Your teaching dashboard</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="My Classes"
          value={myClasses.length}
          description="Assigned classes"
          icon={<School className="w-6 h-6" />}
        />
        
        <MetricCard
          title="Total Students"
          value={myStudents.length}
          description="Under my care"
          icon={<Users className="w-6 h-6" />}
        />
        
        <MetricCard
          title="Subjects"
          value={currentTeacher?.subjects.length || 0}
          description="Teaching areas"
          icon={<BookOpen className="w-6 h-6" />}
        />
        
        <MetricCard
          title="Today's Tasks"
          value={myClasses.length}
          description="Attendance to mark"
          icon={<ClipboardCheck className="w-6 h-6" />}
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h2 className="text-xl font-semibold text-dark mb-4">My Classes</h2>
          {myClasses.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No classes assigned yet
            </p>
          ) : (
            <div className="space-y-3">
              {myClasses.map((classObj) => (
                <div
                  key={classObj.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <h3 className="font-semibold text-dark">{classObj.name}</h3>
                    <p className="text-sm text-gray-600">
                      {classObj.studentCount} students
                    </p>
                  </div>
                  <Button
                    size="sm"
                    onClick={() =>
                      router.push(`/dashboard/teacher/classes/${classObj.id}`)
                    }
                  >
                    View
                  </Button>
                </div>
              ))}
            </div>
          )}
        </Card>
        
        <Card>
          <h2 className="text-xl font-semibold text-dark mb-4">
            Quick Actions
          </h2>
          <div className="space-y-3">
            <Button
              className="w-full"
              variant="ghost"
              onClick={() => router.push("/dashboard/teacher/classes")}
            >
              <ClipboardCheck className="w-4 h-4 mr-2" />
              Mark Attendance
            </Button>
            <Button
              className="w-full"
              variant="ghost"
              onClick={() => router.push("/dashboard/teacher/classes")}
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Enter Grades
            </Button>
            <Button
              className="w-full"
              variant="ghost"
              onClick={() => router.push("/dashboard/teacher/students")}
            >
              <Users className="w-4 h-4 mr-2" />
              View Students
            </Button>
          </div>
        </Card>
      </div>
      
      {currentTeacher && (
        <Card>
          <h2 className="text-xl font-semibold text-dark mb-4">My Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Employee ID</p>
              <p className="font-semibold">{currentTeacher.employeeId}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Email</p>
              <p className="font-semibold">{currentTeacher.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Phone</p>
              <p className="font-semibold">{currentTeacher.phone}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Subjects</p>
              <p className="font-semibold">
                {currentTeacher.subjects.join(", ")}
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}