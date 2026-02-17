import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { DollarSign, TrendingUp } from "lucide-react";
import { users } from "../../data/mockData";

interface SettlementsPageProps {
  teacherId: number;
}

export default function SettlementsPage({ teacherId }: SettlementsPageProps) {
  const teacher = users.find((u) => u.id === teacherId);
  const profile = teacher?.teacherProfile;

  const mockSettlements = [
    {
      id: 1,
      month: "January 2024",
      calculatedAmount: 1200,
      paidAmount: 1200,
      status: "paid",
      paidDate: "2024-02-05",
    },
    {
      id: 2,
      month: "February 2024",
      calculatedAmount: 1350,
      paidAmount: 1350,
      status: "paid",
      paidDate: "2024-03-05",
    },
    {
      id: 3,
      month: "March 2024",
      calculatedAmount: 1400,
      paidAmount: null,
      status: "pending",
      paidDate: null,
    },
  ];

  return (
    <div className="p-8">
      <div className="mb-6">
        <h2 className="text-3xl mb-2">Salary & Settlements</h2>
        <p className="text-slate-600">Track your earnings and payment history</p>
      </div>

      {/* Salary Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">Salary Type</CardTitle>
            <DollarSign className="size-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl capitalize">
              {profile?.salaryType.replace("_", " ") || "N/A"}
            </div>
            <p className="text-xs text-slate-500">Payment structure</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">Salary Value</CardTitle>
            <DollarSign className="size-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl text-green-600">
              ${profile ? Number(profile.salaryValue) : 0}
            </div>
            <p className="text-xs text-slate-500">
              {profile?.salaryType === "fixed"
                ? "Per month"
                : profile?.salaryType === "per_student"
                ? "Per student"
                : "Per hour"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">Total Earned (YTD)</CardTitle>
            <TrendingUp className="size-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl text-green-600">
              $
              {mockSettlements
                .filter((s) => s.paidAmount)
                .reduce((sum, s) => sum + (s.paidAmount || 0), 0)
                .toLocaleString()}
            </div>
            <p className="text-xs text-slate-500">Year to date</p>
          </CardContent>
        </Card>
      </div>

      {/* Settlements History */}
      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Period</TableHead>
                <TableHead>Calculated Amount</TableHead>
                <TableHead>Paid Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockSettlements
                .sort((a, b) => b.id - a.id)
                .map((settlement) => (
                  <TableRow key={settlement.id}>
                    <TableCell>
                      <p className="font-medium">{settlement.month}</p>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm">${settlement.calculatedAmount.toLocaleString()}</p>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm font-medium text-green-600">
                        {settlement.paidAmount ? `$${settlement.paidAmount.toLocaleString()}` : "—"}
                      </p>
                    </TableCell>
                    <TableCell>
                      {settlement.status === "paid" ? (
                        <Badge className="bg-green-100 text-green-800">Paid</Badge>
                      ) : settlement.status === "pending" ? (
                        <Badge className="bg-orange-100 text-orange-800">Pending</Badge>
                      ) : (
                        <Badge className="bg-slate-100 text-slate-800">{settlement.status}</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <p className="text-sm">
                        {settlement.paidDate
                          ? new Date(settlement.paidDate).toLocaleDateString()
                          : "—"}
                      </p>
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
