import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { BookOpen, CheckSquare, DollarSign, TrendingUp } from "lucide-react";
import { users, getEnrollmentsByStudentId, groups, attendanceRecords, lessons } from "../../data/mockData";
import { Badge } from "../ui/badge";

interface StudentOverviewProps {
  studentId: number;
}

export default function StudentOverview({ studentId }: StudentOverviewProps) {
  const student = users.find((u) => u.id === studentId);
  const profile = student?.studentProfile;
  const enrollments = getEnrollmentsByStudentId(studentId);

  const myAttendance = attendanceRecords.filter((a) => a.studentId === studentId);
  const presentCount = myAttendance.filter((a) => a.status === "present").length;
  const attendanceRate = myAttendance.length > 0 ? (presentCount / myAttendance.length) * 100 : 0;

  return (
    <div className="p-8">
      <div className="mb-6">
        <h2 className="text-3xl mb-2">
          Welcome, {student?.firstName}!
        </h2>
        <p className="text-slate-600">Track your learning progress</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">Enrolled Courses</CardTitle>
            <BookOpen className="size-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{enrollments.length}</div>
            <p className="text-xs text-slate-500">Active classes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">Attendance Rate</CardTitle>
            <CheckSquare className="size-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl text-green-600">{attendanceRate.toFixed(0)}%</div>
            <p className="text-xs text-slate-500">{presentCount} of {myAttendance.length} classes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">Account Balance</CardTitle>
            <DollarSign className="size-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl ${Number(profile?.balance || 0) >= 0 ? "text-green-600" : "text-red-600"}`}>
              ${Number(profile?.balance || 0)}
            </div>
            <p className="text-xs text-slate-500">
              {Number(profile?.balance || 0) >= 0 ? "Credit" : "Payment due"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">Discount</CardTitle>
            <TrendingUp className="size-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{profile?.discountPercent || 0}%</div>
            <p className="text-xs text-slate-500">Applied discount</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* My Courses */}
        <Card>
          <CardHeader>
            <CardTitle>My Enrolled Courses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {enrollments.map((enrollment) => {
                const group = groups.find((g) => g.id === enrollment.groupId);
                const teacher = users.find((u) => u.id === group?.teacherId);

                return (
                  <div
                    key={enrollment.id}
                    className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-lg bg-orange-100 flex items-center justify-center">
                        <BookOpen className="size-5 text-orange-600" />
                      </div>
                      <div>
                        <p className="font-medium">{group?.name}</p>
                        <p className="text-xs text-slate-500">
                          Teacher: {teacher?.firstName} {teacher?.lastName}
                        </p>
                      </div>
                    </div>
                    <Badge
                      className={
                        enrollment.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-slate-100 text-slate-800"
                      }
                    >
                      {enrollment.status}
                    </Badge>
                  </div>
                );
              })}
              {enrollments.length === 0 && (
                <p className="text-sm text-slate-500 text-center py-4">
                  No enrolled courses yet
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Classes */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Classes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {lessons
                .filter((l) => {
                  const groupIds = enrollments.map((e) => e.groupId);
                  return groupIds.includes(l.groupId) && l.status === "planned";
                })
                .slice(0, 5)
                .map((lesson) => {
                  const group = groups.find((g) => g.id === lesson.groupId);

                  return (
                    <div
                      key={lesson.id}
                      className="flex items-start justify-between p-3 bg-slate-50 rounded-lg"
                    >
                      <div className="flex items-start gap-3">
                        <div className="size-10 rounded-lg bg-blue-100 flex items-center justify-center">
                          <BookOpen className="size-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{lesson.topic || "Lesson"}</p>
                          <p className="text-xs text-slate-500">{group?.name}</p>
                          <p className="text-xs text-slate-400 mt-1">
                            {new Date(lesson.date).toLocaleDateString()} at{" "}
                            {new Date(lesson.date).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Info */}
      <Card>
        <CardHeader>
          <CardTitle>Student Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-slate-600 mb-1">Student ID</p>
              <p className="font-medium">{student?.id}</p>
            </div>
            <div>
              <p className="text-sm text-slate-600 mb-1">Phone</p>
              <p className="font-medium">{student?.phone}</p>
            </div>
            {profile?.parentName && (
              <div>
                <p className="text-sm text-slate-600 mb-1">Parent Name</p>
                <p className="font-medium">{profile.parentName}</p>
              </div>
            )}
            {profile?.parentPhone && (
              <div>
                <p className="text-sm text-slate-600 mb-1">Parent Phone</p>
                <p className="font-medium">{profile.parentPhone}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
