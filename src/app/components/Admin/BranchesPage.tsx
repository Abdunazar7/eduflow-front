import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Building2, MapPin, Phone, Plus, Users, Edit, Trash2, Eye } from "lucide-react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "../ui/dialog";
import { Separator } from "../ui/separator";
import { toast } from "sonner";
import ConfirmDialog from "../shared/ConfirmDialog";
import { branches as initialBranches, groups, Branch } from "../../data/mockData";

interface BranchesPageProps {
  tenantId: number;
}

export default function BranchesPage({ tenantId }: BranchesPageProps) {
  const [branchesList, setBranchesList] = useState<Branch[]>(
    initialBranches.filter((b) => b.tenantId === tenantId)
  );
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [formData, setFormData] = useState<Partial<Branch>>({});

  const handleCreate = () => {
    if (!formData.name) {
      toast.error("Iltimos, filial nomini kiriting");
      return;
    }

    const newBranch: Branch = {
      id: Math.max(...branchesList.map((b) => b.id), 0) + 1,
      tenantId,
      name: formData.name,
      address: formData.address,
      phone: formData.phone,
    };

    setBranchesList([...branchesList, newBranch]);
    setIsCreateModalOpen(false);
    setFormData({});
    toast.success("Filial muvaffaqiyatli qo'shildi");
  };

  const handleEdit = () => {
    if (!selectedBranch || !formData.name) {
      toast.error("Iltimos, filial nomini kiriting");
      return;
    }

    setBranchesList(
      branchesList.map((b) =>
        b.id === selectedBranch.id
          ? {
              ...b,
              name: formData.name!,
              address: formData.address,
              phone: formData.phone,
            }
          : b
      )
    );
    setIsEditModalOpen(false);
    setSelectedBranch(null);
    setFormData({});
    toast.success("Filial muvaffaqiyatli yangilandi");
  };

  const handleDeleteClick = (branch: Branch) => {
    setSelectedBranch(branch);
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (selectedBranch) {
      setBranchesList(branchesList.filter((b) => b.id !== selectedBranch.id));
      toast.success("Filial o'chirildi");
      setSelectedBranch(null);
    }
    setShowDeleteDialog(false);
  };

  const openEditModal = (branch: Branch) => {
    setSelectedBranch(branch);
    setFormData({
      name: branch.name,
      address: branch.address,
      phone: branch.phone,
    });
    setIsEditModalOpen(true);
  };

  const openViewModal = (branch: Branch) => {
    setSelectedBranch(branch);
    setIsViewModalOpen(true);
  };

  const renderBranchForm = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="branchName">Filial Nomi *</Label>
        <Input
          id="branchName"
          value={formData.name || ""}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Masalan: Markaziy filial"
        />
      </div>
      <div>
        <Label htmlFor="branchAddress">Manzil</Label>
        <Input
          id="branchAddress"
          value={formData.address || ""}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          placeholder="Filial manzilini kiriting"
        />
      </div>
      <div>
        <Label htmlFor="branchPhone">Telefon Raqam</Label>
        <Input
          id="branchPhone"
          value={formData.phone || ""}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          placeholder="+998 90 123 45 67"
        />
      </div>
    </div>
  );

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl mb-2">Branches</h2>
          <p className="text-slate-600 dark:text-slate-400">Manage your educational center locations</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="size-4 mr-2" />
          Add New Branch
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {branchesList.map((branch) => {
          const branchGroups = groups.filter((g) => g.branchId === branch.id);
          const activeGroups = branchGroups.filter((g) => g.status === "active").length;

          return (
            <Card key={branch.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="size-12 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                      <Building2 className="size-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{branch.name}</CardTitle>
                      <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 mt-1">
                        Active
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <MapPin className="size-4 text-slate-400 mt-1" />
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {branch.address || "No address set"}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="size-4 text-slate-400" />
                    <p className="text-sm text-slate-600 dark:text-slate-400">{branch.phone || "No phone"}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="size-4 text-slate-400" />
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {branchGroups.length} groups ({activeGroups} active)
                    </p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => openViewModal(branch)}>
                    <Eye className="size-4 mr-1" />
                    View
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => openEditModal(branch)}>
                    <Edit className="size-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteClick(branch)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Create Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Yangi Filial Qo'shish</DialogTitle>
            <DialogDescription>Yangi filial ma'lumotlarini kiriting</DialogDescription>
          </DialogHeader>
          {renderBranchForm()}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
              Bekor qilish
            </Button>
            <Button onClick={handleCreate}>Qo'shish</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Filialni Tahrirlash</DialogTitle>
            <DialogDescription>Filial ma'lumotlarini yangilang</DialogDescription>
          </DialogHeader>
          {renderBranchForm()}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              Bekor qilish
            </Button>
            <Button onClick={handleEdit}>Yangilash</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Filial Ma'lumotlari</DialogTitle>
            <DialogDescription>Filialning to'liq ma'lumotlari</DialogDescription>
          </DialogHeader>
          {selectedBranch && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="size-16 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                  <Building2 className="size-8 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">{selectedBranch.name}</h3>
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 mt-1">
                    Active
                  </Badge>
                </div>
              </div>
              <Separator />
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-slate-500">Manzil</p>
                  <p className="font-medium">{selectedBranch.address || "Manzil kiritilmagan"}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Telefon</p>
                  <p className="font-medium">{selectedBranch.phone || "Telefon kiritilmagan"}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Guruhlar Soni</p>
                  <p className="font-medium">
                    {groups.filter((g) => g.branchId === selectedBranch.id).length} ta guruh
                  </p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsViewModalOpen(false)}>Yopish</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={confirmDelete}
        title="Filialni o'chirmoqchimisiz?"
        description={`${selectedBranch?.name} filialini butunlay o'chirmoqchimisiz? Bu amalni bekor qilib bo'lmaydi.`}
        confirmText="Ha, o'chirish"
        cancelText="Yo'q"
        isDestructive
      />
    </div>
  );
}
