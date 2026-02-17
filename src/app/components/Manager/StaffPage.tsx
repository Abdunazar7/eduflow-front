import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  UserPlus,
  Edit,
  Trash2,
  Search,
  Mail,
  Phone,
  UserCog,
  Users,
  Building2,
} from "lucide-react";
import { toast } from "sonner";

interface Staff {
  id: number;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  position: string;
  department: string;
  branchId?: number;
  branchName?: string;
  status: "active" | "inactive" | "on_leave";
  salary: number;
  hireDate: string;
  lastLogin?: string;
}

// Mock data
const mockStaff: Staff[] = [
  {
    id: 1,
    firstName: "Sanjar",
    lastName: "Rahimov",
    phone: "+998901234580",
    email: "sanjar@center.uz",
    position: "IT Support",
    department: "Technology",
    branchId: 1,
    branchName: "Main Branch",
    status: "active",
    salary: 3000000,
    hireDate: "2024-03-01",
    lastLogin: "2026-02-12 08:45",
  },
  {
    id: 2,
    firstName: "Gulnora",
    lastName: "Azimova",
    phone: "+998905554321",
    email: "gulnora@center.uz",
    position: "Receptionist",
    department: "Administration",
    branchId: 1,
    branchName: "Main Branch",
    status: "active",
    salary: 2500000,
    hireDate: "2024-04-15",
    lastLogin: "2026-02-12 09:00",
  },
  {
    id: 3,
    firstName: "Farruh",
    lastName: "Tursunov",
    phone: "+998907778888",
    email: "farruh@center.uz",
    position: "Accountant",
    department: "Finance",
    status: "active",
    salary: 4000000,
    hireDate: "2024-02-10",
    lastLogin: "2026-02-11 17:30",
  },
  {
    id: 4,
    firstName: "Nilufar",
    lastName: "Karimova",
    phone: "+998909991234",
    email: "nilufar@center.uz",
    position: "HR Specialist",
    department: "Human Resources",
    branchId: 2,
    branchName: "Secondary Branch",
    status: "on_leave",
    salary: 3500000,
    hireDate: "2024-05-20",
    lastLogin: "2026-02-05 14:20",
  },
  {
    id: 5,
    firstName: "Aziz",
    lastName: "Mahmudov",
    phone: "+998901112233",
    email: "aziz@center.uz",
    position: "Marketing Manager",
    department: "Marketing",
    status: "active",
    salary: 4500000,
    hireDate: "2024-01-15",
    lastLogin: "2026-02-12 10:00",
  },
];

interface StaffPageProps {
  tenantId: number;
}

export default function StaffPage({ tenantId }: StaffPageProps) {
  const [staff, setStaff] = useState<Staff[]>(mockStaff);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null);

  const filteredStaff = staff.filter(
    (member) =>
      member.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.phone.includes(searchTerm) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddStaff = () => {
    setEditingStaff(null);
    setIsDialogOpen(true);
  };

  const handleEditStaff = (member: Staff) => {
    setEditingStaff(member);
    setIsDialogOpen(true);
  };

  const handleDeleteStaff = (staffId: number) => {
    setStaff(staff.filter((s) => s.id !== staffId));
    toast.success("Staff member deleted successfully");
  };

  const handleSaveStaff = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    if (editingStaff) {
      // Update existing staff
      setStaff(
        staff.map((s) =>
          s.id === editingStaff.id
            ? {
                ...s,
                firstName: formData.get("firstName") as string,
                lastName: formData.get("lastName") as string,
                phone: formData.get("phone") as string,
                email: formData.get("email") as string,
                position: formData.get("position") as string,
                department: formData.get("department") as string,
                salary: parseInt(formData.get("salary") as string),
                status: formData.get("status") as "active" | "inactive" | "on_leave",
              }
            : s
        )
      );
      toast.success("Staff member updated successfully");
    } else {
      // Add new staff
      const newStaff: Staff = {
        id: Math.max(...staff.map((s) => s.id)) + 1,
        firstName: formData.get("firstName") as string,
        lastName: formData.get("lastName") as string,
        phone: formData.get("phone") as string,
        email: formData.get("email") as string,
        position: formData.get("position") as string,
        department: formData.get("department") as string,
        salary: parseInt(formData.get("salary") as string),
        status: "active",
        hireDate: new Date().toISOString().split("T")[0],
      };
      setStaff([...staff, newStaff]);
      toast.success("Staff member added successfully");
    }
    
    setIsDialogOpen(false);
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: "default" | "outline" | "destructive"; color: string }> = {
      active: { variant: "default", color: "text-green-600" },
      inactive: { variant: "outline", color: "text-gray-600" },
      on_leave: { variant: "outline", color: "text-orange-600" },
    };
    const config = variants[status] || variants.active;
    return (
      <Badge variant={config.variant}>
        {status.replace("_", " ").charAt(0).toUpperCase() + status.replace("_", " ").slice(1)}
      </Badge>
    );
  };

  const formatSalary = (amount: number) => {
    return new Intl.NumberFormat("uz-UZ", {
      style: "currency",
      currency: "UZS",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-3xl mb-2">Staff Management</h1>
        <p className="text-slate-600">
          Manage all staff members of your educational center
        </p>
      </div>

      <div className="grid gap-6 mb-6 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Total Staff</CardTitle>
            <Users className="size-4 text-slate-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{staff.length}</div>
            <p className="text-xs text-slate-600 mt-1">All staff members</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Active Staff</CardTitle>
            <UserCog className="size-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">
              {staff.filter((s) => s.status === "active").length}
            </div>
            <p className="text-xs text-slate-600 mt-1">Currently working</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">On Leave</CardTitle>
            <UserCog className="size-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">
              {staff.filter((s) => s.status === "on_leave").length}
            </div>
            <p className="text-xs text-slate-600 mt-1">Currently on leave</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Departments</CardTitle>
            <Building2 className="size-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">
              {new Set(staff.map((s) => s.department)).size}
            </div>
            <p className="text-xs text-slate-600 mt-1">Active departments</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All Staff Members</CardTitle>
              <CardDescription>
                View and manage all staff members
              </CardDescription>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={handleAddStaff}>
                  <UserPlus className="size-4 mr-2" />
                  Add Staff
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>
                    {editingStaff ? "Edit Staff Member" : "Add New Staff Member"}
                  </DialogTitle>
                  <DialogDescription>
                    {editingStaff
                      ? "Update staff member information"
                      : "Add a new staff member to your center"}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSaveStaff}>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          name="firstName"
                          defaultValue={editingStaff?.firstName}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          name="lastName"
                          defaultValue={editingStaff?.lastName}
                          required
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          placeholder="+998901234567"
                          defaultValue={editingStaff?.phone}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="staff@center.uz"
                          defaultValue={editingStaff?.email}
                          required
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="position">Position</Label>
                        <Input
                          id="position"
                          name="position"
                          placeholder="e.g., IT Support"
                          defaultValue={editingStaff?.position}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="department">Department</Label>
                        <Select
                          name="department"
                          defaultValue={editingStaff?.department}
                          required
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select department" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Administration">Administration</SelectItem>
                            <SelectItem value="Technology">Technology</SelectItem>
                            <SelectItem value="Finance">Finance</SelectItem>
                            <SelectItem value="Human Resources">Human Resources</SelectItem>
                            <SelectItem value="Marketing">Marketing</SelectItem>
                            <SelectItem value="Operations">Operations</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="salary">Monthly Salary (UZS)</Label>
                        <Input
                          id="salary"
                          name="salary"
                          type="number"
                          placeholder="3000000"
                          defaultValue={editingStaff?.salary}
                          required
                        />
                      </div>
                      {editingStaff && (
                        <div className="space-y-2">
                          <Label htmlFor="status">Status</Label>
                          <Select
                            name="status"
                            defaultValue={editingStaff?.status}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="active">Active</SelectItem>
                              <SelectItem value="inactive">Inactive</SelectItem>
                              <SelectItem value="on_leave">On Leave</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">
                      {editingStaff ? "Update" : "Add"} Staff Member
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 size-4 text-slate-400" />
              <Input
                placeholder="Search staff by name, phone, email, position, or department..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Staff Member</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Position & Dept.</TableHead>
                  <TableHead>Branch</TableHead>
                  <TableHead>Salary</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Hire Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStaff.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      No staff members found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredStaff.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell>
                        <div>
                          <p>
                            {member.firstName} {member.lastName}
                          </p>
                          <p className="text-xs text-slate-500">
                            ID: {member.id}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm">
                            <Phone className="size-3 text-slate-400" />
                            {member.phone}
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Mail className="size-3 text-slate-400" />
                            {member.email}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm">{member.position}</p>
                          <p className="text-xs text-slate-500">
                            {member.department}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        {member.branchName ? (
                          <div className="flex items-center gap-2">
                            <Building2 className="size-3 text-slate-400" />
                            <span className="text-sm">{member.branchName}</span>
                          </div>
                        ) : (
                          <span className="text-sm text-slate-400">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <p className="text-sm">{formatSalary(member.salary)}</p>
                      </TableCell>
                      <TableCell>{getStatusBadge(member.status)}</TableCell>
                      <TableCell>
                        <p className="text-sm">{member.hireDate}</p>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditStaff(member)}
                          >
                            <Edit className="size-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteStaff(member.id)}
                          >
                            <Trash2 className="size-4 text-red-500" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
