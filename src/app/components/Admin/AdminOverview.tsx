import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { GraduationCap, Users, BookOpen, DollarSign, TrendingUp, AlertCircle } from "lucide-react";
import {
  getStudentsByTenantId,
  getTeachersByTenantId,
  getGroupsByTenantId,
  getLeadsByTenantId,
  getTransactionsByTenantId,
  getTenantById,
  leadStatuses,
} from "../../data/mockData";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Badge } from "../ui/badge";

interface AdminOverviewProps {
  tenantId: number;
}

export default function AdminOverview({ tenantId }: AdminOverviewProps) {
  const tenant = getTenantById(tenantId);
  const students = getStudentsByTenantId(tenantId);
  const teachers = getTeachersByTenantId(tenantId);
  const groups = getGroupsByTenantId(tenantId);
  const leads = getLeadsByTenantId(tenantId);
  const transactions = getTransactionsByTenantId(tenantId);

  const activeGroups = groups.filter((g) => g.status === "active").length;
  const totalRevenue = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const monthlyData = [
    { month: "Jan", students: 45, revenue: 8500 },
    { month: "Feb", students: 52, revenue: 9800 },
    { month: "Mar", students: 58, revenue: 10500 },
    { month: "Apr", students: 65, revenue: 12000 },
    { month: "May", students: 71, revenue: 13200 },
    { month: "Jun", students: 78, revenue: 14500 },
  ];

  const leadsByStatus = leadStatuses.map((status) => ({
    name: status.name,
    count: leads.filter((l) => l.statusId === status.id).length,
  }));

  return (
    <div className="p-8">
      <div className="mb-6">
        <h2 className="text-3xl mb-2">{tenant?.name} Dashboard</h2>
        <p className="text-slate-600">Overview of your educational center</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">Total Students</CardTitle>
            <GraduationCap className="size-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{students.length}</div>
            <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
              <TrendingUp className="size-3" />
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">Active Teachers</CardTitle>
            <Users className="size-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{teachers.length}</div>
            <p className="text-xs text-slate-500">Teaching staff</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">Active Groups</CardTitle>
            <BookOpen className="size-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{activeGroups}</div>
            <p className="text-xs text-slate-500">Out of {groups.length} total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">Total Revenue</CardTitle>
            <DollarSign className="size-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">${totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-slate-500">This period</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Student Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="students" stroke="#3b82f6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="revenue" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Lead Pipeline</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={leadsByStatus} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={100} />
                <Tooltip />
                <Bar dataKey="count" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3 pb-3 border-b">
                <div className="size-2 rounded-full bg-green-500 mt-2" />
                <div className="flex-1">
                  <p className="text-sm">New student enrolled in A1-Morning-01</p>
                  <p className="text-xs text-slate-500">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-start gap-3 pb-3 border-b">
                <div className="size-2 rounded-full bg-blue-500 mt-2" />
                <div className="flex-1">
                  <p className="text-sm">Payment received - $200.00</p>
                  <p className="text-xs text-slate-500">5 hours ago</p>
                </div>
              </div>
              <div className="flex items-start gap-3 pb-3 border-b">
                <div className="size-2 rounded-full bg-purple-500 mt-2" />
                <div className="flex-1">
                  <p className="text-sm">New lead assigned from Instagram</p>
                  <p className="text-xs text-slate-500">1 day ago</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="size-2 rounded-full bg-orange-500 mt-2" />
                <div className="flex-1">
                  <p className="text-sm">Group B1-Business-01 started</p>
                  <p className="text-xs text-slate-500">2 days ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Alerts & Reminders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg">
                <AlertCircle className="size-5 text-red-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium">3 students with negative balance</p>
                  <p className="text-xs text-slate-600 mt-1">Follow up on overdue payments</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg">
                <AlertCircle className="size-5 text-orange-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium">5 new leads to contact</p>
                  <p className="text-xs text-slate-600 mt-1">Respond within 24 hours</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                <AlertCircle className="size-5 text-blue-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium">2 groups need schedule confirmation</p>
                  <p className="text-xs text-slate-600 mt-1">Finalize class times</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Performing Groups</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {groups.slice(0, 3).map((group, index) => (
                <div key={group.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="size-8 rounded-full bg-blue-100 flex items-center justify-center text-sm font-medium text-blue-600">
                      #{index + 1}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{group.name}</p>
                      <p className="text-xs text-slate-500">
                        {group.status === "active" ? (
                          <Badge className="bg-green-100 text-green-800 text-xs">Active</Badge>
                        ) : (
                          <Badge className="bg-orange-100 text-orange-800 text-xs">
                            {group.status}
                          </Badge>
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">95%</p>
                    <p className="text-xs text-slate-500">Attendance</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
