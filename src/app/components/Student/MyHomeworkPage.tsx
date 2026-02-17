import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { ClipboardList, Upload } from "lucide-react";
import { Button } from "../ui/button";

interface MyHomeworkPageProps {
  studentId: number;
}

export default function MyHomeworkPage({ studentId }: MyHomeworkPageProps) {
  const mockHomework = [
    {
      id: 1,
      title: "Unit 1 - Grammar Exercise",
      group: "A1-Morning-01",
      dueDate: "2024-02-15",
      status: "submitted",
      submittedAt: "2024-02-14",
      score: 8,
      maxScore: 10,
    },
    {
      id: 2,
      title: "Reading Comprehension",
      group: "A1-Morning-01",
      dueDate: "2024-02-20",
      status: "pending",
      submittedAt: null,
      score: null,
      maxScore: 10,
    },
    {
      id: 3,
      title: "Vocabulary Quiz",
      group: "A1-Morning-01",
      dueDate: "2024-02-10",
      status: "graded",
      submittedAt: "2024-02-09",
      score: 9,
      maxScore: 10,
    },
  ];

  const pending = mockHomework.filter((h) => h.status === "pending").length;
  const submitted = mockHomework.filter((h) => h.status === "submitted").length;
  const graded = mockHomework.filter((h) => h.status === "graded").length;

  const avgScore =
    graded > 0
      ? mockHomework
          .filter((h) => h.score !== null)
          .reduce((sum, h) => sum + (h.score || 0), 0) / graded
      : 0;

  return (
    <div className="p-8">
      <div className="mb-6">
        <h2 className="text-3xl mb-2">My Homework</h2>
        <p className="text-slate-600">View and submit your assignments</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Total Homework</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{mockHomework.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl text-orange-600">{pending}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Submitted</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl text-blue-600">{submitted}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Average Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl text-green-600">{avgScore.toFixed(1)}/10</div>
          </CardContent>
        </Card>
      </div>

      {/* Homework List */}
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
                {hw.status === "pending" ? (
                  <Badge className="bg-orange-100 text-orange-800">Pending</Badge>
                ) : hw.status === "submitted" ? (
                  <Badge className="bg-blue-100 text-blue-800">Submitted</Badge>
                ) : (
                  <Badge className="bg-green-100 text-green-800">Graded</Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Due Date:</span>
                  <span className="text-sm font-medium">
                    {new Date(hw.dueDate).toLocaleDateString()}
                  </span>
                </div>

                {hw.submittedAt && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Submitted:</span>
                    <span className="text-sm">
                      {new Date(hw.submittedAt).toLocaleDateString()}
                    </span>
                  </div>
                )}

                {hw.score !== null && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Score:</span>
                    <span className="text-lg font-medium text-green-600">
                      {hw.score}/{hw.maxScore}
                    </span>
                  </div>
                )}

                {hw.status === "graded" && hw.score !== null && (
                  <div className="pt-2">
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full"
                        style={{ width: `${(hw.score / hw.maxScore) * 100}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-4 border-t">
                {hw.status === "pending" ? (
                  <Button className="w-full bg-orange-600 hover:bg-orange-700">
                    <Upload className="size-4 mr-2" />
                    Submit Homework
                  </Button>
                ) : hw.status === "submitted" ? (
                  <Button variant="outline" className="w-full">
                    View Submission
                  </Button>
                ) : (
                  <Button variant="outline" className="w-full">
                    View Feedback
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
