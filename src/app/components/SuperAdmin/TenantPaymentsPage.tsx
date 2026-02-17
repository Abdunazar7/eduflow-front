import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Plus, Search, DollarSign, Eye, Edit, Trash2, Download } from "lucide-react";
import { Input } from "../ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "../ui/dialog";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { toast } from "sonner";
import { tenants } from "../../data/mockData";

interface TenantPayment {
  id: number;
  tenantId: number;
  tenantName: string;
  amount: number;
  paymentType: "subscription" | "setup_fee" | "additional";
  paymentMethod: "bank_transfer" | "card" | "cash";
  status: "paid" | "pending" | "overdue" | "refunded";
  invoiceNumber: string;
  date: Date;
  dueDate?: Date;
  notes?: string;
}

const mockPayments: TenantPayment[] = [
  {
    id: 1,
    tenantId: 1,
    tenantName: "English Excellence Academy",
    amount: 299,
    paymentType: "subscription",
    paymentMethod: "bank_transfer",
    status: "paid",
    invoiceNumber: "INV-2026-001",
    date: new Date("2026-01-15"),
    notes: "January 2026 subscription"
  },
  {
    id: 2,
    tenantId: 2,
    tenantName: "Language Masters Center",
    amount: 799,
    paymentType: "subscription",
    paymentMethod: "card",
    status: "paid",
    invoiceNumber: "INV-2026-002",
    date: new Date("2026-01-20"),
    notes: "January 2026 subscription"
  },
  {
    id: 3,
    tenantId: 3,
    tenantName: "Global Speak Institute",
    amount: 99,
    paymentType: "subscription",
    paymentMethod: "bank_transfer",
    status: "pending",
    invoiceNumber: "INV-2026-003",
    date: new Date("2026-02-01"),
    dueDate: new Date("2026-02-15"),
    notes: "February 2026 subscription"
  },
  {
    id: 4,
    tenantId: 1,
    tenantName: "English Excellence Academy",
    amount: 500,
    paymentType: "setup_fee",
    paymentMethod: "bank_transfer",
    status: "paid",
    invoiceNumber: "INV-2026-004",
    date: new Date("2025-12-15"),
    notes: "Initial setup fee"
  },
];

export default function TenantPaymentsPage() {
  const [payments, setPayments] = useState<TenantPayment[]>(mockPayments);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<TenantPayment | null>(null);
  const [formData, setFormData] = useState<Partial<TenantPayment>>({
    paymentType: "subscription",
    paymentMethod: "bank_transfer",
    status: "pending"
  });

  const handleCreate = () => {
    if (!formData.tenantId || !formData.amount || !formData.invoiceNumber || !formData.date) {
      toast.error("Iltimos, barcha majburiy maydonlarni to'ldiring");
      return;
    }

    const tenant = tenants.find(t => t.id === formData.tenantId);
    const newPayment: TenantPayment = {
      id: Math.max(...payments.map(p => p.id)) + 1,
      tenantId: formData.tenantId,
      tenantName: tenant?.name || "",
      amount: formData.amount,
      paymentType: formData.paymentType as TenantPayment["paymentType"],
      paymentMethod: formData.paymentMethod as TenantPayment["paymentMethod"],
      status: formData.status as TenantPayment["status"],
      invoiceNumber: formData.invoiceNumber,
      date: new Date(formData.date),
      dueDate: formData.dueDate ? new Date(formData.dueDate) : undefined,
      notes: formData.notes
    };

    setPayments([newPayment, ...payments]);
    setIsCreateModalOpen(false);
    setFormData({
      paymentType: "subscription",
      paymentMethod: "bank_transfer",
      status: "pending"
    });
    toast.success("To'lov muvaffaqiyatli qo'shildi");
  };

  const handleEdit = () => {
    if (!selectedPayment || !formData.amount || !formData.invoiceNumber) {
      toast.error("Iltimos, barcha majburiy maydonlarni to'ldiring");
      return;
    }

    const tenant = tenants.find(t => t.id === formData.tenantId);
    setPayments(payments.map(p => 
      p.id === selectedPayment.id 
        ? {
            ...p,
            tenantId: formData.tenantId || p.tenantId,
            tenantName: tenant?.name || p.tenantName,
            amount: formData.amount,
            paymentType: formData.paymentType as TenantPayment["paymentType"],
            paymentMethod: formData.paymentMethod as TenantPayment["paymentMethod"],
            status: formData.status as TenantPayment["status"],
            invoiceNumber: formData.invoiceNumber,
            date: formData.date ? new Date(formData.date) : p.date,
            dueDate: formData.dueDate ? new Date(formData.dueDate) : p.dueDate,
            notes: formData.notes
          }
        : p
    ));
    setIsEditModalOpen(false);
    setSelectedPayment(null);
    setFormData({
      paymentType: "subscription",
      paymentMethod: "bank_transfer",
      status: "pending"
    });
    toast.success("To'lov ma'lumotlari yangilandi");
  };

  const handleDelete = (payment: TenantPayment) => {
    if (window.confirm(`${payment.invoiceNumber} raqamli to'lovni o'chirmoqchimisiz?`)) {
      setPayments(payments.filter(p => p.id !== payment.id));
      toast.success("To'lov o'chirildi");
    }
  };

  const openCreateModal = () => {
    setFormData({
      paymentType: "subscription",
      paymentMethod: "bank_transfer",
      status: "pending",
      date: new Date().toISOString().split('T')[0]
    });
    setIsCreateModalOpen(true);
  };

  const openEditModal = (payment: TenantPayment) => {
    setSelectedPayment(payment);
    setFormData({
      tenantId: payment.tenantId,
      amount: payment.amount,
      paymentType: payment.paymentType,
      paymentMethod: payment.paymentMethod,
      status: payment.status,
      invoiceNumber: payment.invoiceNumber,
      date: payment.date.toISOString().split('T')[0],
      dueDate: payment.dueDate?.toISOString().split('T')[0],
      notes: payment.notes
    });
    setIsEditModalOpen(true);
  };

  const openViewModal = (payment: TenantPayment) => {
    setSelectedPayment(payment);
    setIsViewModalOpen(true);
  };

  const filteredPayments = payments.filter(payment =>
    payment.tenantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalRevenue = payments
    .filter(p => p.status === "paid")
    .reduce((sum, p) => sum + p.amount, 0);

  const pendingRevenue = payments
    .filter(p => p.status === "pending")
    .reduce((sum, p) => sum + p.amount, 0);

  const getStatusBadge = (status: TenantPayment["status"]) => {
    const styles = {
      paid: "bg-green-100 text-green-800",
      pending: "bg-yellow-100 text-yellow-800",
      overdue: "bg-red-100 text-red-800",
      refunded: "bg-gray-100 text-gray-800"
    };
    return <Badge className={styles[status]}>{status}</Badge>;
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl mb-2">Tenant Payments</h2>
          <p className="text-slate-600">Manage payments from all tenants</p>
        </div>
        <Button onClick={openCreateModal} className="bg-purple-600 hover:bg-purple-700">
          <Plus className="size-4 mr-2" />
          Add Payment
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Total Revenue</p>
                <p className="text-2xl mt-1">${totalRevenue.toLocaleString()}</p>
              </div>
              <div className="size-12 rounded-full bg-green-100 flex items-center justify-center">
                <DollarSign className="size-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Pending Payments</p>
                <p className="text-2xl mt-1">${pendingRevenue.toLocaleString()}</p>
              </div>
              <div className="size-12 rounded-full bg-yellow-100 flex items-center justify-center">
                <DollarSign className="size-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Total Transactions</p>
                <p className="text-2xl mt-1">{payments.length}</p>
              </div>
              <div className="size-12 rounded-full bg-purple-100 flex items-center justify-center">
                <Download className="size-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
            <Input
              placeholder="Search by tenant name or invoice number..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Payments Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Payments ({filteredPayments.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice #</TableHead>
                <TableHead>Tenant</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPayments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell>
                    <code className="text-sm bg-slate-100 px-2 py-1 rounded">
                      {payment.invoiceNumber}
                    </code>
                  </TableCell>
                  <TableCell>{payment.tenantName}</TableCell>
                  <TableCell className="font-semibold">
                    ${payment.amount.toLocaleString()}
                  </TableCell>
                  <TableCell className="capitalize">{payment.paymentType.replace('_', ' ')}</TableCell>
                  <TableCell className="capitalize">{payment.paymentMethod.replace('_', ' ')}</TableCell>
                  <TableCell>{getStatusBadge(payment.status)}</TableCell>
                  <TableCell>{payment.date.toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openViewModal(payment)}
                      >
                        <Eye className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditModal(payment)}
                      >
                        <Edit className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(payment)}
                      >
                        <Trash2 className="size-4 text-red-600" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Create Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Payment</DialogTitle>
            <DialogDescription>Create a new payment record from a tenant</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="tenant">Tenant *</Label>
              <Select
                value={formData.tenantId?.toString()}
                onValueChange={(value) => setFormData({ ...formData, tenantId: parseInt(value) })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select tenant" />
                </SelectTrigger>
                <SelectContent>
                  {tenants.map(tenant => (
                    <SelectItem key={tenant.id} value={tenant.id.toString()}>
                      {tenant.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="invoice">Invoice Number *</Label>
              <Input
                id="invoice"
                value={formData.invoiceNumber || ""}
                onChange={(e) => setFormData({ ...formData, invoiceNumber: e.target.value })}
                placeholder="INV-2026-XXX"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Amount ($) *</Label>
              <Input
                id="amount"
                type="number"
                value={formData.amount || ""}
                onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
                placeholder="0.00"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Payment Type *</Label>
              <Select
                value={formData.paymentType}
                onValueChange={(value) => setFormData({ ...formData, paymentType: value as TenantPayment["paymentType"] })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="subscription">Subscription</SelectItem>
                  <SelectItem value="setup_fee">Setup Fee</SelectItem>
                  <SelectItem value="additional">Additional</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="method">Payment Method *</Label>
              <Select
                value={formData.paymentMethod}
                onValueChange={(value) => setFormData({ ...formData, paymentMethod: value as TenantPayment["paymentMethod"] })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                  <SelectItem value="card">Card</SelectItem>
                  <SelectItem value="cash">Cash</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status *</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value as TenantPayment["status"] })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                  <SelectItem value="refunded">Refunded</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Payment Date *</Label>
              <Input
                id="date"
                type="date"
                value={formData.date as string || ""}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date</Label>
              <Input
                id="dueDate"
                type="date"
                value={formData.dueDate as string || ""}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              />
            </div>

            <div className="col-span-2 space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Input
                id="notes"
                value={formData.notes || ""}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Additional notes..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreate} className="bg-purple-600 hover:bg-purple-700">
              Create Payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Payment</DialogTitle>
            <DialogDescription>Update payment information</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-tenant">Tenant *</Label>
              <Select
                value={formData.tenantId?.toString()}
                onValueChange={(value) => setFormData({ ...formData, tenantId: parseInt(value) })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select tenant" />
                </SelectTrigger>
                <SelectContent>
                  {tenants.map(tenant => (
                    <SelectItem key={tenant.id} value={tenant.id.toString()}>
                      {tenant.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-invoice">Invoice Number *</Label>
              <Input
                id="edit-invoice"
                value={formData.invoiceNumber || ""}
                onChange={(e) => setFormData({ ...formData, invoiceNumber: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-amount">Amount ($) *</Label>
              <Input
                id="edit-amount"
                type="number"
                value={formData.amount || ""}
                onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-type">Payment Type *</Label>
              <Select
                value={formData.paymentType}
                onValueChange={(value) => setFormData({ ...formData, paymentType: value as TenantPayment["paymentType"] })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="subscription">Subscription</SelectItem>
                  <SelectItem value="setup_fee">Setup Fee</SelectItem>
                  <SelectItem value="additional">Additional</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-method">Payment Method *</Label>
              <Select
                value={formData.paymentMethod}
                onValueChange={(value) => setFormData({ ...formData, paymentMethod: value as TenantPayment["paymentMethod"] })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                  <SelectItem value="card">Card</SelectItem>
                  <SelectItem value="cash">Cash</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-status">Status *</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value as TenantPayment["status"] })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                  <SelectItem value="refunded">Refunded</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-date">Payment Date *</Label>
              <Input
                id="edit-date"
                type="date"
                value={formData.date as string || ""}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-dueDate">Due Date</Label>
              <Input
                id="edit-dueDate"
                type="date"
                value={formData.dueDate as string || ""}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              />
            </div>

            <div className="col-span-2 space-y-2">
              <Label htmlFor="edit-notes">Notes</Label>
              <Input
                id="edit-notes"
                value={formData.notes || ""}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEdit} className="bg-purple-600 hover:bg-purple-700">
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Payment Details</DialogTitle>
            <DialogDescription>View complete payment information</DialogDescription>
          </DialogHeader>
          {selectedPayment && (
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Invoice Number</p>
                  <code className="text-sm bg-slate-100 px-2 py-1 rounded">
                    {selectedPayment.invoiceNumber}
                  </code>
                </div>
                <div>
                  <p className="text-sm text-slate-600 mb-1">Status</p>
                  {getStatusBadge(selectedPayment.status)}
                </div>
                <div>
                  <p className="text-sm text-slate-600 mb-1">Tenant</p>
                  <p className="font-medium">{selectedPayment.tenantName}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 mb-1">Amount</p>
                  <p className="text-xl font-semibold text-green-600">
                    ${selectedPayment.amount.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 mb-1">Payment Type</p>
                  <p className="capitalize">{selectedPayment.paymentType.replace('_', ' ')}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 mb-1">Payment Method</p>
                  <p className="capitalize">{selectedPayment.paymentMethod.replace('_', ' ')}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 mb-1">Payment Date</p>
                  <p>{selectedPayment.date.toLocaleDateString()}</p>
                </div>
                {selectedPayment.dueDate && (
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Due Date</p>
                    <p>{selectedPayment.dueDate.toLocaleDateString()}</p>
                  </div>
                )}
              </div>
              {selectedPayment.notes && (
                <div>
                  <p className="text-sm text-slate-600 mb-1">Notes</p>
                  <p className="text-sm bg-slate-50 p-3 rounded">{selectedPayment.notes}</p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewModalOpen(false)}>
              Close
            </Button>
            <Button
              onClick={() => {
                if (selectedPayment) {
                  setIsViewModalOpen(false);
                  openEditModal(selectedPayment);
                }
              }}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Edit className="size-4 mr-2" />
              Edit Payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
