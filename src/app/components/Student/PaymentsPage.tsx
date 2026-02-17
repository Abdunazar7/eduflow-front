import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Button } from "../ui/button";
import { DollarSign, Plus, TrendingUp, TrendingDown, CreditCard } from "lucide-react";
import { users, transactions } from "../../data/mockData";

interface PaymentsPageProps {
  studentId: number;
}

export default function PaymentsPage({ studentId }: PaymentsPageProps) {
  const student = users.find((u) => u.id === studentId);
  const profile = student?.studentProfile;
  const balance = Number(profile?.balance || 0);

  const myTransactions = transactions.filter((t) => t.userId === studentId);
  const totalPaid = myTransactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl mb-2">Payments & Balance</h2>
          <p className="text-slate-600">Manage your account balance and payment history</p>
        </div>
        <Button className="bg-orange-600 hover:bg-orange-700">
          <Plus className="size-4 mr-2" />
          Make Payment
        </Button>
      </div>

      {/* Balance Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">Current Balance</CardTitle>
            <DollarSign className="size-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl ${balance >= 0 ? "text-green-600" : "text-red-600"}`}>
              ${Math.abs(balance).toLocaleString()}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {balance >= 0 ? "Credit balance" : "Payment due"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">Total Paid</CardTitle>
            <TrendingUp className="size-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl text-green-600">${totalPaid.toLocaleString()}</div>
            <p className="text-xs text-slate-500 mt-1">All time payments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">Discount</CardTitle>
            <TrendingDown className="size-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl text-purple-600">{profile?.discountPercent || 0}%</div>
            <p className="text-xs text-slate-500 mt-1">Applied discount</p>
          </CardContent>
        </Card>
      </div>

      {/* Balance Alert */}
      {balance < 0 && (
        <Card className="mb-6 border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <DollarSign className="size-5 text-red-600 mt-0.5" />
              <div className="flex-1">
                <p className="font-medium text-red-800">Payment Required</p>
                <p className="text-sm text-red-600 mt-1">
                  You have an outstanding balance of ${Math.abs(balance)}. Please make a payment to
                  continue your courses.
                </p>
              </div>
              <Button className="bg-red-600 hover:bg-red-700">
                Pay Now
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Payment History */}
      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Payment Method</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {myTransactions
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .map((transaction) => {
                  const amount = Number(transaction.amount);

                  return (
                    <TableRow key={transaction.id}>
                      <TableCell>
                        <p className="text-sm">
                          {new Date(transaction.createdAt).toLocaleDateString()}
                        </p>
                        <p className="text-xs text-slate-500">
                          {new Date(transaction.createdAt).toLocaleTimeString()}
                        </p>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <CreditCard className="size-4 text-slate-400" />
                          <div>
                            <p className="text-sm font-medium capitalize">
                              {transaction.category || "Payment"}
                            </p>
                            <p className="text-xs text-slate-500">{transaction.type}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm capitalize">
                          {transaction.paymentMethod?.replace("_", " ") || "N/A"}
                        </p>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm font-medium text-green-600">
                          ${amount.toLocaleString()}
                        </p>
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-green-100 text-green-800">Completed</Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              {myTransactions.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-slate-500 py-8">
                    No payment history yet
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
