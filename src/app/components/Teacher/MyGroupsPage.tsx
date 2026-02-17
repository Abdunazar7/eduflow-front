import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Users, Calendar, MapPin, BookOpen } from "lucide-react";
import { getGroupsByTeacherId, enrollments, users, branches, courseLevels } from "../../data/mockData";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface MyGroupsPageProps {
  teacherId: number;
}

export default function MyGroupsPage({ teacherId }: MyGroupsPageProps) {
  const myGroups = getGroupsByTeacherId(teacherId);

  return (
    <div className="p-8 bg-gray-50 dark:bg-gray-950 min-h-full">
      <div className="mb-6">
        <h2 className="text-3xl font-semibold text-gray-900 dark:text-white mb-2">
          Mening Guruhlarim
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Sizga biriktirilgan guruhlarni boshqaring
        </p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="dark:bg-gray-900 dark:border-gray-800 hover:shadow-xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium dark:text-gray-300">
              Jami Guruhlar
            </CardTitle>
            <div className="size-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
              <Users className="size-5 text-indigo-600 dark:text-indigo-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">
              {myGroups.length}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Aktiv guruhlar
            </p>
          </CardContent>
        </Card>

        <Card className="dark:bg-gray-900 dark:border-gray-800 hover:shadow-xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium dark:text-gray-300">
              Jami O'quvchilar
            </CardTitle>
            <div className="size-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <Users className="size-5 text-green-600 dark:text-green-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600 dark:text-green-400">
              {enrollments.filter(e => myGroups.some(g => g.id === e.groupId)).length}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Barcha guruhlarda
            </p>
          </CardContent>
        </Card>

        <Card className="dark:bg-gray-900 dark:border-gray-800 hover:shadow-xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium dark:text-gray-300">
              Aktiv Guruhlar
            </CardTitle>
            <div className="size-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <BookOpen className="size-5 text-blue-600 dark:text-blue-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              {myGroups.filter(g => g.status === "active").length}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Joriy guruhlar
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {myGroups.map((group) => {
          const groupStudents = enrollments.filter((e) => e.groupId === group.id);
          const branch = branches.find((b) => b.id === group.branchId);
          const level = courseLevels.find((l) => l.id === group.courseLevelId);

          return (
            <Card 
              key={group.id} 
              className="hover:shadow-xl transition-all duration-300 dark:bg-gray-900 dark:border-gray-800"
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="size-14 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                      <Users className="size-7 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <CardTitle className="text-xl dark:text-white">{group.name}</CardTitle>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{level?.name}</p>
                    </div>
                  </div>
                  <Badge
                    className={
                      group.status === "active"
                        ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                        : "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300"
                    }
                  >
                    {group.status === "active" ? "Aktiv" : "Yig'ilmoqda"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 mb-4">
                  <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <Users className="size-5 text-gray-400 dark:text-gray-500" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {groupStudents.length} o'quvchi
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Guruhda ro'yxatdan o'tgan
                      </p>
                    </div>
                  </div>
                  {branch && (
                    <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <MapPin className="size-5 text-gray-400 dark:text-gray-500" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {branch.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {branch.address}
                        </p>
                      </div>
                    </div>
                  )}
                  {group.startDate && (
                    <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <Calendar className="size-5 text-gray-400 dark:text-gray-500" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {new Date(group.startDate).toLocaleDateString()}
                          {group.endDate && ` - ${new Date(group.endDate).toLocaleDateString()}`}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Kurs muddati
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Student List */}
                <div className="border-t dark:border-gray-800 pt-4">
                  <p className="text-sm font-semibold mb-3 text-gray-900 dark:text-white">
                    O'quvchilar:
                  </p>
                  <div className="space-y-2">
                    {groupStudents.slice(0, 5).map((enrollment) => {
                      const student = users.find((u) => u.id === enrollment.studentId);
                      if (!student) return null;
                      
                      return (
                        <div key={enrollment.id} className="flex items-center gap-3">
                          <Avatar className="size-8">
                            <AvatarImage src={student.photoUrl} />
                            <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-xs">
                              {student.firstName[0]}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            {student.firstName} {student.lastName}
                          </span>
                        </div>
                      );
                    })}
                    {groupStudents.length > 5 && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 pl-11">
                        +{groupStudents.length - 5} boshqa o'quvchi
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t dark:border-gray-800 flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                  >
                    Tafsilotlar
                  </Button>
                  <Button 
                    size="sm" 
                    className="flex-1 bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600"
                  >
                    Davomat
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}