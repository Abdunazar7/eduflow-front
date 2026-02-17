import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { BookOpen, Plus, DollarSign, Edit, Trash2, Eye } from "lucide-react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Switch } from "../ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "../ui/dialog";
import { Separator } from "../ui/separator";
import { toast } from "sonner";
import ConfirmDialog from "../shared/ConfirmDialog";
import { courses as initialCourses, courseLevels as initialCourseLevels, Course, CourseLevel } from "../../data/mockData";

interface CoursesPageProps {
  tenantId: number;
}

export default function CoursesPage({ tenantId }: CoursesPageProps) {
  const [coursesList, setCoursesList] = useState<Course[]>(initialCourses.filter((c) => c.tenantId === tenantId));
  const [levelsList, setLevelsList] = useState<CourseLevel[]>(initialCourseLevels);
  
  // Course modals
  const [isCourseCreateOpen, setIsCourseCreateOpen] = useState(false);
  const [isCourseEditOpen, setIsCourseEditOpen] = useState(false);
  const [isCourseViewOpen, setIsCourseViewOpen] = useState(false);
  const [showCourseDeleteDialog, setShowCourseDeleteDialog] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [courseFormData, setCourseFormData] = useState<Partial<Course>>({ isActive: true });

  // Level modals
  const [isLevelCreateOpen, setIsLevelCreateOpen] = useState(false);
  const [isLevelEditOpen, setIsLevelEditOpen] = useState(false);
  const [showLevelDeleteDialog, setShowLevelDeleteDialog] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState<CourseLevel | null>(null);
  const [levelFormData, setLevelFormData] = useState<Partial<CourseLevel>>({ orderIndex: 1, durationMonths: 3 });

  // Course handlers
  const handleCreateCourse = () => {
    if (!courseFormData.name) {
      toast.error("Iltimos, kurs nomini kiriting");
      return;
    }

    const newCourse: Course = {
      id: Math.max(...coursesList.map((c) => c.id), 0) + 1,
      tenantId,
      name: courseFormData.name,
      description: courseFormData.description,
      isActive: courseFormData.isActive ?? true,
    };

    setCoursesList([...coursesList, newCourse]);
    setIsCourseCreateOpen(false);
    setCourseFormData({ isActive: true });
    toast.success("Kurs muvaffaqiyatli qo'shildi");
  };

  const handleEditCourse = () => {
    if (!selectedCourse || !courseFormData.name) {
      toast.error("Iltimos, kurs nomini kiriting");
      return;
    }

    setCoursesList(
      coursesList.map((c) =>
        c.id === selectedCourse.id
          ? {
              ...c,
              name: courseFormData.name!,
              description: courseFormData.description,
              isActive: courseFormData.isActive ?? c.isActive,
            }
          : c
      )
    );
    setIsCourseEditOpen(false);
    setSelectedCourse(null);
    setCourseFormData({ isActive: true });
    toast.success("Kurs muvaffaqiyatli yangilandi");
  };

  const handleDeleteCourseClick = (course: Course) => {
    setSelectedCourse(course);
    setShowCourseDeleteDialog(true);
  };

  const confirmDeleteCourse = () => {
    if (selectedCourse) {
      setCoursesList(coursesList.filter((c) => c.id !== selectedCourse.id));
      setLevelsList(levelsList.filter((l) => l.courseId !== selectedCourse.id));
      toast.success("Kurs o'chirildi");
      setSelectedCourse(null);
    }
    setShowCourseDeleteDialog(false);
  };

  // Level handlers
  const handleCreateLevel = () => {
    if (!selectedCourse || !levelFormData.name || !levelFormData.price) {
      toast.error("Iltimos, barcha majburiy maydonlarni to'ldiring");
      return;
    }

    const newLevel: CourseLevel = {
      id: Math.max(...levelsList.map((l) => l.id), 0) + 1,
      courseId: selectedCourse.id,
      name: levelFormData.name,
      orderIndex: levelFormData.orderIndex || 1,
      price: levelFormData.price,
      durationMonths: levelFormData.durationMonths || 3,
    };

    setLevelsList([...levelsList, newLevel]);
    setIsLevelCreateOpen(false);
    setLevelFormData({ orderIndex: 1, durationMonths: 3 });
    toast.success("Daraja muvaffaqiyatli qo'shildi");
  };

  const handleEditLevel = () => {
    if (!selectedLevel || !levelFormData.name || !levelFormData.price) {
      toast.error("Iltimos, barcha majburiy maydonlarni to'ldiring");
      return;
    }

    setLevelsList(
      levelsList.map((l) =>
        l.id === selectedLevel.id
          ? {
              ...l,
              name: levelFormData.name!,
              orderIndex: levelFormData.orderIndex || l.orderIndex,
              price: levelFormData.price!,
              durationMonths: levelFormData.durationMonths || l.durationMonths,
            }
          : l
      )
    );
    setIsLevelEditOpen(false);
    setSelectedLevel(null);
    setLevelFormData({ orderIndex: 1, durationMonths: 3 });
    toast.success("Daraja muvaffaqiyatli yangilandi");
  };

  const handleDeleteLevelClick = (level: CourseLevel) => {
    setSelectedLevel(level);
    setShowLevelDeleteDialog(true);
  };

  const confirmDeleteLevel = () => {
    if (selectedLevel) {
      setLevelsList(levelsList.filter((l) => l.id !== selectedLevel.id));
      toast.success("Daraja o'chirildi");
      setSelectedLevel(null);
    }
    setShowLevelDeleteDialog(false);
  };

  const openCourseEditModal = (course: Course) => {
    setSelectedCourse(course);
    setCourseFormData({
      name: course.name,
      description: course.description,
      isActive: course.isActive,
    });
    setIsCourseEditOpen(true);
  };

  const openLevelCreateModal = (course: Course) => {
    setSelectedCourse(course);
    const existingLevels = levelsList.filter((l) => l.courseId === course.id);
    setLevelFormData({
      orderIndex: existingLevels.length + 1,
      durationMonths: 3,
    });
    setIsLevelCreateOpen(true);
  };

  const openLevelEditModal = (level: CourseLevel) => {
    setSelectedLevel(level);
    setLevelFormData({
      name: level.name,
      orderIndex: level.orderIndex,
      price: level.price,
      durationMonths: level.durationMonths,
    });
    setIsLevelEditOpen(true);
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl mb-2">Courses & Levels</h2>
          <p className="text-slate-600 dark:text-slate-400">Manage your educational programs</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setIsCourseCreateOpen(true)}>
          <Plus className="size-4 mr-2" />
          Add New Course
        </Button>
      </div>

      <div className="space-y-6">
        {coursesList.map((course) => {
          const levels = levelsList.filter((l) => l.courseId === course.id);

          return (
            <Card key={course.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="size-12 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                      <BookOpen className="size-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <CardTitle>{course.name}</CardTitle>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{course.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {course.isActive ? (
                      <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">Active</Badge>
                    ) : (
                      <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300">Inactive</Badge>
                    )}
                    <Button variant="outline" size="sm" onClick={() => openCourseEditModal(course)}>
                      <Edit className="size-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteCourseClick(course)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium">Course Levels ({levels.length})</h4>
                    <Button variant="outline" size="sm" onClick={() => openLevelCreateModal(course)}>
                      <Plus className="size-3 mr-1" />
                      Add Level
                    </Button>
                  </div>
                  {levels.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Level Name</TableHead>
                          <TableHead>Order</TableHead>
                          <TableHead>Price</TableHead>
                          <TableHead>Duration</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {levels.map((level) => (
                          <TableRow key={level.id}>
                            <TableCell>
                              <p className="font-medium">{level.name}</p>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">{level.orderIndex}</Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1 text-green-600">
                                <DollarSign className="size-3" />
                                <span>{level.price}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <p className="text-sm">{level.durationMonths} months</p>
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-1">
                                <Button variant="ghost" size="sm" onClick={() => openLevelEditModal(level)}>
                                  <Edit className="size-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteLevelClick(level)}
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                >
                                  <Trash2 className="size-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <p className="text-center text-slate-500 py-4">Bu kurs uchun hali darajalar yo'q</p>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Create Course Modal */}
      <Dialog open={isCourseCreateOpen} onOpenChange={setIsCourseCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Yangi Kurs Qo'shish</DialogTitle>
            <DialogDescription>Yangi kurs ma'lumotlarini kiriting</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="courseName">Kurs Nomi *</Label>
              <Input
                id="courseName"
                value={courseFormData.name || ""}
                onChange={(e) => setCourseFormData({ ...courseFormData, name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="courseDescription">Tavsif</Label>
              <Textarea
                id="courseDescription"
                value={courseFormData.description || ""}
                onChange={(e) => setCourseFormData({ ...courseFormData, description: e.target.value })}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="courseActive">Faol</Label>
              <Switch
                id="courseActive"
                checked={courseFormData.isActive ?? true}
                onCheckedChange={(checked) => setCourseFormData({ ...courseFormData, isActive: checked })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCourseCreateOpen(false)}>
              Bekor qilish
            </Button>
            <Button onClick={handleCreateCourse}>Qo'shish</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Course Modal */}
      <Dialog open={isCourseEditOpen} onOpenChange={setIsCourseEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Kursni Tahrirlash</DialogTitle>
            <DialogDescription>Kurs ma'lumotlarini yangilang</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="editCourseName">Kurs Nomi *</Label>
              <Input
                id="editCourseName"
                value={courseFormData.name || ""}
                onChange={(e) => setCourseFormData({ ...courseFormData, name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="editCourseDescription">Tavsif</Label>
              <Textarea
                id="editCourseDescription"
                value={courseFormData.description || ""}
                onChange={(e) => setCourseFormData({ ...courseFormData, description: e.target.value })}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="editCourseActive">Faol</Label>
              <Switch
                id="editCourseActive"
                checked={courseFormData.isActive ?? true}
                onCheckedChange={(checked) => setCourseFormData({ ...courseFormData, isActive: checked })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCourseEditOpen(false)}>
              Bekor qilish
            </Button>
            <Button onClick={handleEditCourse}>Yangilash</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Level Modal */}
      <Dialog open={isLevelCreateOpen} onOpenChange={setIsLevelCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Yangi Daraja Qo'shish</DialogTitle>
            <DialogDescription>
              {selectedCourse?.name} kursi uchun yangi daraja qo'shing
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="levelName">Daraja Nomi *</Label>
              <Input
                id="levelName"
                value={levelFormData.name || ""}
                onChange={(e) => setLevelFormData({ ...levelFormData, name: e.target.value })}
                placeholder="Masalan: Beginner, Intermediate"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="levelOrder">Tartib Raqami *</Label>
                <Input
                  id="levelOrder"
                  type="number"
                  value={levelFormData.orderIndex || 1}
                  onChange={(e) => setLevelFormData({ ...levelFormData, orderIndex: Number(e.target.value) })}
                />
              </div>
              <div>
                <Label htmlFor="levelDuration">Davomiyligi (oy) *</Label>
                <Input
                  id="levelDuration"
                  type="number"
                  value={levelFormData.durationMonths || 3}
                  onChange={(e) => setLevelFormData({ ...levelFormData, durationMonths: Number(e.target.value) })}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="levelPrice">Narxi *</Label>
              <Input
                id="levelPrice"
                type="number"
                value={levelFormData.price || ""}
                onChange={(e) => setLevelFormData({ ...levelFormData, price: Number(e.target.value) })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsLevelCreateOpen(false)}>
              Bekor qilish
            </Button>
            <Button onClick={handleCreateLevel}>Qo'shish</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Level Modal */}
      <Dialog open={isLevelEditOpen} onOpenChange={setIsLevelEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Darajani Tahrirlash</DialogTitle>
            <DialogDescription>Daraja ma'lumotlarini yangilang</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="editLevelName">Daraja Nomi *</Label>
              <Input
                id="editLevelName"
                value={levelFormData.name || ""}
                onChange={(e) => setLevelFormData({ ...levelFormData, name: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="editLevelOrder">Tartib Raqami *</Label>
                <Input
                  id="editLevelOrder"
                  type="number"
                  value={levelFormData.orderIndex || 1}
                  onChange={(e) => setLevelFormData({ ...levelFormData, orderIndex: Number(e.target.value) })}
                />
              </div>
              <div>
                <Label htmlFor="editLevelDuration">Davomiyligi (oy) *</Label>
                <Input
                  id="editLevelDuration"
                  type="number"
                  value={levelFormData.durationMonths || 3}
                  onChange={(e) => setLevelFormData({ ...levelFormData, durationMonths: Number(e.target.value) })}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="editLevelPrice">Narxi *</Label>
              <Input
                id="editLevelPrice"
                type="number"
                value={levelFormData.price || ""}
                onChange={(e) => setLevelFormData({ ...levelFormData, price: Number(e.target.value) })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsLevelEditOpen(false)}>
              Bekor qilish
            </Button>
            <Button onClick={handleEditLevel}>Yangilash</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Course Confirmation */}
      <ConfirmDialog
        open={showCourseDeleteDialog}
        onOpenChange={setShowCourseDeleteDialog}
        onConfirm={confirmDeleteCourse}
        title="Kursni o'chirmoqchimisiz?"
        description={`${selectedCourse?.name} kursini va uning barcha darajalarini butunlay o'chirmoqchimisiz? Bu amalni bekor qilib bo'lmaydi.`}
        confirmText="Ha, o'chirish"
        cancelText="Yo'q"
        isDestructive
      />

      {/* Delete Level Confirmation */}
      <ConfirmDialog
        open={showLevelDeleteDialog}
        onOpenChange={setShowLevelDeleteDialog}
        onConfirm={confirmDeleteLevel}
        title="Darajani o'chirmoqchimisiz?"
        description={`${selectedLevel?.name} darajasini butunlay o'chirmoqchimisiz? Bu amalni bekor qilib bo'lmaydi.`}
        confirmText="Ha, o'chirish"
        cancelText="Yo'q"
        isDestructive
      />
    </div>
  );
}
