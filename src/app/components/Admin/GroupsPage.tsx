import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Users, Plus, Calendar, User, Edit, Trash2, Eye } from "lucide-react";
import { getGroupsByTenantId, users, courseLevels, enrollments } from "../../data/mockData";
import { toast } from "sonner";
import ConfirmDialog from "../shared/ConfirmDialog";

interface GroupsPageProps {
  tenantId: number;
}

interface Group {
  id: number;
  tenantId: number;
  courseLevelId: number;
  teacherId: number;
  name: string;
  startDate?: Date;
  status: string;
}

export default function GroupsPage({ tenantId }: GroupsPageProps) {
  const [groups, setGroups] = useState<Group[]>(getGroupsByTenantId(tenantId));
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    courseLevelId: "",
    teacherId: "",
    startDate: "",
    status: "recruiting",
  });

  const teachers = users.filter((u) => u.role.name === "Teacher" && u.tenantId === tenantId);

  const resetForm = () => {
    setFormData({
      name: "",
      courseLevelId: "",
      teacherId: "",
      startDate: "",
      status: "recruiting",
    });
  };

  const handleCreate = () => {
    if (!formData.name || !formData.courseLevelId || !formData.teacherId) {
      toast.error("Iltimos, barcha majburiy maydonlarni to'ldiring");
      return;
    }

    const newGroup: Group = {
      id: Math.max(...groups.map((g) => g.id), 0) + 1,
      tenantId,
      name: formData.name,
      courseLevelId: parseInt(formData.courseLevelId),
      teacherId: parseInt(formData.teacherId),
      startDate: formData.startDate ? new Date(formData.startDate) : undefined,
      status: formData.status,
    };

    setGroups([...groups, newGroup]);
    setIsCreateModalOpen(false);
    resetForm();
    toast.success("Yangi guruh muvaffaqiyatli yaratildi");
  };

  const handleEdit = () => {
    if (!selectedGroup || !formData.name || !formData.courseLevelId || !formData.teacherId) {
      toast.error("Iltimos, barcha majburiy maydonlarni to'ldiring");
      return;
    }

    const updatedGroups = groups.map((group) =>
      group.id === selectedGroup.id
        ? {
            ...group,
            name: formData.name,
            courseLevelId: parseInt(formData.courseLevelId),
            teacherId: parseInt(formData.teacherId),
            startDate: formData.startDate ? new Date(formData.startDate) : undefined,
            status: formData.status,
          }
        : group
    );

    setGroups(updatedGroups);
    setIsEditModalOpen(false);
    setSelectedGroup(null);
    resetForm();
    toast.success("Guruh muvaffaqiyatli yangilandi");
  };

  const handleDelete = () => {
    if (!selectedGroup) return;

    const updatedGroups = groups.filter((group) => group.id !== selectedGroup.id);
    setGroups(updatedGroups);
    setIsDeleteDialogOpen(false);
    setSelectedGroup(null);
    toast.success("Guruh muvaffaqiyatli o'chirildi");
  };

  const openEditModal = (group: Group) => {
    setSelectedGroup(group);
    setFormData({
      name: group.name,
      courseLevelId: group.courseLevelId.toString(),
      teacherId: group.teacherId.toString(),
      startDate: group.startDate ? new Date(group.startDate).toISOString().split("T")[0] : "",
      status: group.status,
    });
    setIsEditModalOpen(true);
  };

  const openDeleteDialog = (group: Group) => {
    setSelectedGroup(group);
    setIsDeleteDialogOpen(true);
  };

  return (
    <div className="p-8 bg-gray-50 dark:bg-gray-950 min-h-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-semibold text-gray-900 dark:text-white mb-2">
            Guruhlar (Sinflar)
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            O'quvchi guruhlari va jadvallarni boshqaring
          </p>
        </div>
        <Button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600"
        >
          <Plus className="size-4 mr-2" />
          Yangi Guruh Yaratish
        </Button>
      </div>

      <Card className="dark:bg-gray-900 dark:border-gray-800">
        <CardHeader>
          <CardTitle className="dark:text-white">
            Barcha Guruhlar ({groups.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="dark:border-gray-800">
                <TableHead className="dark:text-gray-400">Guruh Nomi</TableHead>
                <TableHead className="dark:text-gray-400">Kurs Darajasi</TableHead>
                <TableHead className="dark:text-gray-400">O'qituvchi</TableHead>
                <TableHead className="dark:text-gray-400">O'quvchilar</TableHead>
                <TableHead className="dark:text-gray-400">Jadval</TableHead>
                <TableHead className="dark:text-gray-400">Holat</TableHead>
                <TableHead className="dark:text-gray-400">Amallar</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {groups.map((group) => {
                const teacher = users.find((u) => u.id === group.teacherId);
                const level = courseLevels.find((l) => l.id === group.courseLevelId);
                const studentCount = enrollments.filter((e) => e.groupId === group.id).length;

                return (
                  <TableRow key={group.id} className="dark:border-gray-800">
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="size-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                          <Users className="size-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <p className="font-medium dark:text-white">{group.name}</p>
                      </div>
                    </TableCell>
                    <TableCell className="dark:text-gray-300">
                      <p className="text-sm">{level?.name || "Noma'lum"}</p>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="size-4 text-gray-400 dark:text-gray-500" />
                        <p className="text-sm dark:text-gray-300">
                          {teacher?.firstName} {teacher?.lastName}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="dark:border-gray-700 dark:text-gray-300">
                        {studentCount} o'quvchi
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm dark:text-gray-300">
                        <Calendar className="size-3 text-gray-400 dark:text-gray-500" />
                        {group.startDate ? (
                          <span>{new Date(group.startDate).toLocaleDateString()}</span>
                        ) : (
                          <span className="text-gray-400 dark:text-gray-500">Jadval yo'q</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {group.status === "active" ? (
                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                          Faol
                        </Badge>
                      ) : group.status === "recruiting" ? (
                        <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400">
                          Yig'ilmoqda
                        </Badge>
                      ) : (
                        <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300">
                          {group.status}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="dark:text-gray-300 dark:hover:bg-gray-800"
                        >
                          <Eye className="size-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditModal(group)}
                          className="dark:text-gray-300 dark:hover:bg-gray-800"
                        >
                          <Edit className="size-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openDeleteDialog(group)}
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
            <DialogTitle className="dark:text-white">Yangi Guruh Yaratish</DialogTitle>
            <DialogDescription className="dark:text-gray-400">
              Yangi o'quvchi guruhi uchun ma'lumotlarni kiriting
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="dark:text-gray-300">
                Guruh Nomi <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                placeholder="Masalan: Beginner A1"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="courseLevel" className="dark:text-gray-300">
                Kurs Darajasi <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.courseLevelId}
                onValueChange={(value) =>
                  setFormData({ ...formData, courseLevelId: value })
                }
              >
                <SelectTrigger className="dark:bg-gray-800 dark:border-gray-700 dark:text-white">
                  <SelectValue placeholder="Darajani tanlang" />
                </SelectTrigger>
                <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                  {courseLevels.map((level) => (
                    <SelectItem key={level.id} value={level.id.toString()}>
                      {level.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="teacher" className="dark:text-gray-300">
                O'qituvchi <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.teacherId}
                onValueChange={(value) => setFormData({ ...formData, teacherId: value })}
              >
                <SelectTrigger className="dark:bg-gray-800 dark:border-gray-700 dark:text-white">
                  <SelectValue placeholder="O'qituvchini tanlang" />
                </SelectTrigger>
                <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                  {teachers.map((teacher) => (
                    <SelectItem key={teacher.id} value={teacher.id.toString()}>
                      {teacher.firstName} {teacher.lastName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="startDate" className="dark:text-gray-300">
                Boshlanish Sanasi
              </Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status" className="dark:text-gray-300">
                Holat
              </Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger className="dark:bg-gray-800 dark:border-gray-700 dark:text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                  <SelectItem value="recruiting">Yig'ilmoqda</SelectItem>
                  <SelectItem value="active">Faol</SelectItem>
                  <SelectItem value="completed">Tugatilgan</SelectItem>
                </SelectContent>
              </Select>
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
              Yaratish
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="dark:bg-gray-900 dark:border-gray-800">
          <DialogHeader>
            <DialogTitle className="dark:text-white">Guruhni Tahrirlash</DialogTitle>
            <DialogDescription className="dark:text-gray-400">
              Guruh ma'lumotlarini yangilang
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name" className="dark:text-gray-300">
                Guruh Nomi <span className="text-red-500">*</span>
              </Label>
              <Input
                id="edit-name"
                placeholder="Masalan: Beginner A1"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-courseLevel" className="dark:text-gray-300">
                Kurs Darajasi <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.courseLevelId}
                onValueChange={(value) =>
                  setFormData({ ...formData, courseLevelId: value })
                }
              >
                <SelectTrigger className="dark:bg-gray-800 dark:border-gray-700 dark:text-white">
                  <SelectValue placeholder="Darajani tanlang" />
                </SelectTrigger>
                <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                  {courseLevels.map((level) => (
                    <SelectItem key={level.id} value={level.id.toString()}>
                      {level.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-teacher" className="dark:text-gray-300">
                O'qituvchi <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.teacherId}
                onValueChange={(value) => setFormData({ ...formData, teacherId: value })}
              >
                <SelectTrigger className="dark:bg-gray-800 dark:border-gray-700 dark:text-white">
                  <SelectValue placeholder="O'qituvchini tanlang" />
                </SelectTrigger>
                <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                  {teachers.map((teacher) => (
                    <SelectItem key={teacher.id} value={teacher.id.toString()}>
                      {teacher.firstName} {teacher.lastName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-startDate" className="dark:text-gray-300">
                Boshlanish Sanasi
              </Label>
              <Input
                id="edit-startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-status" className="dark:text-gray-300">
                Holat
              </Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger className="dark:bg-gray-800 dark:border-gray-700 dark:text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                  <SelectItem value="recruiting">Yig'ilmoqda</SelectItem>
                  <SelectItem value="active">Faol</SelectItem>
                  <SelectItem value="completed">Tugatilgan</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsEditModalOpen(false);
                setSelectedGroup(null);
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
          setSelectedGroup(null);
        }}
        onConfirm={handleDelete}
        title="Guruhni o'chirish"
        description={`Haqiqatan ham "${selectedGroup?.name}" guruhini o'chirmoqchimisiz? Bu amal bekor qilinmaydi.`}
        confirmText="Ha, o'chirish"
        cancelText="Bekor qilish"
      />
    </div>
  );
}
