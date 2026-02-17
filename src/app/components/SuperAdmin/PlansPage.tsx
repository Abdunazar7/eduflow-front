import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { CreditCard, Plus, Edit, Trash2, DollarSign, Users } from "lucide-react";
import { subscriptionPlans, tenantSubscriptions } from "../../data/mockData";
import { toast } from "sonner";
import ConfirmDialog from "../shared/ConfirmDialog";

interface Plan {
  id: number;
  name: string;
  maxStudents?: number;
  monthlyPrice: number;
}

export default function PlansPage() {
  const [plans, setPlans] = useState<Plan[]>(subscriptionPlans);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    monthlyPrice: "",
    maxStudents: "",
  });

  const resetForm = () => {
    setFormData({
      name: "",
      monthlyPrice: "",
      maxStudents: "",
    });
  };

  const handleCreate = () => {
    if (!formData.name || !formData.monthlyPrice) {
      toast.error("Iltimos, barcha majburiy maydonlarni to'ldiring");
      return;
    }

    const newPlan: Plan = {
      id: Math.max(...plans.map((p) => p.id)) + 1,
      name: formData.name,
      monthlyPrice: parseFloat(formData.monthlyPrice),
      maxStudents: formData.maxStudents ? parseInt(formData.maxStudents) : undefined,
    };

    setPlans([...plans, newPlan]);
    setIsCreateModalOpen(false);
    resetForm();
    toast.success("Yangi plan muvaffaqiyatli yaratildi");
  };

  const handleEdit = () => {
    if (!selectedPlan || !formData.name || !formData.monthlyPrice) {
      toast.error("Iltimos, barcha majburiy maydonlarni to'ldiring");
      return;
    }

    const updatedPlans = plans.map((plan) =>
      plan.id === selectedPlan.id
        ? {
            ...plan,
            name: formData.name,
            monthlyPrice: parseFloat(formData.monthlyPrice),
            maxStudents: formData.maxStudents ? parseInt(formData.maxStudents) : undefined,
          }
        : plan
    );

    setPlans(updatedPlans);
    setIsEditModalOpen(false);
    setSelectedPlan(null);
    resetForm();
    toast.success("Plan muvaffaqiyatli yangilandi");
  };

  const handleDelete = () => {
    if (!selectedPlan) return;

    const updatedPlans = plans.filter((plan) => plan.id !== selectedPlan.id);
    setPlans(updatedPlans);
    setIsDeleteDialogOpen(false);
    setSelectedPlan(null);
    toast.success("Plan muvaffaqiyatli o'chirildi");
  };

  const openEditModal = (plan: Plan) => {
    setSelectedPlan(plan);
    setFormData({
      name: plan.name,
      monthlyPrice: plan.monthlyPrice.toString(),
      maxStudents: plan.maxStudents?.toString() || "",
    });
    setIsEditModalOpen(true);
  };

  const openDeleteDialog = (plan: Plan) => {
    setSelectedPlan(plan);
    setIsDeleteDialogOpen(true);
  };

  return (
    <div className="p-8 bg-gray-50 dark:bg-gray-950 min-h-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-semibold text-gray-900 dark:text-white mb-2">
            Obuna Rejalar
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Narx rejalarini va obunalarni boshqaring
          </p>
        </div>
        <Button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-purple-600 hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-600"
        >
          <Plus className="size-4 mr-2" />
          Yangi Reja Yaratish
        </Button>
      </div>

      {/* Plans Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {plans.map((plan) => {
          const activeCount = tenantSubscriptions.filter(
            (s) => s.planId === plan.id && s.status === "active"
          ).length;

          return (
            <Card
              key={plan.id}
              className="border-2 hover:shadow-xl transition-all duration-300 dark:bg-gray-900 dark:border-gray-800"
            >
              <CardHeader className="text-center">
                <div className="size-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mx-auto mb-3">
                  <CreditCard className="size-6 text-purple-600 dark:text-purple-400" />
                </div>
                <CardTitle className="text-2xl dark:text-white">{plan.name}</CardTitle>
                <div className="text-3xl text-purple-600 dark:text-purple-400 my-4 font-bold">
                  ${plan.monthlyPrice}
                  <span className="text-sm text-gray-500 dark:text-gray-400">/oy</span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
                    <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                      <Users className="size-4" />
                      Maksimal O'quvchilar:
                    </span>
                    <span className="font-medium dark:text-white">
                      {plan.maxStudents ? plan.maxStudents : "Cheklanmagan"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Aktiv Obunalar:
                    </span>
                    <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
                      {activeCount}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
                    <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                      <DollarSign className="size-4" />
                      Oylik Daromad:
                    </span>
                    <span className="font-medium text-green-600 dark:text-green-400">
                      ${(plan.monthlyPrice * activeCount).toLocaleString()}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                    onClick={() => openEditModal(plan)}
                  >
                    <Edit className="size-4 mr-2" />
                    Tahrirlash
                  </Button>
                  <Button
                    variant="outline"
                    className="text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30 dark:border-gray-700"
                    onClick={() => openDeleteDialog(plan)}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Plans Table */}
      <Card className="dark:bg-gray-900 dark:border-gray-800">
        <CardHeader>
          <CardTitle className="dark:text-white">Barcha Rejalar ({plans.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="dark:border-gray-800">
                <TableHead className="dark:text-gray-400">Reja Nomi</TableHead>
                <TableHead className="dark:text-gray-400">Oylik Narx</TableHead>
                <TableHead className="dark:text-gray-400">Maksimal O'quvchilar</TableHead>
                <TableHead className="dark:text-gray-400">Aktiv Obunalar</TableHead>
                <TableHead className="dark:text-gray-400">Oylik Daromad</TableHead>
                <TableHead className="dark:text-gray-400">Amallar</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {plans.map((plan) => {
                const activeCount = tenantSubscriptions.filter(
                  (s) => s.planId === plan.id && s.status === "active"
                ).length;

                return (
                  <TableRow key={plan.id} className="dark:border-gray-800">
                    <TableCell className="font-medium dark:text-white">{plan.name}</TableCell>
                    <TableCell className="dark:text-gray-300">
                      <span className="text-green-600 dark:text-green-400 font-semibold">
                        ${plan.monthlyPrice}
                      </span>
                      /oy
                    </TableCell>
                    <TableCell className="dark:text-gray-300">
                      {plan.maxStudents ? plan.maxStudents : "Cheklanmagan"}
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
                        {activeCount}
                      </Badge>
                    </TableCell>
                    <TableCell className="dark:text-gray-300">
                      <span className="font-semibold text-green-600 dark:text-green-400">
                        ${(plan.monthlyPrice * activeCount).toLocaleString()}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditModal(plan)}
                          className="dark:text-gray-300 dark:hover:bg-gray-800"
                        >
                          <Edit className="size-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openDeleteDialog(plan)}
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
        <DialogContent className="dark:bg-gray-900 dark:border-gray-800">
          <DialogHeader>
            <DialogTitle className="dark:text-white">Yangi Reja Yaratish</DialogTitle>
            <DialogDescription className="dark:text-gray-400">
              Yangi obuna rejasi uchun ma'lumotlarni kiriting
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="dark:text-gray-300">
                Reja Nomi <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                placeholder="Masalan: Premium Plan"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price" className="dark:text-gray-300">
                Oylik Narx ($) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="price"
                type="number"
                placeholder="99"
                value={formData.monthlyPrice}
                onChange={(e) => setFormData({ ...formData, monthlyPrice: e.target.value })}
                className="dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxStudents" className="dark:text-gray-300">
                Maksimal O'quvchilar (bo'sh qoldiring agar cheklanmagan bo'lsa)
              </Label>
              <Input
                id="maxStudents"
                type="number"
                placeholder="100"
                value={formData.maxStudents}
                onChange={(e) => setFormData({ ...formData, maxStudents: e.target.value })}
                className="dark:bg-gray-800 dark:border-gray-700 dark:text-white"
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
            <Button onClick={handleCreate} className="bg-purple-600 hover:bg-purple-700">
              Yaratish
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="dark:bg-gray-900 dark:border-gray-800">
          <DialogHeader>
            <DialogTitle className="dark:text-white">Rejani Tahrirlash</DialogTitle>
            <DialogDescription className="dark:text-gray-400">
              Obuna rejasi ma'lumotlarini yangilang
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name" className="dark:text-gray-300">
                Reja Nomi <span className="text-red-500">*</span>
              </Label>
              <Input
                id="edit-name"
                placeholder="Masalan: Premium Plan"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-price" className="dark:text-gray-300">
                Oylik Narx ($) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="edit-price"
                type="number"
                placeholder="99"
                value={formData.monthlyPrice}
                onChange={(e) => setFormData({ ...formData, monthlyPrice: e.target.value })}
                className="dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-maxStudents" className="dark:text-gray-300">
                Maksimal O'quvchilar (bo'sh qoldiring agar cheklanmagan bo'lsa)
              </Label>
              <Input
                id="edit-maxStudents"
                type="number"
                placeholder="100"
                value={formData.maxStudents}
                onChange={(e) => setFormData({ ...formData, maxStudents: e.target.value })}
                className="dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsEditModalOpen(false);
                setSelectedPlan(null);
                resetForm();
              }}
              className="dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Bekor qilish
            </Button>
            <Button onClick={handleEdit} className="bg-purple-600 hover:bg-purple-700">
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
          setSelectedPlan(null);
        }}
        onConfirm={handleDelete}
        title="Rejani o'chirish"
        description={`Haqiqatan ham "${selectedPlan?.name}" rejasini o'chirmoqchimisiz? Bu amal bekor qilinmaydi.`}
        confirmText="Ha, o'chirish"
        cancelText="Bekor qilish"
      />
    </div>
  );
}
