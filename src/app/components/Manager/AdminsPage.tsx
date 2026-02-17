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
  Shield,
  UserCheck,
} from "lucide-react";
import { toast } from "sonner";

interface Admin {
  id: number;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  status: "active" | "inactive";
  permissions: string[];
  createdAt: string;
  lastLogin?: string;
}

// Mock data
const mockAdmins: Admin[] = [
  {
    id: 1,
    firstName: "Dilshod",
    lastName: "Abdullayev",
    phone: "+998901234569",
    email: "dilshod@center.uz",
    status: "active",
    permissions: ["branches", "courses", "groups", "students", "teachers"],
    createdAt: "2024-05-10",
    lastLogin: "2026-02-12 10:15",
  },
  {
    id: 2,
    firstName: "Kamola",
    lastName: "Saidova",
    phone: "+998905551234",
    email: "kamola@center.uz",
    status: "active",
    permissions: ["students", "leads", "transactions"],
    createdAt: "2024-06-15",
    lastLogin: "2026-02-11 16:30",
  },
  {
    id: 3,
    firstName: "Otabek",
    lastName: "Kamilov",
    phone: "+998907771234",
    email: "otabek@center.uz",
    status: "inactive",
    permissions: ["courses", "groups", "teachers"],
    createdAt: "2024-07-20",
    lastLogin: "2026-01-28 09:00",
  },
];

interface AdminsPageProps {
  tenantId: number;
}

export default function AdminsPage({ tenantId }: AdminsPageProps) {
  const [admins, setAdmins] = useState<Admin[]>(mockAdmins);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<Admin | null>(null);

  const filteredAdmins = admins.filter(
    (admin) =>
      admin.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.phone.includes(searchTerm) ||
      admin.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddAdmin = () => {
    setEditingAdmin(null);
    setIsDialogOpen(true);
  };

  const handleEditAdmin = (admin: Admin) => {
    setEditingAdmin(admin);
    setIsDialogOpen(true);
  };

  const handleDeleteAdmin = (adminId: number) => {
    setAdmins(admins.filter((a) => a.id !== adminId));
    toast.success("Admin deleted successfully");
  };

  const handleSaveAdmin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    if (editingAdmin) {
      // Update existing admin
      setAdmins(
        admins.map((a) =>
          a.id === editingAdmin.id
            ? {
                ...a,
                firstName: formData.get("firstName") as string,
                lastName: formData.get("lastName") as string,
                phone: formData.get("phone") as string,
                email: formData.get("email") as string,
                status: formData.get("status") as "active" | "inactive",
              }
            : a
        )
      );
      toast.success("Admin updated successfully");
    } else {
      // Add new admin
      const newAdmin: Admin = {
        id: Math.max(...admins.map((a) => a.id)) + 1,
        firstName: formData.get("firstName") as string,
        lastName: formData.get("lastName") as string,
        phone: formData.get("phone") as string,
        email: formData.get("email") as string,
        status: "active",
        permissions: ["students", "teachers"],
        createdAt: new Date().toISOString().split("T")[0],
      };
      setAdmins([...admins, newAdmin]);
      toast.success("Admin added successfully");
    }
    
    setIsDialogOpen(false);
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "outline"> = {
      active: "default",
      inactive: "outline",
    };
    return (
      <Badge variant={variants[status] || "default"}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-3xl mb-2">Admins Management</h1>
        <p className="text-slate-600">
          Manage administrator accounts for your educational center
        </p>
      </div>

      <div className="grid gap-6 mb-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Total Admins</CardTitle>
            <Shield className="size-4 text-slate-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{admins.length}</div>
            <p className="text-xs text-slate-600 mt-1">In your center</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Active Admins</CardTitle>
            <UserCheck className="size-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">
              {admins.filter((a) => a.status === "active").length}
            </div>
            <p className="text-xs text-slate-600 mt-1">Currently active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Inactive Admins</CardTitle>
            <Shield className="size-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">
              {admins.filter((a) => a.status === "inactive").length}
            </div>
            <p className="text-xs text-slate-600 mt-1">Not active</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All Admins</CardTitle>
              <CardDescription>
                View and manage administrator accounts
              </CardDescription>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={handleAddAdmin}>
                  <UserPlus className="size-4 mr-2" />
                  Add Admin
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>
                    {editingAdmin ? "Edit Admin" : "Add New Admin"}
                  </DialogTitle>
                  <DialogDescription>
                    {editingAdmin
                      ? "Update administrator information"
                      : "Create a new administrator account"}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSaveAdmin}>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          name="firstName"
                          defaultValue={editingAdmin?.firstName}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          name="lastName"
                          defaultValue={editingAdmin?.lastName}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder="+998901234567"
                        defaultValue={editingAdmin?.phone}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="admin@center.uz"
                        defaultValue={editingAdmin?.email}
                        required
                      />
                    </div>
                    {editingAdmin && (
                      <div className="space-y-2">
                        <Label htmlFor="status">Status</Label>
                        <Select
                          name="status"
                          defaultValue={editingAdmin?.status}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
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
                      {editingAdmin ? "Update" : "Create"} Admin
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
                placeholder="Search admins by name, phone, or email..."
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
                  <TableHead>Administrator</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Permissions</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Last Login</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAdmins.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      No admins found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAdmins.map((admin) => (
                    <TableRow key={admin.id}>
                      <TableCell>
                        <div>
                          <p>
                            {admin.firstName} {admin.lastName}
                          </p>
                          <p className="text-xs text-slate-500">
                            ID: {admin.id}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm">
                            <Phone className="size-3 text-slate-400" />
                            {admin.phone}
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Mail className="size-3 text-slate-400" />
                            {admin.email}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {admin.permissions.slice(0, 3).map((perm) => (
                            <Badge
                              key={perm}
                              variant="outline"
                              className="text-xs"
                            >
                              {perm}
                            </Badge>
                          ))}
                          {admin.permissions.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{admin.permissions.length - 3}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(admin.status)}</TableCell>
                      <TableCell>
                        <p className="text-sm">{admin.createdAt}</p>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm">
                          {admin.lastLogin || "Never"}
                        </p>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditAdmin(admin)}
                          >
                            <Edit className="size-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteAdmin(admin.id)}
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
