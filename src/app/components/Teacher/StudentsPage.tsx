import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Users, TrendingUp, BookOpen, Award } from "lucide-react";
import {
  getGroupsByTeacherId,
  enrollments,
  users,
  lessons,
  courseLevels,
} from "../../data/mockData";

interface StudentsPageProps {
  teacherId: number;
}

export default function StudentsPage({ teacherId }: StudentsPageProps) {
  const myGroups = getGroupsByTeacherId(teacherId);
  const [selectedGroup, setSelectedGroup] = useState(myGroups[0]?.id.toString() || "1");

  // Get students in the selected group
  const groupEnrollments = enrollments.filter(
    (e) => e.groupId === parseInt(selectedGroup)
  );
  const groupStudents = groupEnrollments
    .map((e) => {
      const student = users.find((u) => u.id === e.studentId);
      return student;
    })
    .filter(Boolean);

  // Get group lessons
  const groupLessons = lessons.filter((l) => l.groupId === parseInt(selectedGroup));
  const completedLessons = groupLessons.filter((l) => l.status === "completed");

  // Mock marks data
  const mockMarks: { [key: string]: number } = {
    "8-1": 100, "8-2": 100, "8-3": 96, "8-avg": 98.7,
    "9-1": 100, "9-2": 98, "9-3": 92, "9-avg": 96.7,
    "10-1": 100, "10-2": 100, "10-3": 100, "10-avg": 100,
    "11-1": 100, "11-2": 100, "11-3": 98, "11-avg": 99.3,
    "12-1": 100, "12-2": 100, "12-3": 96, "12-avg": 98.7,
    "13-1": 100, "13-2": 98, "13-3": 80, "13-avg": 92.7,
    "14-1": 100, "14-2": 100, "14-3": 98, "14-avg": 99.3,
    "15-1": 100, "15-2": 100, "15-3": 96, "15-avg": 98.7,
    "16-1": 100, "16-2": 100, "16-3": 94, "16-avg": 98.0,
    "17-1": 100, "17-2": 100, "17-3": 95, "17-avg": 98.3,
  };

  // Get attendance percentage
  const getAttendancePercentage = (studentId: number) => {
    // Mock data - in production calculate from actual attendance records
    const percentages: { [key: number]: number } = {
      8: 100, 9: 95, 10: 100, 11: 100, 12: 98,
      13: 92, 14: 100, 15: 98, 16: 96, 17: 95,
    };
    return percentages[studentId] || 100;
  };

  const getAverageGrade = (studentId: number) => {
    return mockMarks[`${studentId}-avg`] || 0;
  };

  const getGradeColor = (grade: number) => {
    if (grade >= 95) return "text-green-600 dark:text-green-400";
    if (grade >= 85) return "text-blue-600 dark:text-blue-400";
    if (grade >= 75) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  const selectedGroupData = myGroups.find((g) => g.id === parseInt(selectedGroup));
  const selectedLevel = selectedGroupData
    ? courseLevels.find((l) => l.id === selectedGroupData.courseLevelId)
    : null;

  return (
    <div className="p-8 bg-gray-50 dark:bg-gray-950 min-h-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-semibold text-gray-900 dark:text-white mb-2">
            O'quvchilar
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Guruh o'quvchilarining natijalarini kuzatib boring
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={selectedGroup} onValueChange={setSelectedGroup}>
            <SelectTrigger className="w-[250px] dark:bg-gray-800 dark:border-gray-700 dark:text-white">
              <SelectValue placeholder="Guruhni tanlang" />
            </SelectTrigger>
            <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
              {myGroups.map((group) => (
                <SelectItem key={group.id} value={group.id.toString()} className="dark:text-white">
                  {group.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="border-2 hover:shadow-xl transition-all duration-300 dark:bg-gray-900 dark:border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium dark:text-gray-300">
              Jami O'quvchilar
            </CardTitle>
            <div className="size-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <Users className="size-5 text-blue-600 dark:text-blue-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">
              {groupStudents.length}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Aktiv o'quvchilar
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 hover:shadow-xl transition-all duration-300 dark:bg-gray-900 dark:border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium dark:text-gray-300">
              O'rtacha Ball
            </CardTitle>
            <div className="size-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <Award className="size-5 text-green-600 dark:text-green-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600 dark:text-green-400">
              97.8
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Guruh bo'yicha
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 hover:shadow-xl transition-all duration-300 dark:bg-gray-900 dark:border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium dark:text-gray-300">
              Darslar Soni
            </CardTitle>
            <div className="size-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
              <BookOpen className="size-5 text-purple-600 dark:text-purple-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">
              {completedLessons.length}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              O'tgan darslar
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 hover:shadow-xl transition-all duration-300 dark:bg-gray-900 dark:border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium dark:text-gray-300">
              O'rtacha Davomat
            </CardTitle>
            <div className="size-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
              <TrendingUp className="size-5 text-indigo-600 dark:text-indigo-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
              97%
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Guruh bo'yicha
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Students List */}
      <Card className="border-2 hover:shadow-xl transition-all duration-300 dark:bg-gray-900 dark:border-gray-800">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl dark:text-white">
                {selectedGroupData?.name} - O'quvchilar Ro'yxati
              </CardTitle>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {selectedLevel?.name}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {groupStudents.map((student, index) => {
              if (!student) return null;

              const attendance = getAttendancePercentage(student.id);
              const avgGrade = getAverageGrade(student.id);

              return (
                <div
                  key={student.id}
                  className="p-4 rounded-lg border dark:border-gray-800 bg-white dark:bg-gray-800/50 hover:shadow-md transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <span className="text-lg font-semibold text-gray-400 dark:text-gray-500 w-8">
                        {index + 1}
                      </span>
                      <Avatar className="size-14">
                        <AvatarImage src={student.photoUrl} />
                        <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-lg">
                          {student.firstName[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {student.firstName} {student.lastName}
                        </h3>
                        <div className="flex items-center gap-4 mt-1">
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            ID: {student.id}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Tel: {student.phone}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      {/* Attendance */}
                      <div className="text-center">
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                          Davomat
                        </p>
                        <div className="flex items-center gap-2">
                          <div
                            className={`text-2xl font-bold ${
                              attendance >= 95
                                ? "text-green-600 dark:text-green-400"
                                : attendance >= 85
                                ? "text-yellow-600 dark:text-yellow-400"
                                : "text-red-600 dark:text-red-400"
                            }`}
                          >
                            {attendance}%
                          </div>
                        </div>
                      </div>

                      {/* Average Grade */}
                      <div className="text-center">
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                          O'rtacha Ball
                        </p>
                        <div className={`text-2xl font-bold ${getGradeColor(avgGrade)}`}>
                          {avgGrade.toFixed(1)}
                        </div>
                      </div>

                      {/* Recent Grades */}
                      <div className="flex items-center gap-2">
                        {[1, 2, 3].map((lessonNum) => {
                          const mark = mockMarks[`${student.id}-${lessonNum}`] || 0;
                          const color =
                            mark >= 90
                              ? "bg-green-500 dark:bg-green-600"
                              : mark >= 75
                              ? "bg-yellow-500 dark:bg-yellow-600"
                              : "bg-red-500 dark:bg-red-600";

                          return (
                            <div
                              key={lessonNum}
                              className={`size-10 rounded-full ${color} flex items-center justify-center text-white font-semibold text-sm`}
                            >
                              {mark}
                            </div>
                          );
                        })}
                      </div>

                      {/* Actions */}
                      <Button
                        variant="outline"
                        size="sm"
                        className="dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
                      >
                        Ko'rish
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}