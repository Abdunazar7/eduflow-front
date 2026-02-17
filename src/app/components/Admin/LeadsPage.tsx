import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Textarea } from "../ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { UserPlus, Plus, Phone, Edit, Trash2, MessageSquare } from "lucide-react";
import { getLeadsByTenantId, leadStatuses, users } from "../../data/mockData";
import { toast } from "sonner";
import ConfirmDialog from "../shared/ConfirmDialog";
import PhoneVerification from "../shared/PhoneVerification";

interface LeadsPageProps {
  tenantId: number;
}

interface Lead {
  id: number;
  tenantId: number;
  firstName: string;
  lastName: string;
  phone: string;
  statusId: number;
  assignedToId?: number;
  notes?: string;
  createdAt: Date;
}

export default function LeadsPage({ tenantId }: LeadsPageProps) {
  const [leads, setLeads] = useState<Lead[]>(getLeadsByTenantId(tenantId));
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    statusId: "1",
    assignedToId: "",
    notes: "",
  });

  const staff = users.filter((u) => u.tenantId === tenantId && ["Admin", "Manager", "Staff"].includes(u.role.name));

  const resetForm = () => {
    setFormData({
      firstName: "",
      lastName: "",
      phone: "",
      statusId: "1",
      assignedToId: "",
      notes: "",
    });
    setIsPhoneVerified(false);
  };

  const handleCreate = () => {
    if (!formData.firstName || !formData.lastName || !formData.phone) {
      toast.error("Iltimos, barcha majburiy maydonlarni to'ldiring");
      return;
    }

    if (!isPhoneVerified) {
      toast.error("Telefon raqamini tasdiqlang");
      return;
    }

    const newLead: Lead = {
      id: Math.max(...leads.map((l) => l.id), 0) + 1,
      tenantId,
      firstName: formData.firstName,
      lastName: formData.lastName,
      phone: formData.phone,
      statusId: parseInt(formData.statusId),
      assignedToId: formData.assignedToId ? parseInt(formData.assignedToId) : undefined,
      notes: formData.notes || undefined,
      createdAt: new Date(),
    };

    setLeads([...leads, newLead]);
    setIsCreateModalOpen(false);
    resetForm();
    toast.success("Yangi lid muvaffaqiyatli yaratildi");
  };

  const handleEdit = () => {
    if (!selectedLead || !formData.firstName || !formData.lastName || !formData.phone) {
      toast.error("Iltimos, barcha majburiy maydonlarni to'ldiring");
      return;
    }

    const updatedLeads = leads.map((lead) =>
      lead.id === selectedLead.id
        ? {
            ...lead,
            firstName: formData.firstName,
            lastName: formData.lastName,
            phone: formData.phone,
            statusId: parseInt(formData.statusId),
            assignedToId: formData.assignedToId ? parseInt(formData.assignedToId) : undefined,
            notes: formData.notes || undefined,
          }
        : lead
    );

    setLeads(updatedLeads);
    setIsEditModalOpen(false);
    setSelectedLead(null);
    resetForm();
    toast.success("Lid muvaffaqiyatli yangilandi");
  };

  const handleDelete = () => {
    if (!selectedLead) return;

    const updatedLeads = leads.filter((lead) => lead.id !== selectedLead.id);
    setLeads(updatedLeads);
    setIsDeleteDialogOpen(false);
    setSelectedLead(null);
    toast.success("Lid muvaffaqiyatli o'chirildi");
  };

  const openEditModal = (lead: Lead) => {
    setSelectedLead(lead);
    setFormData({
      firstName: lead.firstName,
      lastName: lead.lastName,
      phone: lead.phone,
      statusId: lead.statusId.toString(),
      assignedToId: lead.assignedToId?.toString() || "",
      notes: lead.notes || "",
    });
    setIsPhoneVerified(true);
    setIsEditModalOpen(true);
  };

  const openDeleteDialog = (lead: Lead) => {
    setSelectedLead(lead);
    setIsDeleteDialogOpen(true);
  };

  const getStatusBadge = (statusId: number) => {
    const status = leadStatuses.find((s) => s.id === statusId);
    if (!status) return null;

    const colorMap: Record<string, string> = {
      New: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
      Contacted: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
      "Trial Scheduled": "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
      Enrolled: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
      Lost: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
    };

    return <Badge className={colorMap[status.name] || "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"}>{status.name}</Badge>;
  };

  const leadCountByStatus = leadStatuses.map((status) => ({
    ...status,
    count: leads.filter((l) => l.statusId === status.id).length,
  }));

  return (
    <div className="p-8 bg-gray-50 dark:bg-gray-950 min-h-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-semibold text-gray-900 dark:text-white mb-2">
            Lidlar Boshqaruvi (CRM)
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Potensial o'quvchilarni kuzatish va ro'yxatga olish
          </p>
        </div>
        <Button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600"
        >
          <Plus className="size-4 mr-2" />
          Yangi Lid Qo'shish
        </Button>
      </div>

      {/* Lead Pipeline Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        {leadCountByStatus.map((status) => (
          <Card key={status.id} className="dark:bg-gray-900 dark:border-gray-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium dark:text-gray-300">{status.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold dark:text-white">{status.count}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="dark:bg-gray-900 dark:border-gray-800">
        <CardHeader>
          <CardTitle className="dark:text-white">
            Barcha Lidlar ({leads.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="dark:border-gray-800">
                <TableHead className="dark:text-gray-400">Ism</TableHead>
                <TableHead className="dark:text-gray-400">Telefon</TableHead>
                <TableHead className="dark:text-gray-400">Holat</TableHead>
                <TableHead className="dark:text-gray-400">Mas'ul Xodim</TableHead>
                <TableHead className="dark:text-gray-400">Izohlar</TableHead>
                <TableHead className="dark:text-gray-400">Sana</TableHead>
                <TableHead className="dark:text-gray-400">Amallar</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leads.map((lead) => {
                const assignedUser = staff.find((u) => u.id === lead.assignedToId);
                return (
                  <TableRow key={lead.id} className="dark:border-gray-800">
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="size-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                          <UserPlus className="size-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <p className="font-medium dark:text-white">
                            {lead.firstName} {lead.lastName}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm dark:text-gray-300">
                        <Phone className="size-4 text-gray-400 dark:text-gray-500" />
                        {lead.phone}
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(lead.statusId)}</TableCell>
                    <TableCell className="dark:text-gray-300">
                      {assignedUser ? `${assignedUser.firstName} ${assignedUser.lastName}` : "-"}
                    </TableCell>
                    <TableCell>
                      {lead.notes ? (
                        <div className="flex items-center gap-2">
                          <MessageSquare className="size-4 text-gray-400 dark:text-gray-500" />
                          <span className="text-sm text-gray-600 dark:text-gray-400 truncate max-w-xs">
                            {lead.notes}
                          </span>
                        </div>
                      ) : (
                        <span className="text-gray-400 dark:text-gray-500">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-gray-600 dark:text-gray-400">
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditModal(lead)}
                          className="dark:text-gray-300 dark:hover:bg-gray-800"
                        >
                          <Edit className="size-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openDeleteDialog(lead)}
                          className="text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30"
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Create Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="dark:bg-gray-900 dark:border-gray-800 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="dark:text-white">Yangi Lid Qo'shish</DialogTitle>
            <DialogDescription className="dark:text-gray-400">
              Potensial o'quvchi ma'lumotlarini kiriting
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="dark:text-gray-300">
                  Ism <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="firstName"
                  placeholder="Ali"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="dark:text-gray-300">
                  Familiya <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="lastName"
                  placeholder="Valiyev"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                />
              </div>
            </div>
            
            <PhoneVerification
              value={formData.phone}
              onChange={(value) => setFormData({ ...formData, phone: value })}
              required
              onVerified={setIsPhoneVerified}
            />

            <div className="space-y-2">
              <Label htmlFor="status" className="dark:text-gray-300">
                Holat
              </Label>
              <Select
                value={formData.statusId}
                onValueChange={(value) => setFormData({ ...formData, statusId: value })}
              >
                <SelectTrigger className="dark:bg-gray-800 dark:border-gray-700 dark:text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                  {leadStatuses.map((status) => (
                    <SelectItem key={status.id} value={status.id.toString()}>
                      {status.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="assigned" className="dark:text-gray-300">
                Mas'ul Xodim
              </Label>
              <Select
                value={formData.assignedToId}
                onValueChange={(value) => setFormData({ ...formData, assignedToId: value })}
              >
                <SelectTrigger className="dark:bg-gray-800 dark:border-gray-700 dark:text-white">
                  <SelectValue placeholder="Tanlang..." />
                </SelectTrigger>
                <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                  {staff.map((user) => (
                    <SelectItem key={user.id} value={user.id.toString()}>
                      {user.firstName} {user.lastName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes" className="dark:text-gray-300">
                Izohlar
              </Label>
              <Textarea
                id="notes"
                placeholder="Qo'shimcha ma'lumotlar..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsCreateModalOpen(false);
                resetForm();
              }}
              className="dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Bekor qilish
            </Button>
            <Button onClick={handleCreate} className="bg-blue-600 hover:bg-blue-700">
              Qo'shish
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="dark:bg-gray-900 dark:border-gray-800 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="dark:text-white">Lidni Tahrirlash</DialogTitle>
            <DialogDescription className="dark:text-gray-400">
              Lid ma'lumotlarini yangilang
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-firstName" className="dark:text-gray-300">
                  Ism <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="edit-firstName"
                  placeholder="Ali"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-lastName" className="dark:text-gray-300">
                  Familiya <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="edit-lastName"
                  placeholder="Valiyev"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-phone" className="dark:text-gray-300">
                Telefon Raqami <span className="text-red-500">*</span>
              </Label>
              <Input
                id="edit-phone"
                type="tel"
                placeholder="+998901234567"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-status" className="dark:text-gray-300">
                Holat
              </Label>
              <Select
                value={formData.statusId}
                onValueChange={(value) => setFormData({ ...formData, statusId: value })}
              >
                <SelectTrigger className="dark:bg-gray-800 dark:border-gray-700 dark:text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                  {leadStatuses.map((status) => (
                    <SelectItem key={status.id} value={status.id.toString()}>
                      {status.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-assigned" className="dark:text-gray-300">
                Mas'ul Xodim
              </Label>
              <Select
                value={formData.assignedToId}
                onValueChange={(value) => setFormData({ ...formData, assignedToId: value })}
              >
                <SelectTrigger className="dark:bg-gray-800 dark:border-gray-700 dark:text-white">
                  <SelectValue placeholder="Tanlang..." />
                </SelectTrigger>
                <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                  {staff.map((user) => (
                    <SelectItem key={user.id} value={user.id.toString()}>
                      {user.firstName} {user.lastName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-notes" className="dark:text-gray-300">
                Izohlar
              </Label>
              <Textarea
                id="edit-notes"
                placeholder="Qo'shimcha ma'lumotlar..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsEditModalOpen(false);
                setSelectedLead(null);
                resetForm();
              }}
              className="dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Bekor qilish
            </Button>
            <Button onClick={handleEdit} className="bg-blue-600 hover:bg-blue-700">
              Saqlash
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setSelectedLead(null);
        }}
        onConfirm={handleDelete}
        title="Lidni o'chirish"
        description={`Haqiqatan ham "${selectedLead?.firstName} ${selectedLead?.lastName}" lidini o'chirmoqchimisiz? Bu amal bekor qilinmaydi.`}
        confirmText="Ha, o'chirish"
        cancelText="Bekor qilish"
      />
    </div>
  );
}
