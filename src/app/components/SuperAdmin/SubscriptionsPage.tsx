import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { CreditCard, Plus } from "lucide-react";
import { tenantSubscriptions, subscriptionPlans, tenants } from "../../data/mockData";

export default function SubscriptionsPage() {
  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl mb-2">Subscription Plans</h2>
          <p className="text-slate-600">Manage pricing plans and subscriptions</p>
        </div>
        <Button className="bg-purple-600 hover:bg-purple-700">
          <Plus className="size-4 mr-2" />
          Create New Plan
        </Button>
      </div>

      {/* Plans Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {subscriptionPlans.map((plan) => {
          const activeCount = tenantSubscriptions.filter(
            (s) => s.planId === plan.id && s.status === "active"
          ).length;

          return (
            <Card key={plan.id} className="border-2 hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <div className="size-12 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-3">
                  <CreditCard className="size-6 text-purple-600" />
                </div>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <div className="text-3xl text-purple-600 my-4">
                  ${plan.monthlyPrice}
                  <span className="text-sm text-slate-500">/month</span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Max Students:</span>
                    <span className="font-medium">
                      {plan.maxStudents ? plan.maxStudents : "Unlimited"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Active Subscribers:</span>
                    <Badge className="bg-purple-100 text-purple-800">{activeCount}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Monthly Revenue:</span>
                    <span className="font-medium text-green-600">
                      ${(plan.monthlyPrice * activeCount).toLocaleString()}
                    </span>
                  </div>
                </div>
                <Button variant="outline" className="w-full">
                  Edit Plan
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Active Subscriptions */}
      <Card>
        <CardHeader>
          <CardTitle>Active Subscriptions</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tenant</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Monthly Price</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tenantSubscriptions.map((subscription) => {
                const tenant = tenants.find((t) => t.id === subscription.tenantId);
                const plan = subscriptionPlans.find((p) => p.id === subscription.planId);

                return (
                  <TableRow key={subscription.id}>
                    <TableCell>
                      <p>{tenant?.name}</p>
                      <p className="text-xs text-slate-500">{tenant?.subdomain}</p>
                    </TableCell>
                    <TableCell>
                      <p>{plan?.name}</p>
                    </TableCell>
                    <TableCell>
                      <p className="font-medium text-green-600">
                        ${plan?.monthlyPrice}
                      </p>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm">
                        {new Date(subscription.startDate).toLocaleDateString()}
                      </p>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm">
                        {new Date(subscription.endDate).toLocaleDateString()}
                      </p>
                    </TableCell>
                    <TableCell>
                      {subscription.status === "active" ? (
                        <Badge className="bg-green-100 text-green-800">Active</Badge>
                      ) : (
                        <Badge className="bg-red-100 text-red-800">
                          {subscription.status}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        Manage
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
