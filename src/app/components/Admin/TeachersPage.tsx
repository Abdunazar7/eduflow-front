import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { User, Plus, Search, Phone, DollarSign, BookOpen, Edit, Trash2, Eye } from "lucide-react";
import { Input } from "../ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "../ui/dialog";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Switch } from "../ui/switch";
import { Separator } from "../ui/separator";
import { toast } from "sonner";
import ConfirmDialog from "../shared/ConfirmDialog";
import { getTeachersByTenantId, getGroupsByTeacherId, User as UserType, TeacherProfile } from "../../data/mockData";

interface TeachersPageProps {
  tenantId: number;
}

export default function TeachersPage({ tenantId }: TeachersPageProps) {
  const [teachersList, setTeachersList] = useState<UserType[]>(getTeachersByTenantId(tenantId));
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<UserType | null>(null);
  const [formData, setFormData] = useState<Partial<UserType & { teacherProfile: Partial<TeacherProfile> }>>({
    isActive: true,
    teacherProfile: {
      salaryType: "fixed",
      salaryValue: 0,
      hiredDate: new Date(),
    },
  });

  const handleCreate = () => {
    if (!formData.firstName || !formData.lastName || !formData.phone) {
      toast.error("Iltimos, barcha majburiy maydonlarni to'ldiring");
      return;
    }

    const newTeacher: UserType = {
      id: Math.max(...teachersList.map((t) => t.id)) + 1,
      tenantId,
      roleId: 3,
      phone: formData.phone,
      firstName: formData.firstName,
      lastName: formData.lastName,
      photoUrl: formData.photoUrl,
      isActive: formData.isActive ?? true,
      createdAt: new Date(),
      role: { id: 3, name: "Teacher" },
      teacherProfile: {
        userId: 0,
        specialization: formData.teacherProfile?.specialization,
        salaryType: formData.teacherProfile?.salaryType || "fixed",
        salaryValue: formData.teacherProfile?.salaryValue || 0,
        hiredDate: formData.teacherProfile?.hiredDate || new Date(),
      },
    };

    setTeachersList([...teachersList, newTeacher]);
    setIsCreateModalOpen(false);
    setFormData({
      isActive: true,
      teacherProfile: { salaryType: "fixed", salaryValue: 0, hiredDate: new Date() },
    });
    toast.success("O'qituvchi muvaffaqiyatli qo'shildi");
  };

  const handleEdit = () => {
    if (!selectedTeacher || !formData.firstName || !formData.lastName || !formData.phone) {
      toast.error("Iltimos, barcha majburiy maydonlarni to'ldiring");
      return;
    }

    setTeachersList(
      teachersList.map((t) =>
        t.id === selectedTeacher.id
          ? {
              ...t,
              firstName: formData.firstName!,
              lastName: formData.lastName!,
              phone: formData.phone!,
              photoUrl: formData.photoUrl,
              isActive: formData.isActive ?? t.isActive,
              teacherProfile: {
                ...t.teacherProfile!,
                specialization: formData.teacherProfile?.specialization,
                salaryType: formData.teacherProfile?.salaryType || t.teacherProfile!.salaryType,
                salaryValue: formData.teacherProfile?.salaryValue || t.teacherProfile!.salaryValue,
              },
            }
          : t
      )
    );
    setIsEditModalOpen(false);
    setSelectedTeacher(null);
    setFormData({
      isActive: true,
      teacherProfile: { salaryType: "fixed", salaryValue: 0, hiredDate: new Date() },
    });
    toast.success("O'qituvchi ma'lumotlari yangilandi");
  };

  const handleDeleteClick = (teacher: UserType) => {
    setSelectedTeacher(teacher);
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (selectedTeacher) {
      setTeachersList(teachersList.filter((t) => t.id !== selectedTeacher.id));
      toast.success("O'qituvchi o'chirildi");
      setSelectedTeacher(null);
    }
    setShowDeleteDialog(false);
  };

  const openCreateModal = () => {
    setFormData({
      isActive: true,
      teacherProfile: { salaryType: "fixed", salaryValue: 0, hiredDate: new Date() },
    });
    setIsCreateModalOpen(true);
  };

  const openEditModal = (teacher: UserType) => {
    setSelectedTeacher(teacher);
    setFormData({
      firstName: teacher.firstName,
      lastName: teacher.lastName,
      phone: teacher.phone,
      photoUrl: teacher.photoUrl,
      isActive: teacher.isActive,
      teacherProfile: {
        specialization: teacher.teacherProfile?.specialization,
        salaryType: teacher.teacherProfile?.salaryType || "fixed",
        salaryValue: teacher.teacherProfile?.salaryValue || 0,
        hiredDate: teacher.teacherProfile?.hiredDate,
      },
    });
    setIsEditModalOpen(true);
  };

  const openViewModal = (teacher: UserType) => {
    setSelectedTeacher(teacher);
    setIsViewModalOpen(true);
  };

  const filteredTeachers = teachersList.filter(
    (teacher) =>
      teacher.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.phone.includes(searchTerm)
  );

  const renderTeacherForm = (isEditing: boolean) => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="firstName">Ism *</Label>
          <Input
            id="firstName"
            value={formData.firstName || ""}
            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="lastName">Familiya *</Label>
          <Input
            id="lastName"
            value={formData.lastName || ""}
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="phone">Telefon Raqam *</Label>
        <Input
          id="phone"
          value={formData.phone || ""}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        />
      </div>

      <div>
        <Label htmlFor="specialization">Mutaxassislik</Label>
        <Input
          id="specialization"
          value={formData.teacherProfile?.specialization || ""}
          onChange={(e) =>
            setFormData({
              ...formData,
              teacherProfile: { ...formData.teacherProfile, specialization: e.target.value },
            })
          }
        />
      </div>

      <div>
        <Label htmlFor="salaryType">Maosh Turi *</Label>
        <Select
          value={formData.teacherProfile?.salaryType}
          onValueChange={(value) =>
            setFormData({
              ...formData,
              teacherProfile: { ...formData.teacherProfile, salaryType: value },
            })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Maosh turini tanlang" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="fixed">Fiksirovka</SelectItem>
            <SelectItem value="per_student">O'quvchi boshiga</SelectItem>
            <SelectItem value="per_hour">Soatiga</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="salaryValue">Maosh Qiymati *</Label>
        <Input
          id="salaryValue"
          type="number"
          value={formData.teacherProfile?.salaryValue || 0}
          onChange={(e) =>
            setFormData({
              ...formData,
              teacherProfile: { ...formData.teacherProfile, salaryValue: Number(e.target.value) },
            })
          }
        />
      </div>

      <div className="flex items-center justify-between">
        <Label htmlFor="isActive">Faol</Label>
        <Switch
          id="isActive"
          checked={formData.isActive ?? true}
          onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
        />
      </div>
    </div>
  );

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl mb-2">Teachers</h2>
          <p className="text-slate-600 dark:text-slate-400">Manage teaching staff and assignments</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700" onClick={openCreateModal}>
          <Plus className="size-4 mr-2" />
          Add New Teacher
        </Button>
      </div>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
            <Input
              placeholder="Search teachers by name, specialization..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>All Teachers ({filteredTeachers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Teacher</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Specialization</TableHead>
                <TableHead>Salary Type</TableHead>
                <TableHead>Salary Value</TableHead>
                <TableHead>Groups</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTeachers.map((teacher) => {
                const profile = teacher.teacherProfile!;
                const teacherGroups = getGroupsByTeacherId(teacher.id);

                return (
                  <TableRow key={teacher.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="size-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                          <User className="size-5 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                          <p className="font-medium">
                            {teacher.firstName} {teacher.lastName}
                          </p>
                          <p className="text-xs text-slate-500">ID: {teacher.id}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <Phone className="size-3 text-slate-400" />
                        {teacher.phone}
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm">{profile.specialization || "General"}</p>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {profile.salaryType === "fixed"
                          ? "Fixed"
                          : profile.salaryType === "per_student"
                          ? "Per Student"
                          : "Per Hour"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-green-600 font-medium">
                        <DollarSign className="size-3" />
                        {Number(profile.salaryValue)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <BookOpen className="size-4 text-slate-400" />
                        <span className="text-sm">{teacherGroups.length} groups</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {teacher.isActive ? (
                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">Active</Badge>
                      ) : (
                        <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300">Inactive</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" onClick={() => openViewModal(teacher)}>
                          <Eye className="size-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => openEditModal(teacher)}>
                          <Edit className="size-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteClick(teacher)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
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
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Yangi O'qituvchi Qo'shish</DialogTitle>
            <DialogDescription>Yangi o'qituvchi ma'lumotlarini kiriting</DialogDescription>
          </DialogHeader>
          {renderTeacherForm(false)}
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
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>O'qituvchini Tahrirlash</DialogTitle>
            <DialogDescription>O'qituvchi ma'lumotlarini yangilang</DialogDescription>
          </DialogHeader>
          {renderTeacherForm(true)}
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
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>O'qituvchi Ma'lumotlari</DialogTitle>
            <DialogDescription>O'qituvchining to'liq ma'lumotlari</DialogDescription>
          </DialogHeader>
          {selectedTeacher && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="size-20 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                  <User className="size-10 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">
                    {selectedTeacher.firstName} {selectedTeacher.lastName}
                  </h3>
                  <p className="text-slate-500">ID: {selectedTeacher.id}</p>
                  <Badge className={selectedTeacher.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                    {selectedTeacher.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </div>
              <Separator />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-500">Telefon</p>
                  <p className="font-medium">{selectedTeacher.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Mutaxassislik</p>
                  <p className="font-medium">{selectedTeacher.teacherProfile?.specialization || "General"}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Maosh Turi</p>
                  <p className="font-medium">{selectedTeacher.teacherProfile?.salaryType}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Maosh Qiymati</p>
                  <p className="font-medium">{selectedTeacher.teacherProfile?.salaryValue}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Guruhlar Soni</p>
                  <p className="font-medium">{getGroupsByTeacherId(selectedTeacher.id).length}</p>
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
        title="O'qituvchini o'chirmoqchimisiz?"
        description={`${selectedTeacher?.firstName} ${selectedTeacher?.lastName} o'qituvchisini butunlay o'chirmoqchimisiz? Bu amalni bekor qilib bo'lmaydi.`}
        confirmText="Ha, o'chirish"
        cancelText="Yo'q"
        isDestructive
      />
    </div>
  );
}
