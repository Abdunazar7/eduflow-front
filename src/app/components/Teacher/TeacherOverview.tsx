import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Users, BookOpen, CheckSquare, Calendar } from "lucide-react";
import { getGroupsByTeacherId, lessons, enrollments, attendanceRecords, users } from "../../data/mockData";
import { Badge } from "../ui/badge";

interface TeacherOverviewProps {
  teacherId: number;
}

export default function TeacherOverview({ teacherId }: TeacherOverviewProps) {
  const teacher = users.find((u) => u.id === teacherId);
  const myGroups = getGroupsByTeacherId(teacherId);
  const myLessons = lessons.filter((l) => l.teacherId === teacherId);
  
  const totalStudents = myGroups.reduce((sum, group) => {
    return sum + enrollments.filter((e) => e.groupId === group.id).length;
  }, 0);

  const completedLessons = myLessons.filter((l) => l.status === "completed").length;
  const upcomingLessons = myLessons.filter((l) => l.status === "planned").length;

  const recentLessons = myLessons
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  return (
    <div className="p-8">
      <div className="mb-6">
        <h2 className="text-3xl mb-2">
          Welcome, {teacher?.firstName} {teacher?.lastName}!
        </h2>
        <p className="text-slate-600">Here's an overview of your teaching activities</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">My Groups</CardTitle>
            <Users className="size-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{myGroups.length}</div>
            <p className="text-xs text-slate-500">Active classes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">Total Students</CardTitle>
            <Users className="size-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{totalStudents}</div>
            <p className="text-xs text-slate-500">Across all groups</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">Completed Lessons</CardTitle>
            <CheckSquare className="size-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{completedLessons}</div>
            <p className="text-xs text-slate-500">This period</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">Upcoming Lessons</CardTitle>
            <Calendar className="size-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{upcomingLessons}</div>
            <p className="text-xs text-slate-500">Scheduled</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* My Groups */}
        <Card>
          <CardHeader>
            <CardTitle>My Active Groups</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {myGroups.map((group) => {
                const studentCount = enrollments.filter((e) => e.groupId === group.id).length;

                return (
                  <div
                    key={group.id}
                    className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-lg bg-green-100 flex items-center justify-center">
                        <Users className="size-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium">{group.name}</p>
                        <p className="text-xs text-slate-500">{studentCount} students</p>
                      </div>
                    </div>
                    <Badge
                      className={
                        group.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-orange-100 text-orange-800"
                      }
                    >
                      {group.status}
                    </Badge>
                  </div>
                );
              })}
              {myGroups.length === 0 && (
                <p className="text-sm text-slate-500 text-center py-4">No groups assigned yet</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Lessons */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Lessons</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentLessons.map((lesson) => {
                const group = myGroups.find((g) => g.id === lesson.groupId);

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
                        <p className="font-medium text-sm">{lesson.topic || "Untitled"}</p>
                        <p className="text-xs text-slate-500">{group?.name}</p>
                        <p className="text-xs text-slate-400 mt-1">
                          {new Date(lesson.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className={
                        lesson.status === "completed"
                          ? "text-green-600 border-green-600"
                          : "text-orange-600 border-orange-600"
                      }
                    >
                      {lesson.status}
                    </Badge>
                  </div>
                );
              })}
              {recentLessons.length === 0 && (
                <p className="text-sm text-slate-500 text-center py-4">No lessons yet</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Schedule Overview */}
      <Card>
        <CardHeader>
          <CardTitle>This Week's Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center gap-3 p-3 border-l-4 border-green-500 bg-green-50 rounded">
              <Calendar className="size-5 text-green-600" />
              <div className="flex-1">
                <p className="text-sm font-medium">A1-Morning-01</p>
                <p className="text-xs text-slate-500">Mon, Wed, Fri • 10:00 AM - 11:30 AM</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 border-l-4 border-blue-500 bg-blue-50 rounded">
              <Calendar className="size-5 text-blue-600" />
              <div className="flex-1">
                <p className="text-sm font-medium">B1-Business-01</p>
                <p className="text-xs text-slate-500">Tue, Thu • 6:00 PM - 7:30 PM</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
