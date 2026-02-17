import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Calendar, Clock } from "lucide-react";
import { getEnrollmentsByStudentId, groups, lessons, users } from "../../data/mockData";

interface SchedulePageProps {
  studentId: number;
}

export default function SchedulePage({ studentId }: SchedulePageProps) {
  const enrollments = getEnrollmentsByStudentId(studentId);
  const groupIds = enrollments.map((e) => e.groupId);
  const myLessons = lessons.filter((l) => groupIds.includes(l.groupId));

  const upcomingLessons = myLessons
    .filter((l) => l.status === "planned")
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const completedLessons = myLessons
    .filter((l) => l.status === "completed")
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  return (
    <div className="p-8">
      <div className="mb-6">
        <h2 className="text-3xl mb-2">My Schedule</h2>
        <p className="text-slate-600">View your class schedule and lessons</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Lessons */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Lessons</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingLessons.map((lesson) => {
                const group = groups.find((g) => g.id === lesson.groupId);
                const teacher = users.find((u) => u.id === lesson.teacherId);

                return (
                  <div
                    key={lesson.id}
                    className="flex items-start gap-3 p-3 border-l-4 border-blue-500 bg-blue-50 rounded"
                  >
                    <div className="size-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <Calendar className="size-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{lesson.topic || "Lesson"}</p>
                      <p className="text-xs text-slate-600 mt-1">{group?.name}</p>
                      <p className="text-xs text-slate-500 mt-1">
                        Teacher: {teacher?.firstName} {teacher?.lastName}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex items-center gap-1 text-xs text-slate-600">
                          <Calendar className="size-3" />
                          {new Date(lesson.date).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-slate-600">
                          <Clock className="size-3" />
                          {new Date(lesson.date).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </div>
                    </div>
                    <Badge className="bg-blue-100 text-blue-800">Upcoming</Badge>
                  </div>
                );
              })}
              {upcomingLessons.length === 0 && (
                <p className="text-sm text-slate-500 text-center py-4">
                  No upcoming lessons scheduled
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Past Lessons */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Completed Lessons</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {completedLessons.map((lesson) => {
                const group = groups.find((g) => g.id === lesson.groupId);
                const teacher = users.find((u) => u.id === lesson.teacherId);

                return (
                  <div
                    key={lesson.id}
                    className="flex items-start gap-3 p-3 border-l-4 border-green-500 bg-green-50 rounded"
                  >
                    <div className="size-10 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                      <Calendar className="size-5 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{lesson.topic || "Lesson"}</p>
                      <p className="text-xs text-slate-600 mt-1">{group?.name}</p>
                      <p className="text-xs text-slate-500 mt-1">
                        Teacher: {teacher?.firstName} {teacher?.lastName}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex items-center gap-1 text-xs text-slate-600">
                          <Calendar className="size-3" />
                          {new Date(lesson.date).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Completed</Badge>
                  </div>
                );
              })}
              {completedLessons.length === 0 && (
                <p className="text-sm text-slate-500 text-center py-4">
                  No completed lessons yet
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Schedule */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Weekly Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="grid grid-cols-7 gap-2 text-center text-sm font-medium text-slate-600 mb-4">
              <div>Mon</div>
              <div>Tue</div>
              <div>Wed</div>
              <div>Thu</div>
              <div>Fri</div>
              <div>Sat</div>
              <div>Sun</div>
            </div>
            <div className="grid grid-cols-7 gap-2">
              {/* Mock weekly schedule */}
              <div className="p-3 bg-orange-50 border border-orange-200 rounded text-xs">
                <p className="font-medium">10:00 AM</p>
                <p className="text-slate-600">A1-Morning-01</p>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded" />
              <div className="p-3 bg-orange-50 border border-orange-200 rounded text-xs">
                <p className="font-medium">10:00 AM</p>
                <p className="text-slate-600">A1-Morning-01</p>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded" />
              <div className="p-3 bg-orange-50 border border-orange-200 rounded text-xs">
                <p className="font-medium">10:00 AM</p>
                <p className="text-slate-600">A1-Morning-01</p>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded" />
              <div className="p-3 bg-slate-50 border border-slate-200 rounded" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
