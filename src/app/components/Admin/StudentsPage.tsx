import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { GraduationCap, Plus, Search, Phone, DollarSign, Edit, Trash2, Eye } from "lucide-react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "../ui/dialog";
import { toast } from "sonner";
import { getStudentsByTenantId, User } from "../../data/mockData";

interface StudentsPageProps {
  tenantId: number;
}

export default function StudentsPage({ tenantId }: StudentsPageProps) {
  const [students, setStudents] = useState<User[]>(getStudentsByTenantId(tenantId));
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<User | null>(null);
  const [formData, setFormData] = useState<any>({
    firstName: "",
    lastName: "",
    phone: "",
    birthDate: "",
    parentName: "",
    parentPhone: "",
    balance: 0,
    discountPercent: 0,
    notes: ""
  });

  const handleCreate = () => {
    if (!formData.firstName || !formData.lastName || !formData.phone) {
      toast.error("Iltimos, barcha majburiy maydonlarni to'ldiring");
      return;
    }

    const newStudent: User = {
      id: Math.max(...students.map(s => s.id)) + 1,
      tenantId,
      roleId: 4,
      phone: formData.phone,
      firstName: formData.firstName,
      lastName: formData.lastName,
      isActive: true,
      createdAt: new Date(),
      role: { id: 4, name: "Student" },
      studentProfile: {
        userId: Math.max(...students.map(s => s.id)) + 1,
        birthDate: formData.birthDate ? new Date(formData.birthDate) : undefined,
        parentName: formData.parentName,
        parentPhone: formData.parentPhone,
        balance: parseFloat(formData.balance) || 0,
        discountPercent: parseFloat(formData.discountPercent) || 0,
        notes: formData.notes
      }
    };

    setStudents([...students, newStudent]);
    setIsCreateModalOpen(false);
    resetForm();
    toast.success("Talaba muvaffaqiyatli qo'shildi");
  };

  const handleEdit = () => {
    if (!selectedStudent || !formData.firstName || !formData.lastName || !formData.phone) {
      toast.error("Iltimos, barcha majburiy maydonlarni to'ldiring");
      return;
    }

    setStudents(students.map(s => 
      s.id === selectedStudent.id 
        ? {
            ...s,
            firstName: formData.firstName,
            lastName: formData.lastName,
            phone: formData.phone,
            studentProfile: {
              ...s.studentProfile!,
              birthDate: formData.birthDate ? new Date(formData.birthDate) : undefined,
              parentName: formData.parentName,
              parentPhone: formData.parentPhone,
              balance: parseFloat(formData.balance) || 0,
              discountPercent: parseFloat(formData.discountPercent) || 0,
              notes: formData.notes
            }
          }
        : s
    ));
    setIsEditModalOpen(false);
    setSelectedStudent(null);
    resetForm();
    toast.success("Talaba ma'lumotlari yangilandi");
  };

  const handleDelete = (student: User) => {
    if (window.confirm(`${student.firstName} ${student.lastName} talabani o'chirmoqchimisiz?`)) {
      setStudents(students.filter(s => s.id !== student.id));
      toast.success("Talaba o'chirildi");
    }
  };

  const openCreateModal = () => {
    resetForm();
    setIsCreateModalOpen(true);
  };

  const openEditModal = (student: User) => {
    setSelectedStudent(student);
    setFormData({
      firstName: student.firstName,
      lastName: student.lastName,
      phone: student.phone,
      birthDate: student.studentProfile?.birthDate 
        ? new Date(student.studentProfile.birthDate).toISOString().split('T')[0] 
        : "",
      parentName: student.studentProfile?.parentName || "",
      parentPhone: student.studentProfile?.parentPhone || "",
      balance: student.studentProfile?.balance || 0,
      discountPercent: student.studentProfile?.discountPercent || 0,
      notes: student.studentProfile?.notes || ""
    });
    setIsEditModalOpen(true);
  };

  const openViewModal = (student: User) => {
    setSelectedStudent(student);
    setIsViewModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      firstName: "",
      lastName: "",
      phone: "",
      birthDate: "",
      parentName: "",
      parentPhone: "",
      balance: 0,
      discountPercent: 0,
      notes: ""
    });
  };

  const filteredStudents = students.filter(student =>
    student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.phone.includes(searchTerm)
  );

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl mb-2">Students</h2>
          <p className="text-slate-600">Manage student profiles and enrollments</p>
        </div>
        <Button onClick={openCreateModal} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="size-4 mr-2" />
          Add New Student
        </Button>
      </div>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
            <Input 
              placeholder="Search students by name, phone..." 
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>All Students ({filteredStudents.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Parent Contact</TableHead>
                <TableHead>Balance</TableHead>
                <TableHead>Discount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.map((student) => {
                const profile = student.studentProfile!;
                const balance = Number(profile.balance);

                return (
                  <TableRow key={student.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="size-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <GraduationCap className="size-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium">
                            {student.firstName} {student.lastName}
                          </p>
                          <p className="text-xs text-slate-500">
                            ID: {student.id}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <Phone className="size-3 text-slate-400" />
                        {student.phone}
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm">{profile.parentName || "N/A"}</p>
                      <p className="text-xs text-slate-500">{profile.parentPhone || ""}</p>
                    </TableCell>
                    <TableCell>
                      <div
                        className={`flex items-center gap-1 font-medium ${
                          balance >= 0 ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        <DollarSign className="size-3" />
                        {balance}
                      </div>
                    </TableCell>
                    <TableCell>
                      {profile.discountPercent > 0 ? (
                        <Badge className="bg-orange-100 text-orange-800">
                          {profile.discountPercent}% OFF
                        </Badge>
                      ) : (
                        <span className="text-slate-400 text-sm">None</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {student.isActive ? (
                        <Badge className="bg-green-100 text-green-800">Active</Badge>
                      ) : (
                        <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openViewModal(student)}
                        >
                          <Eye className="size-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditModal(student)}
                        >
                          <Edit className="size-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(student)}
                        >
                          <Trash2 className="size-4 text-red-600" />
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
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Student</DialogTitle>
            <DialogDescription>Create a new student profile</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                placeholder="John"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                placeholder="Doe"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+998 90 123 45 67"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="birthDate">Birth Date</Label>
              <Input
                id="birthDate"
                type="date"
                value={formData.birthDate}
                onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="parentName">Parent Name</Label>
              <Input
                id="parentName"
                value={formData.parentName}
                onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                placeholder="Parent full name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="parentPhone">Parent Phone</Label>
              <Input
                id="parentPhone"
                value={formData.parentPhone}
                onChange={(e) => setFormData({ ...formData, parentPhone: e.target.value })}
                placeholder="+998 90 123 45 67"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="balance">Balance ($)</Label>
              <Input
                id="balance"
                type="number"
                value={formData.balance}
                onChange={(e) => setFormData({ ...formData, balance: e.target.value })}
                placeholder="0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="discount">Discount (%)</Label>
              <Input
                id="discount"
                type="number"
                value={formData.discountPercent}
                onChange={(e) => setFormData({ ...formData, discountPercent: e.target.value })}
                placeholder="0"
                min="0"
                max="100"
              />
            </div>

            <div className="col-span-2 space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Input
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Additional notes..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreate} className="bg-blue-600 hover:bg-blue-700">
              Create Student
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Student</DialogTitle>
            <DialogDescription>Update student information</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-firstName">First Name *</Label>
              <Input
                id="edit-firstName"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-lastName">Last Name *</Label>
              <Input
                id="edit-lastName"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-phone">Phone Number *</Label>
              <Input
                id="edit-phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-birthDate">Birth Date</Label>
              <Input
                id="edit-birthDate"
                type="date"
                value={formData.birthDate}
                onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-parentName">Parent Name</Label>
              <Input
                id="edit-parentName"
                value={formData.parentName}
                onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-parentPhone">Parent Phone</Label>
              <Input
                id="edit-parentPhone"
                value={formData.parentPhone}
                onChange={(e) => setFormData({ ...formData, parentPhone: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-balance">Balance ($)</Label>
              <Input
                id="edit-balance"
                type="number"
                value={formData.balance}
                onChange={(e) => setFormData({ ...formData, balance: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-discount">Discount (%)</Label>
              <Input
                id="edit-discount"
                type="number"
                value={formData.discountPercent}
                onChange={(e) => setFormData({ ...formData, discountPercent: e.target.value })}
                min="0"
                max="100"
              />
            </div>

            <div className="col-span-2 space-y-2">
              <Label htmlFor="edit-notes">Notes</Label>
              <Input
                id="edit-notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEdit} className="bg-blue-600 hover:bg-blue-700">
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Student Details</DialogTitle>
            <DialogDescription>View complete student information</DialogDescription>
          </DialogHeader>
          {selectedStudent && (
            <div className="space-y-6 py-4">
              <div className="flex items-center gap-4">
                <div className="size-16 rounded-full bg-blue-100 flex items-center justify-center">
                  <GraduationCap className="size-8 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl">{selectedStudent.firstName} {selectedStudent.lastName}</h3>
                  <p className="text-sm text-slate-600">Student ID: {selectedStudent.id}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Phone Number</p>
                  <div className="flex items-center gap-2">
                    <Phone className="size-4 text-slate-400" />
                    <p className="font-medium">{selectedStudent.phone}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-slate-600 mb-1">Status</p>
                  {selectedStudent.isActive ? (
                    <Badge className="bg-green-100 text-green-800">Active</Badge>
                  ) : (
                    <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>
                  )}
                </div>
                {selectedStudent.studentProfile?.birthDate && (
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Birth Date</p>
                    <p>{new Date(selectedStudent.studentProfile.birthDate).toLocaleDateString()}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-slate-600 mb-1">Balance</p>
                  <div className={`flex items-center gap-1 font-semibold ${
                    Number(selectedStudent.studentProfile?.balance || 0) >= 0 ? "text-green-600" : "text-red-600"
                  }`}>
                    <DollarSign className="size-4" />
                    {selectedStudent.studentProfile?.balance || 0}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-slate-600 mb-1">Parent Name</p>
                  <p className="font-medium">{selectedStudent.studentProfile?.parentName || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 mb-1">Parent Phone</p>
                  <p className="font-medium">{selectedStudent.studentProfile?.parentPhone || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 mb-1">Discount</p>
                  <p className="font-medium">{selectedStudent.studentProfile?.discountPercent || 0}%</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 mb-1">Created At</p>
                  <p>{new Date(selectedStudent.createdAt).toLocaleDateString()}</p>
                </div>
              </div>

              {selectedStudent.studentProfile?.notes && (
                <div>
                  <p className="text-sm text-slate-600 mb-1">Notes</p>
                  <p className="text-sm bg-slate-50 p-3 rounded">{selectedStudent.studentProfile.notes}</p>
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
                if (selectedStudent) {
                  setIsViewModalOpen(false);
                  openEditModal(selectedStudent);
                }
              }}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Edit className="size-4 mr-2" />
              Edit Student
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
