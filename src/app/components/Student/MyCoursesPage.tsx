import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { BookOpen, User, Calendar, DollarSign } from "lucide-react";
import { getEnrollmentsByStudentId, groups, users, courseLevels, courses } from "../../data/mockData";

interface MyCoursesPageProps {
  studentId: number;
}

export default function MyCoursesPage({ studentId }: MyCoursesPageProps) {
  const enrollments = getEnrollmentsByStudentId(studentId);

  return (
    <div className="p-8">
      <div className="mb-6">
        <h2 className="text-3xl mb-2">My Courses</h2>
        <p className="text-slate-600">View your enrolled courses and progress</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {enrollments.map((enrollment) => {
          const group = groups.find((g) => g.id === enrollment.groupId);
          const teacher = users.find((u) => u.id === group?.teacherId);
          const level = courseLevels.find((l) => l.id === group?.courseLevelId);
          const course = courses.find((c) => c.id === level?.courseId);

          return (
            <Card key={enrollment.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="size-12 rounded-lg bg-orange-100 flex items-center justify-center">
                      <BookOpen className="size-6 text-orange-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{group?.name}</CardTitle>
                      <p className="text-sm text-slate-500">{course?.name}</p>
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
              </CardHeader>
              <CardContent>
                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <BookOpen className="size-4 text-slate-400" />
                    <span className="text-slate-600">Level: {level?.name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <User className="size-4 text-slate-400" />
                    <span className="text-slate-600">
                      Teacher: {teacher?.firstName} {teacher?.lastName}
                    </span>
                  </div>
                  {group?.startDate && (
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="size-4 text-slate-400" />
                      <span className="text-slate-600">
                        Started: {new Date(group.startDate).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  {enrollment.contractPrice && (
                    <div className="flex items-center gap-2 text-sm">
                      <DollarSign className="size-4 text-slate-400" />
                      <span className="text-slate-600">
                        Contract Price: ${Number(enrollment.contractPrice)}
                      </span>
                    </div>
                  )}
                </div>

                <div className="border-t pt-4">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-slate-600">Progress</span>
                    <span className="font-medium">65%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div className="bg-orange-600 h-2 rounded-full" style={{ width: "65%" }} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}

        {enrollments.length === 0 && (
          <Card className="col-span-2">
            <CardContent className="py-12 text-center">
              <p className="text-slate-500">No enrolled courses yet</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
