import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Building2, CreditCard, DollarSign, TrendingUp } from "lucide-react";
import { tenants, tenantSubscriptions, subscriptionPlans, transactions } from "../../data/mockData";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";

export default function SuperAdminOverview() {
  const activeTenants = tenants.filter((t) => t.isActive).length;
  const activeSubscriptions = tenantSubscriptions.filter((s) => s.status === "active").length;
  
  const totalRevenue = tenantSubscriptions
    .filter((s) => s.status === "active")
    .reduce((sum, sub) => {
      const plan = subscriptionPlans.find((p) => p.id === sub.planId);
      return sum + (plan?.monthlyPrice || 0);
    }, 0);

  const monthlyGrowth = 15.3; // Mock data

  const tenantsByPlan = subscriptionPlans.map((plan) => ({
    name: plan.name,
    count: tenantSubscriptions.filter((s) => s.planId === plan.id && s.status === "active").length,
  }));

  const revenueData = [
    { month: "Jan", revenue: 2400 },
    { month: "Feb", revenue: 3200 },
    { month: "Mar", revenue: 2800 },
    { month: "Apr", revenue: 3800 },
    { month: "May", revenue: 4200 },
    { month: "Jun", revenue: 4800 },
  ];

  return (
    <div className="p-8">
      <div className="mb-6">
        <h2 className="text-3xl mb-2">System Overview</h2>
        <p className="text-slate-600">Monitor all tenants and platform performance</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">Active Tenants</CardTitle>
            <Building2 className="size-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{activeTenants}</div>
            <p className="text-xs text-slate-500">Educational centers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">Active Subscriptions</CardTitle>
            <CreditCard className="size-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{activeSubscriptions}</div>
            <p className="text-xs text-slate-500">Paying customers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">Monthly Recurring Revenue</CardTitle>
            <DollarSign className="size-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">${totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-slate-500">Total MRR</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">Growth Rate</CardTitle>
            <TrendingUp className="size-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">+{monthlyGrowth}%</div>
            <p className="text-xs text-slate-500">vs last month</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="revenue" stroke="#8b5cf6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tenants by Plan</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={tenantsByPlan}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#8b5cf6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Tenants */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Tenants</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {tenants.slice(0, 5).map((tenant) => {
              const subscription = tenantSubscriptions.find((s) => s.tenantId === tenant.id);
              const plan = subscription
                ? subscriptionPlans.find((p) => p.id === subscription.planId)
                : null;

              return (
                <div key={tenant.id} className="flex items-center justify-between py-3 border-b last:border-0">
                  <div className="flex items-center gap-4">
                    <div className="size-10 rounded-full bg-purple-100 flex items-center justify-center">
                      <Building2 className="size-5 text-purple-600" />
                    </div>
                    <div>
                      <p>{tenant.name}</p>
                      <p className="text-sm text-slate-500">{tenant.subdomain}.lms.com</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm">{plan?.name || "No plan"}</p>
                    <p className="text-xs text-slate-500">
                      {tenant.isActive ? (
                        <span className="text-green-600">Active</span>
                      ) : (
                        <span className="text-red-600">Inactive</span>
                      )}
                    </p>
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
