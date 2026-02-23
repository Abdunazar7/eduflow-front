import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { ChevronLeft, ChevronRight, Check, Edit, Calendar, X } from "lucide-react";
import {
  lessons,
  users,
  getGroupsByTeacherId,
  enrollments,
  grades,
  getGradesByLessonId,
  attendanceRecords,
} from "../../data/mockData";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Label } from "../ui/label";

interface AttendancePageProps {
  teacherId: number;
}

export default function AttendancePage({ teacherId }: AttendancePageProps) {
  const myGroups = getGroupsByTeacherId(teacherId);

  const [currentMonth, setCurrentMonth] = useState(new Date("2026-02-01"));
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(myGroups[0]?.id.toString() || "1");
  const [activeTab, setActiveTab] = useState<"grades" | "attendance">("grades");

  // Get students in the selected group
  const groupEnrollments = enrollments.filter((e) => e.groupId === parseInt(selectedGroup));
  const groupStudents = groupEnrollments
    .map((e) => {
      const student = users.find((u) => u.id === e.studentId);
      return student;
    })
    .filter(Boolean);

  // Get lessons for current month
  const monthLessons = lessons
    .filter((l) => l.groupId === parseInt(selectedGroup))
    .filter((l) => {
      const lessonDate = new Date(l.date);
      return (
        lessonDate.getMonth() === currentMonth.getMonth() &&
        lessonDate.getFullYear() === currentMonth.getFullYear()
      );
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const getMarkColor = (mark: number) => {
    if (mark === 0) return "bg-gray-300 dark:bg-gray-700";
    if (mark >= 90) return "bg-green-500 dark:bg-green-600";
    if (mark >= 75) return "bg-yellow-500 dark:bg-yellow-600";
    return "bg-red-500 dark:bg-red-600";
  };

  const getAttendanceIcon = (status: string) => {
    if (status === "present") {
      return <Check className="size-5 md:size-6 text-white" />;
    } else if (status === "excused") {
      return <X className="size-5 md:size-6 text-white" />;
    } else {
      return <X className="size-5 md:size-6 text-white" />;
    }
  };

  const getAttendanceColor = (status: string) => {
    if (status === "present") return "bg-green-500 dark:bg-green-600";
    if (status === "excused") return "bg-yellow-500 dark:bg-yellow-600";
    return "bg-red-500 dark:bg-red-600";
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

  const handleCellClick = (studentId: number, lessonId: number, currentValue: any) => {
    if (!isEditMode) return;
    toast.info(`Tahrirlash: ${currentValue}`);
  };

  return (
    <div className="p-4 md:p-8 bg-gray-50 dark:bg-gray-950 min-h-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 dark:text-white mb-2">
            Davomat va Baholar
          </h2>
          <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">
            O'quvchilarning davomati va baholarini boshqaring
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => {
              if (isEditMode) {
                toast.success("O'zgarishlar saqlandi");
              }
              setIsEditMode(!isEditMode);
            }}
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
      </div>

      {/* Group Selector */}
      <Card className="mb-6 border-2 hover:shadow-xl transition-all duration-300 dark:bg-gray-900 dark:border-gray-800">
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <Calendar className="size-5 text-gray-500 dark:text-gray-400" />
            <div className="flex-1">
              <Label
                htmlFor="group-select"
                className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block"
              >
                Guruhni tanlang
              </Label>
              <Select value={selectedGroup} onValueChange={setSelectedGroup}>
                <SelectTrigger className="dark:bg-gray-800 dark:border-gray-700 dark:text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                  {myGroups.map((group) => (
                    <SelectItem
                      key={group.id}
                      value={group.id.toString()}
                      className="dark:text-gray-200"
                    >
                      {group.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs for Baholar and Davomat */}
      <div className="flex gap-2 mb-6">
        <Button
          onClick={() => setActiveTab("grades")}
          variant={activeTab === "grades" ? "default" : "outline"}
          className={
            activeTab === "grades"
              ? "flex-1 md:flex-initial bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600"
              : "flex-1 md:flex-initial dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
          }
        >
          📊 Baholar
        </Button>
        <Button
          onClick={() => setActiveTab("attendance")}
          variant={activeTab === "attendance" ? "default" : "outline"}
          className={
            activeTab === "attendance"
              ? "flex-1 md:flex-initial bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600"
              : "flex-1 md:flex-initial dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
          }
        >
          ✅ Davomat
        </Button>
      </div>

      {/* Table Card */}
      <Card className="border-2 hover:shadow-xl transition-all duration-300 dark:bg-gray-900 dark:border-gray-800">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <CardTitle className="text-xl md:text-2xl dark:text-white">
              {activeTab === "grades" ? "Baholar" : "Davomat"}
            </CardTitle>
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={handlePreviousMonth}
                className="dark:text-gray-300 dark:hover:bg-gray-800"
              >
                <ChevronLeft className="size-5" />
              </Button>
              <span className="text-base md:text-lg font-medium dark:text-white min-w-[100px] md:min-w-[120px] text-center">
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
          <div className="overflow-x-auto -mx-2 md:mx-0">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b dark:border-gray-800">
                  <th className="text-left py-3 px-2 md:px-4 text-xs md:text-sm font-medium text-gray-600 dark:text-gray-400 sticky left-0 bg-white dark:bg-gray-900 z-10">
                    O'quvchilar
                  </th>
                  {monthLessons.map((lesson, index) => {
                    const lessonDate = new Date(lesson.date);
                    const dayNum = lessonDate.getDate();
                    const monthShort = lessonDate.toLocaleDateString("uz-UZ", { month: "short" });
                    const dayOfWeek = lessonDate.toLocaleDateString("uz-UZ", { weekday: "short" });

                    return (
                      <th key={lesson.id} className="text-center py-3 px-1 md:px-3 min-w-[70px] md:min-w-[90px]">
                        <div className="flex flex-col items-center gap-1">
                          <div className="text-[10px] md:text-xs text-gray-500 dark:text-gray-400 uppercase">
                            {dayOfWeek}
                          </div>
                          <Badge
                            className={`text-xs md:text-sm font-semibold px-2 py-1 ${
                              lesson.status === "completed"
                                ? "bg-blue-600 dark:bg-blue-700 text-white"
                                : "bg-gray-400 dark:bg-gray-600 text-white"
                            }`}
                          >
                            {dayNum} {monthShort}
                          </Badge>
                          <span className="text-[10px] md:text-xs font-medium text-gray-600 dark:text-gray-400 mt-1">
                            Dars #{index + 1}
                          </span>
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {groupStudents.slice(0, 10).map((student, idx) => {
                  if (!student) return null;

                  return (
                    <tr
                      key={student.id}
                      className="border-b dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                    >
                      <td className="py-3 md:py-4 px-2 md:px-4 sticky left-0 bg-white dark:bg-gray-900 z-10">
                        <div className="flex items-center gap-2 md:gap-3">
                          <span className="text-xs md:text-sm text-gray-500 dark:text-gray-400 w-4 md:w-6">
                            {idx + 1}
                          </span>
                          <Avatar className="size-8 md:size-10">
                            <AvatarImage src={student.photoUrl} />
                            <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-xs md:text-sm">
                              {student.firstName[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <p className="font-medium text-xs md:text-sm text-gray-900 dark:text-white truncate">
                              {student.firstName} {student.lastName[0]}.
                            </p>
                          </div>
                        </div>
                      </td>
                      {monthLessons.map((lesson) => {
                        const lessonStatus = lesson.status;

                        if (activeTab === "grades") {
                          // Grades View
                          const lessonGrades = getGradesByLessonId(lesson.id);
                          const studentGrade = lessonGrades.find((g) => g.studentId === student.id);
                          const mark = studentGrade ? studentGrade.score : null;
                          const hasData = mark !== null;

                          return (
                            <td key={lesson.id} className="text-center py-3 md:py-4 px-1 md:px-2">
                              {hasData && lessonStatus === "completed" ? (
                                <button
                                  className={`size-10 md:size-12 rounded-full flex items-center justify-center text-xs md:text-sm font-medium text-white transition-transform hover:scale-110 ${getMarkColor(
                                    mark
                                  )} ${
                                    isEditMode
                                      ? "cursor-pointer ring-2 ring-offset-2 ring-yellow-500 dark:ring-yellow-400 dark:ring-offset-gray-900"
                                      : ""
                                  }`}
                                  onClick={() => handleCellClick(student.id, lesson.id, mark)}
                                >
                                  {mark}
                                </button>
                              ) : (
                                <div className="size-10 md:size-12 rounded-full border-2 border-dashed border-gray-300 dark:border-gray-700 flex items-center justify-center text-gray-400 dark:text-gray-500">
                                  —
                                </div>
                              )}
                            </td>
                          );
                        } else {
                          // Attendance View
                          const attendanceRecord = attendanceRecords.find(
                            (a) => a.lessonId === lesson.id && a.studentId === student.id
                          );
                          const status = attendanceRecord?.status;

                          return (
                            <td key={lesson.id} className="text-center py-3 md:py-4 px-1 md:px-2">
                              {status && lessonStatus === "completed" ? (
                                <button
                                  className={`size-10 md:size-12 rounded-full flex items-center justify-center transition-transform hover:scale-110 ${getAttendanceColor(
                                    status
                                  )} ${
                                    isEditMode
                                      ? "cursor-pointer ring-2 ring-offset-2 ring-yellow-500 dark:ring-yellow-400 dark:ring-offset-gray-900"
                                      : ""
                                  }`}
                                  onClick={() => handleCellClick(student.id, lesson.id, status)}
                                  title={attendanceRecord?.comment || status}
                                >
                                  {getAttendanceIcon(status)}
                                </button>
                              ) : (
                                <div className="size-10 md:size-12 rounded-full border-2 border-dashed border-gray-300 dark:border-gray-700 flex items-center justify-center text-gray-400 dark:text-gray-500">
                                  —
                                </div>
                              )}
                            </td>
                          );
                        }
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Legend */}
          {activeTab === "grades" ? (
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3 md:gap-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="size-3 md:size-4 rounded-full bg-green-500 dark:bg-green-600"></div>
                <span className="text-xs md:text-sm text-gray-600 dark:text-gray-300">A'lo (90-100)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="size-3 md:size-4 rounded-full bg-yellow-500 dark:bg-yellow-600"></div>
                <span className="text-xs md:text-sm text-gray-600 dark:text-gray-300">Yaxshi (75-89)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="size-3 md:size-4 rounded-full bg-red-500 dark:bg-red-600"></div>
                <span className="text-xs md:text-sm text-gray-600 dark:text-gray-300">Qoniqarsiz (&lt;75)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="size-3 md:size-4 rounded-full border-2 border-dashed border-gray-400"></div>
                <span className="text-xs md:text-sm text-gray-600 dark:text-gray-300">Rejalashtirilgan</span>
              </div>
            </div>
          ) : (
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3 md:gap-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="size-3 md:size-4 rounded-full bg-green-500 dark:bg-green-600"></div>
                <span className="text-xs md:text-sm text-gray-600 dark:text-gray-300">Kelgan ✓</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="size-3 md:size-4 rounded-full bg-yellow-500 dark:bg-yellow-600"></div>
                <span className="text-xs md:text-sm text-gray-600 dark:text-gray-300">Sababli ✗</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="size-3 md:size-4 rounded-full bg-red-500 dark:bg-red-600"></div>
                <span className="text-xs md:text-sm text-gray-600 dark:text-gray-300">Kelmagan ✗</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="size-3 md:size-4 rounded-full border-2 border-dashed border-gray-400"></div>
                <span className="text-xs md:text-sm text-gray-600 dark:text-gray-300">Rejalashtirilgan</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mt-6 md:mt-8">
        <Card className="border-2 hover:shadow-xl transition-all duration-300 dark:bg-gray-900 dark:border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs md:text-sm font-medium dark:text-gray-300">
              Jami O'quvchilar
            </CardTitle>
            <div className="size-8 md:size-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <span className="text-blue-600 dark:text-blue-400 text-base md:text-lg">👥</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              {groupStudents.length}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Aktiv o'quvchilar</p>
          </CardContent>
        </Card>

        <Card className="border-2 hover:shadow-xl transition-all duration-300 dark:bg-gray-900 dark:border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs md:text-sm font-medium dark:text-gray-300">
              O'rtacha Ball
            </CardTitle>
            <div className="size-8 md:size-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <span className="text-green-600 dark:text-green-400 text-base md:text-lg">📊</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl md:text-3xl font-bold text-green-600 dark:text-green-400">94.2</div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Joriy oy bo'yicha</p>
          </CardContent>
        </Card>

        <Card className="border-2 hover:shadow-xl transition-all duration-300 dark:bg-gray-900 dark:border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs md:text-sm font-medium dark:text-gray-300">Darslar Soni</CardTitle>
            <div className="size-8 md:size-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
              <span className="text-purple-600 dark:text-purple-400 text-base md:text-lg">📚</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              {monthLessons.length}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Joriy oyda</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
