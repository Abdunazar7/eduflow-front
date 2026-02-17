import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { CheckSquare, XCircle, Calendar } from "lucide-react";
import { attendanceRecords, lessons, groups } from "../../data/mockData";

interface MyAttendancePageProps {
  studentId: number;
}

export default function MyAttendancePage({ studentId }: MyAttendancePageProps) {
  const myAttendance = attendanceRecords.filter((a) => a.studentId === studentId);

  const presentCount = myAttendance.filter((a) => a.status === "present").length;
  const absentCount = myAttendance.filter((a) => a.status === "absent").length;
  const totalClasses = myAttendance.length;
  const attendanceRate = totalClasses > 0 ? (presentCount / totalClasses) * 100 : 0;

  return (
    <div className="p-8">
      <div className="mb-6">
        <h2 className="text-3xl mb-2">My Attendance</h2>
        <p className="text-slate-600">Track your class attendance record</p>
      </div>

      {/* Attendance Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">Total Classes</CardTitle>
            <Calendar className="size-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{totalClasses}</div>
            <p className="text-xs text-slate-500">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">Present</CardTitle>
            <CheckSquare className="size-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl text-green-600">{presentCount}</div>
            <p className="text-xs text-slate-500">Classes attended</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">Absent</CardTitle>
            <XCircle className="size-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl text-red-600">{absentCount}</div>
            <p className="text-xs text-slate-500">Classes missed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">Attendance Rate</CardTitle>
            <CheckSquare className="size-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl text-purple-600">{attendanceRate.toFixed(0)}%</div>
            <p className="text-xs text-slate-500">Overall rate</p>
          </CardContent>
        </Card>
      </div>

      {/* Attendance Progress */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Attendance Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-slate-600">Present</span>
              <span className="font-medium text-green-600">
                {presentCount} ({((presentCount / totalClasses) * 100).toFixed(0)}%)
              </span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-3">
              <div
                className="bg-green-600 h-3 rounded-full"
                style={{ width: `${(presentCount / totalClasses) * 100}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-sm mb-2 mt-4">
              <span className="text-slate-600">Absent</span>
              <span className="font-medium text-red-600">
                {absentCount} ({((absentCount / totalClasses) * 100).toFixed(0)}%)
              </span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-3">
              <div
                className="bg-red-600 h-3 rounded-full"
                style={{ width: `${(absentCount / totalClasses) * 100}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Attendance History */}
      <Card>
        <CardHeader>
          <CardTitle>Attendance History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Group</TableHead>
                <TableHead>Topic</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Comment</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {myAttendance
                .map((record) => {
                  const lesson = lessons.find((l) => l.id === record.lessonId);
                  const group = groups.find((g) => g.id === lesson?.groupId);

                  return {
                    ...record,
                    lesson,
                    group,
                  };
                })
                .sort((a, b) => {
                  const dateA = a.lesson?.date ? new Date(a.lesson.date).getTime() : 0;
                  const dateB = b.lesson?.date ? new Date(b.lesson.date).getTime() : 0;
                  return dateB - dateA;
                })
                .map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>
                      <p className="text-sm">
                        {record.lesson?.date
                          ? new Date(record.lesson.date).toLocaleDateString()
                          : "N/A"}
                      </p>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm">{record.group?.name || "N/A"}</p>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm">{record.lesson?.topic || "Untitled"}</p>
                    </TableCell>
                    <TableCell>
                      {record.status === "present" ? (
                        <Badge className="bg-green-100 text-green-800">
                          <CheckSquare className="size-3 mr-1" />
                          Present
                        </Badge>
                      ) : (
                        <Badge className="bg-red-100 text-red-800">
                          <XCircle className="size-3 mr-1" />
                          Absent
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <p className="text-sm text-slate-600">{record.comment || "—"}</p>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
