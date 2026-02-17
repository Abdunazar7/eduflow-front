import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { DollarSign, Plus, TrendingUp, TrendingDown, ArrowUpCircle, ArrowDownCircle } from "lucide-react";
import { getTransactionsByTenantId, users } from "../../data/mockData";

interface TransactionsPageProps {
  tenantId: number;
}

export default function TransactionsPage({ tenantId }: TransactionsPageProps) {
  const transactions = getTransactionsByTenantId(tenantId);

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const netIncome = totalIncome - totalExpense;

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl mb-2">Financial Transactions</h2>
          <p className="text-slate-600">Track income and expenses</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="size-4 mr-2" />
          Add Transaction
        </Button>
      </div>

      {/* Financial Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">Total Income</CardTitle>
            <ArrowUpCircle className="size-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl text-green-600">${totalIncome.toLocaleString()}</div>
            <p className="text-xs text-slate-500 mt-1">From student payments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">Total Expenses</CardTitle>
            <ArrowDownCircle className="size-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl text-red-600">${totalExpense.toLocaleString()}</div>
            <p className="text-xs text-slate-500 mt-1">Salaries and costs</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">Net Income</CardTitle>
            <DollarSign className="size-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl ${netIncome >= 0 ? "text-green-600" : "text-red-600"}`}>
              ${netIncome.toLocaleString()}
            </div>
            <p className="text-xs text-slate-500 mt-1">Profit this period</p>
          </CardContent>
        </Card>
      </div>

      {/* Transactions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions ({transactions.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Payment Method</TableHead>
                <TableHead>Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .map((transaction) => {
                  const user = users.find((u) => u.id === transaction.userId);
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
                        {transaction.type === "income" ? (
                          <Badge className="bg-green-100 text-green-800">
                            <TrendingUp className="size-3 mr-1" />
                            Income
                          </Badge>
                        ) : (
                          <Badge className="bg-red-100 text-red-800">
                            <TrendingDown className="size-3 mr-1" />
                            Expense
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{transaction.category || "Other"}</Badge>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm">
                          {user ? `${user.firstName} ${user.lastName}` : "N/A"}
                        </p>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm capitalize">
                          {transaction.paymentMethod?.replace("_", " ") || "N/A"}
                        </p>
                      </TableCell>
                      <TableCell>
                        <p
                          className={`text-sm font-medium ${
                            transaction.type === "income" ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {transaction.type === "income" ? "+" : "-"}${amount.toLocaleString()}
                        </p>
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
