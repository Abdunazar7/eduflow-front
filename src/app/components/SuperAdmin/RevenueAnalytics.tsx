import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { DollarSign, TrendingUp, TrendingDown, CreditCard } from "lucide-react";
import { tenantSubscriptions, subscriptionPlans } from "../../data/mockData";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function RevenueAnalytics() {
  const totalMRR = tenantSubscriptions
    .filter((s) => s.status === "active")
    .reduce((sum, sub) => {
      const plan = subscriptionPlans.find((p) => p.id === sub.planId);
      return sum + (plan?.monthlyPrice || 0);
    }, 0);

  const revenueByMonth = [
    { month: "Jan", revenue: 1800, newTenants: 1 },
    { month: "Feb", revenue: 1800, newTenants: 0 },
    { month: "Mar", revenue: 2100, newTenants: 1 },
    { month: "Apr", revenue: 2100, newTenants: 0 },
    { month: "May", revenue: 2100, newTenants: 0 },
    { month: "Jun", revenue: 2199, newTenants: 1 },
  ];

  const planDistribution = subscriptionPlans.map((plan) => ({
    name: plan.name,
    value: tenantSubscriptions.filter((s) => s.planId === plan.id && s.status === "active").length,
    revenue: tenantSubscriptions
      .filter((s) => s.planId === plan.id && s.status === "active")
      .reduce((sum) => sum + plan.monthlyPrice, 0),
  }));

  const COLORS = ["#8b5cf6", "#3b82f6", "#10b981"];

  const avgRevenuePerTenant =
    totalMRR / tenantSubscriptions.filter((s) => s.status === "active").length;

  return (
    <div className="p-8">
      <div className="mb-6">
        <h2 className="text-3xl mb-2">Revenue Analytics</h2>
        <p className="text-slate-600">Monitor revenue trends and financial performance</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">Total MRR</CardTitle>
            <DollarSign className="size-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">${totalMRR.toLocaleString()}</div>
            <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
              <TrendingUp className="size-3" />
              +12.5% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">Avg Revenue/Tenant</CardTitle>
            <CreditCard className="size-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">${avgRevenuePerTenant.toFixed(0)}</div>
            <p className="text-xs text-slate-500 mt-1">Per tenant monthly</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">Annual Run Rate</CardTitle>
            <TrendingUp className="size-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">${(totalMRR * 12).toLocaleString()}</div>
            <p className="text-xs text-slate-500 mt-1">ARR projection</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">Churn Rate</CardTitle>
            <TrendingDown className="size-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">2.3%</div>
            <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
              -0.5% improvement
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Recurring Revenue Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueByMonth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  name="MRR"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>New Tenants by Month</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueByMonth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="newTenants" fill="#8b5cf6" name="New Tenants" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Revenue by Plan</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={planDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {planDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Revenue Distribution by Plan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {planDistribution.map((plan, index) => (
                <div key={plan.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className="size-3 rounded-full"
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                      <span className="text-sm">{plan.name}</span>
                    </div>
                    <span className="text-sm font-medium">${plan.revenue}</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div
                      className="h-2 rounded-full"
                      style={{
                        width: `${(plan.revenue / totalMRR) * 100}%`,
                        backgroundColor: COLORS[index % COLORS.length],
                      }}
                    />
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
