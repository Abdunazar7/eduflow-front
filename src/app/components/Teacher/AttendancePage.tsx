import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { ChevronLeft, ChevronRight, Check, X, Edit } from "lucide-react";
import {
  lessons,
  attendanceRecords,
  users,
  getGroupsByTeacherId,
  enrollments,
} from "../../data/mockData";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface AttendancePageProps {
  teacherId: number;
}

export default function AttendancePage({ teacherId }: AttendancePageProps) {
  const myGroups = getGroupsByTeacherId(teacherId);
  const myLessons = lessons.filter((l) => l.teacherId === teacherId && l.status === "completed");

  // For demo: Using February 2026 as shown in the images
  const [currentMonth, setCurrentMonth] = useState(new Date("2026-02-01"));
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(myGroups[0]?.id || 1);

  // Get students in the selected group
  const groupEnrollments = enrollments.filter((e) => e.groupId === selectedGroup);
  const groupStudents = groupEnrollments.map((e) => {
    const student = users.find((u) => u.id === e.studentId);
    return student;
  }).filter(Boolean);

  // Get lessons for current month
  const monthLessons = lessons
    .filter((l) => l.groupId === selectedGroup)
    .filter((l) => {
      const lessonDate = new Date(l.date);
      return (
        lessonDate.getMonth() === currentMonth.getMonth() &&
        lessonDate.getFullYear() === currentMonth.getFullYear()
      );
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Mock marks data - in production this would come from a marks table
  const mockMarks: { [key: string]: number } = {
    "8-1": 100, "8-2": 100, "8-3": 96, "8-4": 92,
    "9-1": 100, "9-2": 98, "9-3": 92, "9-4": 100,
    "10-1": 100, "10-2": 100, "10-3": 100, "10-4": 100,
    "11-1": 100, "11-2": 100, "11-3": 98, "11-4": 88,
    "12-1": 100, "12-2": 100, "12-3": 96, "12-4": 80,
    "13-1": 100, "13-2": 98, "13-3": 80, "13-4": 97,
    "14-1": 100, "14-2": 100, "14-3": 98, "14-4": 85,
    "15-1": 100, "15-2": 100, "15-3": 96, "15-4": 85,
    "16-1": 100, "16-2": 100, "16-3": 94, "16-4": 80,
    "17-1": 100, "17-2": 100, "17-3": 95, "17-4": 80,
  };

  const getMarkColor = (mark: number) => {
    if (mark >= 90) return "bg-green-500 dark:bg-green-600";
    if (mark >= 75) return "bg-yellow-500 dark:bg-yellow-600";
    return "bg-red-500 dark:bg-red-600";
  };

  const getMarkTextColor = (mark: number) => {
    if (mark >= 90) return "text-green-600 dark:text-green-400";
    if (mark >= 75) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  const handlePreviousMonth = () => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(newDate.getMonth() - 1);
    setCurrentMonth(newDate);
  };

  const handleNextMonth = () => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(newDate.getMonth() + 1);
    setCurrentMonth(newDate);
  };

  const monthName = currentMonth.toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });

  return (
    <div className="p-8 bg-gray-50 dark:bg-gray-950 min-h-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-semibold text-gray-900 dark:text-white mb-2">
            Davomat va Baholar
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            O'quvchilarning davomati va baholarini boshqaring
          </p>
        </div>
        <Button
          onClick={() => setIsEditMode(!isEditMode)}
          variant={isEditMode ? "default" : "outline"}
          className={
            isEditMode
              ? "bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600"
              : "dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
          }
        >
          {isEditMode ? (
            <>
              <Check className="size-4 mr-2" />
              Saqlash
            </>
          ) : (
            <>
              <Edit className="size-4 mr-2" />
              Tahrirlash
            </>
          )}
        </Button>
      </div>

      {/* Attendance/Marks Card */}
      <Card className="dark:bg-gray-900 dark:border-gray-800 hover:shadow-xl transition-all duration-300">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl dark:text-white">Marks</CardTitle>
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={handlePreviousMonth}
                className="dark:text-gray-300 dark:hover:bg-gray-800"
              >
                <ChevronLeft className="size-5" />
              </Button>
              <span className="text-lg font-medium dark:text-white min-w-[120px] text-center">
                {monthName}
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleNextMonth}
                className="dark:text-gray-300 dark:hover:bg-gray-800"
              >
                <ChevronRight className="size-5" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b dark:border-gray-800">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                    Students
                  </th>
                  {monthLessons.slice(0, 5).map((lesson) => {
                    const lessonDate = new Date(lesson.date);
                    return (
                      <th
                        key={lesson.id}
                        className="text-center py-3 px-2 min-w-[80px]"
                      >
                        <div className="flex flex-col items-center gap-1">
                          <Badge
                            className={`${
                              lessonDate.getDate() === 10
                                ? "bg-yellow-500 text-white"
                                : "bg-gray-600 dark:bg-gray-700 text-white"
                            }`}
                          >
                            {lessonDate.getDate()} {lessonDate.toLocaleDateString("en-US", { month: "short" })}
                          </Badge>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {lesson.topic ? `L.${lesson.id}` : "Test"}
                          </span>
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {groupStudents.map((student, idx) => {
                  if (!student) return null;
                  
                  return (
                    <tr
                      key={student.id}
                      className="border-b dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                    >
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-gray-500 dark:text-gray-400 w-6">
                            {idx + 1}
                          </span>
                          <Avatar className="size-10">
                            <AvatarImage src={student.photoUrl} />
                            <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-sm">
                              {student.firstName[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {student.firstName} {student.lastName[0]}.
                            </p>
                            {student.studentProfile && (
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                ID: {student.id}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      {monthLessons.slice(0, 5).map((lesson) => {
                        const mark = mockMarks[`${student.id}-${lesson.id}`] || 0;
                        const hasData = mark > 0;

                        return (
                          <td key={lesson.id} className="text-center py-4 px-2">
                            {hasData ? (
                              <button
                                className={`size-12 rounded-full flex items-center justify-center font-medium text-white transition-transform hover:scale-110 ${getMarkColor(
                                  mark
                                )} ${isEditMode ? "cursor-pointer ring-2 ring-offset-2 ring-blue-500 dark:ring-blue-400 dark:ring-offset-gray-900" : ""}`}
                                onClick={() => {
                                  if (isEditMode) {
                                    toast.info(`Tahrirlash: ${student.firstName} - ${mark} ball`);
                                  }
                                }}
                              >
                                {mark}
                              </button>
                            ) : (
                              <div className="size-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-400 dark:text-gray-500">
                                —
                              </div>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Color Legend */}
          <div className="mt-6 flex items-center justify-center gap-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex items-center gap-2">
              <div className="size-4 rounded-full bg-green-500 dark:bg-green-600"></div>
              <span className="text-sm text-gray-600 dark:text-gray-300">A'lo (90-100)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="size-4 rounded-full bg-yellow-500 dark:bg-yellow-600"></div>
              <span className="text-sm text-gray-600 dark:text-gray-300">Yaxshi (75-89)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="size-4 rounded-full bg-red-500 dark:bg-red-600"></div>
              <span className="text-sm text-gray-600 dark:text-gray-300">Qoniqarsiz (&lt;75)</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <Card className="dark:bg-gray-900 dark:border-gray-800 hover:shadow-xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium dark:text-gray-300">
              Jami O'quvchilar
            </CardTitle>
            <div className="size-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <span className="text-blue-600 dark:text-blue-400 text-lg">👥</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">{groupStudents.length}</div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Aktiv o'quvchilar
            </p>
          </CardContent>
        </Card>

        <Card className="dark:bg-gray-900 dark:border-gray-800 hover:shadow-xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium dark:text-gray-300">
              O'rtacha Ball
            </CardTitle>
            <div className="size-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <span className="text-green-600 dark:text-green-400 text-lg">📊</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600 dark:text-green-400">94.2</div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Joriy oy bo'yicha
            </p>
          </CardContent>
        </Card>

        <Card className="dark:bg-gray-900 dark:border-gray-800 hover:shadow-xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium dark:text-gray-300">
              Darslar Soni
            </CardTitle>
            <div className="size-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
              <span className="text-purple-600 dark:text-purple-400 text-lg">📚</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">{monthLessons.length}</div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Joriy oyda
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
