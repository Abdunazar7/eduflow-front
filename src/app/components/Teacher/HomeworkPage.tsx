import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { ClipboardList, Plus } from "lucide-react";
import { Button } from "../ui/button";

interface HomeworkPageProps {
  teacherId: number;
}

export default function HomeworkPage({ teacherId }: HomeworkPageProps) {
  const mockHomework = [
    {
      id: 1,
      title: "Unit 1 - Grammar Exercise",
      group: "A1-Morning-01",
      dueDate: "2024-02-15",
      submissions: 8,
      totalStudents: 10,
      graded: 6,
    },
    {
      id: 2,
      title: "Reading Comprehension",
      group: "B1-Business-01",
      dueDate: "2024-02-18",
      submissions: 5,
      totalStudents: 8,
      graded: 3,
    },
  ];

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl mb-2">Homework Management</h2>
          <p className="text-slate-600">Assign and grade homework</p>
        </div>
        <Button className="bg-green-600 hover:bg-green-700">
          <Plus className="size-4 mr-2" />
          Create Homework
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {mockHomework.map((hw) => (
          <Card key={hw.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="size-12 rounded-lg bg-purple-100 flex items-center justify-center">
                    <ClipboardList className="size-6 text-purple-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{hw.title}</CardTitle>
                    <p className="text-sm text-slate-500">{hw.group}</p>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Due Date:</span>
                  <Badge variant="outline">{new Date(hw.dueDate).toLocaleDateString()}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Submissions:</span>
                  <Badge className="bg-blue-100 text-blue-800">
                    {hw.submissions}/{hw.totalStudents}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Graded:</span>
                  <Badge
                    className={
                      hw.graded === hw.submissions
                        ? "bg-green-100 text-green-800"
                        : "bg-orange-100 text-orange-800"
                    }
                  >
                    {hw.graded}/{hw.submissions}
                  </Badge>
                </div>

                {/* Progress Bar */}
                <div className="pt-2">
                  <div className="flex items-center justify-between text-xs text-slate-600 mb-1">
                    <span>Grading Progress</span>
                    <span>{Math.round((hw.graded / hw.submissions) * 100)}%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full transition-all"
                      style={{ width: `${(hw.graded / hw.submissions) * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  View Submissions
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  Grade
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
