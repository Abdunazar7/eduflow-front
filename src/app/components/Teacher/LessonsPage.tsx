import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Textarea } from "../ui/textarea";
import { BookOpen, Plus, Edit, Trash2, Calendar, Clock } from "lucide-react";
import { lessons, getGroupsByTeacherId } from "../../data/mockData";
import { toast } from "sonner";
import ConfirmDialog from "../shared/ConfirmDialog";

interface LessonsPageProps {
  teacherId: number;
}

interface Lesson {
  id: number;
  groupId: number;
  date: Date;
  topic?: string;
  status: string;
  teacherId?: number;
}

export default function LessonsPage({ teacherId }: LessonsPageProps) {
  const myGroups = getGroupsByTeacherId(teacherId);
  const [myLessons, setMyLessons] = useState<Lesson[]>(
    lessons.filter((l) => l.teacherId === teacherId)
  );

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);

  const [formData, setFormData] = useState({
    groupId: "",
    date: "",
    time: "",
    topic: "",
    status: "planned",
  });

  const resetForm = () => {
    setFormData({
      groupId: "",
      date: "",
      time: "",
      topic: "",
      status: "planned",
    });
  };

  const handleCreate = () => {
    if (!formData.groupId || !formData.date || !formData.time || !formData.topic) {
      toast.error("Iltimos, barcha majburiy maydonlarni to'ldiring");
      return;
    }

    const newLesson: Lesson = {
      id: Math.max(...myLessons.map((l) => l.id)) + 1,
      groupId: parseInt(formData.groupId),
      date: new Date(`${formData.date} ${formData.time}`),
      topic: formData.topic,
      status: formData.status,
      teacherId: teacherId,
    };

    setMyLessons([...myLessons, newLesson]);
    setIsCreateModalOpen(false);
    resetForm();
    toast.success("Yangi dars muvaffaqiyatli yaratildi");
  };

  const handleEdit = () => {
    if (!selectedLesson || !formData.groupId || !formData.date || !formData.time || !formData.topic) {
      toast.error("Iltimos, barcha majburiy maydonlarni to'ldiring");
      return;
    }

    const updatedLessons = myLessons.map((lesson) =>
      lesson.id === selectedLesson.id
        ? {
            ...lesson,
            groupId: parseInt(formData.groupId),
            date: new Date(`${formData.date} ${formData.time}`),
            topic: formData.topic,
            status: formData.status,
          }
        : lesson
    );

    setMyLessons(updatedLessons);
    setIsEditModalOpen(false);
    setSelectedLesson(null);
    resetForm();
    toast.success("Dars muvaffaqiyatli yangilandi");
  };

  const handleDelete = () => {
    if (!selectedLesson) return;

    const updatedLessons = myLessons.filter((lesson) => lesson.id !== selectedLesson.id);
    setMyLessons(updatedLessons);
    setIsDeleteDialogOpen(false);
    setSelectedLesson(null);
    toast.success("Dars muvaffaqiyatli o'chirildi");
  };

  const openEditModal = (lesson: Lesson) => {
    setSelectedLesson(lesson);
    const lessonDate = new Date(lesson.date);
    setFormData({
      groupId: lesson.groupId.toString(),
      date: lessonDate.toISOString().split("T")[0],
      time: lessonDate.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }),
      topic: lesson.topic || "",
      status: lesson.status,
    });
    setIsEditModalOpen(true);
  };

  const openDeleteDialog = (lesson: Lesson) => {
    setSelectedLesson(lesson);
    setIsDeleteDialogOpen(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      case "planned":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300";
    }
  };

  return (
    <div className="p-8 bg-gray-50 dark:bg-gray-950 min-h-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-semibold text-gray-900 dark:text-white mb-2">
            Darslar
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Darslaringizni rejalashtiring va kuzatib boring
          </p>
        </div>
        <Button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600"
        >
          <Plus className="size-4 mr-2" />
          Yangi Dars Yaratish
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="dark:bg-gray-900 dark:border-gray-800 hover:shadow-xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium dark:text-gray-300">
              Jami Darslar
            </CardTitle>
            <div className="size-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
              <BookOpen className="size-5 text-indigo-600 dark:text-indigo-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">{myLessons.length}</div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Barcha darslar
            </p>
          </CardContent>
        </Card>

        <Card className="dark:bg-gray-900 dark:border-gray-800 hover:shadow-xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium dark:text-gray-300">
              Rejalashtirilgan
            </CardTitle>
            <div className="size-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <Calendar className="size-5 text-blue-600 dark:text-blue-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              {myLessons.filter((l) => l.status === "planned").length}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Kelgusi darslar
            </p>
          </CardContent>
        </Card>

        <Card className="dark:bg-gray-900 dark:border-gray-800 hover:shadow-xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium dark:text-gray-300">
              Yakunlangan
            </CardTitle>
            <div className="size-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <BookOpen className="size-5 text-green-600 dark:text-green-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600 dark:text-green-400">
              {myLessons.filter((l) => l.status === "completed").length}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              O'tgan darslar
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Lessons Table */}
      <Card className="dark:bg-gray-900 dark:border-gray-800 hover:shadow-xl transition-all duration-300">
        <CardHeader>
          <CardTitle className="dark:text-white">Barcha Darslar ({myLessons.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="dark:border-gray-800">
                <TableHead className="dark:text-gray-400">Sana va Vaqt</TableHead>
                <TableHead className="dark:text-gray-400">Guruh</TableHead>
                <TableHead className="dark:text-gray-400">Mavzu</TableHead>
                <TableHead className="dark:text-gray-400">Holat</TableHead>
                <TableHead className="dark:text-gray-400">Amallar</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {myLessons
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .map((lesson) => {
                  const group = myGroups.find((g) => g.id === lesson.groupId);

                  return (
                    <TableRow key={lesson.id} className="dark:border-gray-800">
                      <TableCell>
                        <div>
                          <p className="font-medium dark:text-white flex items-center gap-2">
                            <Calendar className="size-4 text-gray-400" />
                            {new Date(lesson.date).toLocaleDateString()}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-2 mt-1">
                            <Clock className="size-3" />
                            {new Date(lesson.date).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm dark:text-gray-300">{group?.name}</p>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <BookOpen className="size-4 text-gray-400 dark:text-gray-500" />
                          <p className="text-sm dark:text-gray-300">{lesson.topic || "Untitled Lesson"}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusBadge(lesson.status)}>
                          {lesson.status === "completed" ? "Yakunlangan" : lesson.status === "planned" ? "Rejalashtirilgan" : lesson.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEditModal(lesson)}
                            className="dark:text-gray-300 dark:hover:bg-gray-800"
                          >
                            <Edit className="size-4 mr-1" />
                            Tahrirlash
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openDeleteDialog(lesson)}
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
            <DialogTitle className="dark:text-white">Yangi Dars Yaratish</DialogTitle>
            <DialogDescription className="dark:text-gray-400">
              Yangi dars uchun ma'lumotlarni kiriting
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="group" className="dark:text-gray-300">
                Guruh <span className="text-red-500">*</span>
              </Label>
              <Select value={formData.groupId} onValueChange={(value) => setFormData({ ...formData, groupId: value })}>
                <SelectTrigger className="dark:bg-gray-800 dark:border-gray-700 dark:text-white">
                  <SelectValue placeholder="Guruhni tanlang" />
                </SelectTrigger>
                <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                  {myGroups.map((group) => (
                    <SelectItem key={group.id} value={group.id.toString()} className="dark:text-white">
                      {group.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date" className="dark:text-gray-300">
                  Sana <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time" className="dark:text-gray-300">
                  Vaqt <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="time"
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className="dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="topic" className="dark:text-gray-300">
                Dars Mavzusi <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="topic"
                placeholder="Masalan: Introduction to English Grammar"
                value={formData.topic}
                onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                className="dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status" className="dark:text-gray-300">
                Holat
              </Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                <SelectTrigger className="dark:bg-gray-800 dark:border-gray-700 dark:text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                  <SelectItem value="planned" className="dark:text-white">Rejalashtirilgan</SelectItem>
                  <SelectItem value="completed" className="dark:text-white">Yakunlangan</SelectItem>
                  <SelectItem value="cancelled" className="dark:text-white">Bekor qilingan</SelectItem>
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
            <Button onClick={handleCreate} className="bg-green-600 hover:bg-green-700">
              Yaratish
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="dark:bg-gray-900 dark:border-gray-800">
          <DialogHeader>
            <DialogTitle className="dark:text-white">Darsni Tahrirlash</DialogTitle>
            <DialogDescription className="dark:text-gray-400">
              Dars ma'lumotlarini yangilang
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-group" className="dark:text-gray-300">
                Guruh <span className="text-red-500">*</span>
              </Label>
              <Select value={formData.groupId} onValueChange={(value) => setFormData({ ...formData, groupId: value })}>
                <SelectTrigger className="dark:bg-gray-800 dark:border-gray-700 dark:text-white">
                  <SelectValue placeholder="Guruhni tanlang" />
                </SelectTrigger>
                <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                  {myGroups.map((group) => (
                    <SelectItem key={group.id} value={group.id.toString()} className="dark:text-white">
                      {group.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-date" className="dark:text-gray-300">
                  Sana <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="edit-date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-time" className="dark:text-gray-300">
                  Vaqt <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="edit-time"
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className="dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-topic" className="dark:text-gray-300">
                Dars Mavzusi <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="edit-topic"
                placeholder="Masalan: Introduction to English Grammar"
                value={formData.topic}
                onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                className="dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-status" className="dark:text-gray-300">
                Holat
              </Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                <SelectTrigger className="dark:bg-gray-800 dark:border-gray-700 dark:text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                  <SelectItem value="planned" className="dark:text-white">Rejalashtirilgan</SelectItem>
                  <SelectItem value="completed" className="dark:text-white">Yakunlangan</SelectItem>
                  <SelectItem value="cancelled" className="dark:text-white">Bekor qilingan</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsEditModalOpen(false);
                setSelectedLesson(null);
                resetForm();
              }}
              className="dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Bekor qilish
            </Button>
            <Button onClick={handleEdit} className="bg-green-600 hover:bg-green-700">
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
          setSelectedLesson(null);
        }}
        onConfirm={handleDelete}
        title="Darsni o'chirish"
        description={`Haqiqatan ham "${selectedLesson?.topic}" darsini o'chirmoqchimisiz? Bu amal bekor qilinmaydi.`}
        confirmText="Ha, o'chirish"
        cancelText="Bekor qilish"
      />
    </div>
  );
}
