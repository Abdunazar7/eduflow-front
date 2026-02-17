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
  Building2,
  Mail,
  Phone,
  Shield,
  Eye,
} from "lucide-react";
import { toast } from "sonner";

interface Manager {
  id: number;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  tenantId: number;
  tenantName: string;
  status: "active" | "inactive" | "suspended";
  createdAt: string;
  lastLogin?: string;
}

// Mock data
const mockManagers: Manager[] = [
  {
    id: 1,
    firstName: "Alisher",
    lastName: "Karimov",
    phone: "+998901234568",
    email: "alisher@edusoft.uz",
    tenantId: 1,
    tenantName: "EduSoft Language Center",
    status: "active",
    createdAt: "2024-01-15",
    lastLogin: "2026-02-12 09:30",
  },
  {
    id: 2,
    firstName: "Nodira",
    lastName: "Azimova",
    phone: "+998901234578",
    email: "nodira@smartlearn.uz",
    tenantId: 2,
    tenantName: "SmartLearn Academy",
    status: "active",
    createdAt: "2024-02-20",
    lastLogin: "2026-02-11 14:20",
  },
  {
    id: 3,
    firstName: "Sardor",
    lastName: "Tursunov",
    phone: "+998901234588",
    email: "sardor@lingualab.uz",
    tenantId: 3,
    tenantName: "LinguaLab Center",
    status: "inactive",
    createdAt: "2024-03-10",
    lastLogin: "2026-01-28 16:45",
  },
  {
    id: 4,
    firstName: "Malika",
    lastName: "Rahimova",
    phone: "+998901234598",
    email: "malika@polyglot.uz",
    tenantId: 4,
    tenantName: "Polyglot Institute",
    status: "active",
    createdAt: "2024-04-05",
    lastLogin: "2026-02-12 11:15",
  },
];

export default function ManagersPage() {
  const [managers, setManagers] = useState<Manager[]>(mockManagers);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editingManager, setEditingManager] = useState<Manager | null>(null);
  const [viewingManager, setViewingManager] = useState<Manager | null>(null);

  const filteredManagers = managers.filter(
    (manager) =>
      manager.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      manager.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      manager.phone.includes(searchTerm) ||
      manager.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      manager.tenantName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddManager = () => {
    setEditingManager(null);
    setIsDialogOpen(true);
  };

  const handleEditManager = (manager: Manager) => {
    setEditingManager(manager);
    setIsDialogOpen(true);
  };

  const handleViewManager = (manager: Manager) => {
    setViewingManager(manager);
    setIsViewModalOpen(true);
  };

  const handleDeleteManager = (managerId: number) => {
    if (window.confirm("Manager hisobini o'chirmoqchimisiz?")) {
      setManagers(managers.filter((m) => m.id !== managerId));
      toast.success("Manager muvaffaqiyatli o'chirildi");
    }
  };

  const handleSaveManager = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    if (editingManager) {
      // Update existing manager
      setManagers(
        managers.map((m) =>
          m.id === editingManager.id
            ? {
                ...m,
                firstName: formData.get("firstName") as string,
                lastName: formData.get("lastName") as string,
                phone: formData.get("phone") as string,
                email: formData.get("email") as string,
                status: formData.get("status") as "active" | "inactive" | "suspended",
              }
            : m
        )
      );
      toast.success("Manager ma'lumotlari yangilandi");
    } else {
      // Add new manager
      const newManager: Manager = {
        id: Math.max(...managers.map((m) => m.id)) + 1,
        firstName: formData.get("firstName") as string,
        lastName: formData.get("lastName") as string,
        phone: formData.get("phone") as string,
        email: formData.get("email") as string,
        tenantId: parseInt(formData.get("tenantId") as string),
        tenantName: "New Tenant",
        status: "active",
        createdAt: new Date().toISOString().split("T")[0],
      };
      setManagers([...managers, newManager]);
      toast.success("Manager muvaffaqiyatli qo'shildi");
    }
    
    setIsDialogOpen(false);
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "destructive" | "outline"> = {
      active: "default",
      inactive: "outline",
      suspended: "destructive",
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
        <h1 className="text-3xl mb-2">Managers Management</h1>
        <p className="text-slate-600">
          Manage all tenant managers across the platform
        </p>
      </div>

      <div className="grid gap-6 mb-6 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Total Managers</CardTitle>
            <Shield className="size-4 text-slate-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{managers.length}</div>
            <p className="text-xs text-slate-600 mt-1">Across all tenants</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Active Managers</CardTitle>
            <Shield className="size-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">
              {managers.filter((m) => m.status === "active").length}
            </div>
            <p className="text-xs text-slate-600 mt-1">Currently active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Inactive Managers</CardTitle>
            <Shield className="size-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">
              {managers.filter((m) => m.status === "inactive").length}
            </div>
            <p className="text-xs text-slate-600 mt-1">Not active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Suspended</CardTitle>
            <Shield className="size-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">
              {managers.filter((m) => m.status === "suspended").length}
            </div>
            <p className="text-xs text-slate-600 mt-1">Suspended accounts</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All Managers</CardTitle>
              <CardDescription>
                View and manage all tenant managers
              </CardDescription>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={handleAddManager}>
                  <UserPlus className="size-4 mr-2" />
                  Add Manager
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>
                    {editingManager ? "Edit Manager" : "Add New Manager"}
                  </DialogTitle>
                  <DialogDescription>
                    {editingManager
                      ? "Update manager information"
                      : "Create a new manager account for a tenant"}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSaveManager}>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          name="firstName"
                          defaultValue={editingManager?.firstName}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          name="lastName"
                          defaultValue={editingManager?.lastName}
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
                        defaultValue={editingManager?.phone}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="manager@tenant.uz"
                        defaultValue={editingManager?.email}
                        required
                      />
                    </div>
                    {!editingManager && (
                      <div className="space-y-2">
                        <Label htmlFor="tenantId">Tenant</Label>
                        <Select name="tenantId" required>
                          <SelectTrigger>
                            <SelectValue placeholder="Select tenant" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">EduSoft Language Center</SelectItem>
                            <SelectItem value="2">SmartLearn Academy</SelectItem>
                            <SelectItem value="3">LinguaLab Center</SelectItem>
                            <SelectItem value="4">Polyglot Institute</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                    {editingManager && (
                      <div className="space-y-2">
                        <Label htmlFor="status">Status</Label>
                        <Select
                          name="status"
                          defaultValue={editingManager?.status}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                            <SelectItem value="suspended">Suspended</SelectItem>
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
                      {editingManager ? "Update" : "Create"} Manager
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
                placeholder="Search managers by name, phone, email, or tenant..."
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
                  <TableHead>Manager</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Tenant</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Last Login</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredManagers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      No managers found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredManagers.map((manager) => (
                    <TableRow key={manager.id}>
                      <TableCell>
                        <div>
                          <p>
                            {manager.firstName} {manager.lastName}
                          </p>
                          <p className="text-xs text-slate-500">
                            ID: {manager.id}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm">
                            <Phone className="size-3 text-slate-400" />
                            {manager.phone}
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Mail className="size-3 text-slate-400" />
                            {manager.email}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Building2 className="size-4 text-slate-400" />
                          <div>
                            <p className="text-sm">{manager.tenantName}</p>
                            <p className="text-xs text-slate-500">
                              ID: {manager.tenantId}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(manager.status)}</TableCell>
                      <TableCell>
                        <p className="text-sm">{manager.createdAt}</p>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm">
                          {manager.lastLogin || "Never"}
                        </p>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleViewManager(manager)}
                          >
                            <Eye className="size-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditManager(manager)}
                          >
                            <Edit className="size-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteManager(manager.id)}
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

      {/* View Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Manager Details</DialogTitle>
            <DialogDescription>View complete manager information</DialogDescription>
          </DialogHeader>
          {viewingManager && (
            <div className="space-y-6 py-4">
              <div className="flex items-center gap-4">
                <div className="size-16 rounded-full bg-purple-100 flex items-center justify-center">
                  <Shield className="size-8 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-xl">{viewingManager.firstName} {viewingManager.lastName}</h3>
                  <p className="text-sm text-slate-600">Manager ID: {viewingManager.id}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Phone Number</p>
                  <div className="flex items-center gap-2">
                    <Phone className="size-4 text-slate-400" />
                    <p className="font-medium">{viewingManager.phone}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-slate-600 mb-1">Email Address</p>
                  <div className="flex items-center gap-2">
                    <Mail className="size-4 text-slate-400" />
                    <p className="font-medium">{viewingManager.email}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-slate-600 mb-1">Tenant</p>
                  <div className="flex items-center gap-2">
                    <Building2 className="size-4 text-slate-400" />
                    <div>
                      <p className="font-medium">{viewingManager.tenantName}</p>
                      <p className="text-xs text-slate-500">ID: {viewingManager.tenantId}</p>
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-slate-600 mb-1">Status</p>
                  {getStatusBadge(viewingManager.status)}
                </div>
                <div>
                  <p className="text-sm text-slate-600 mb-1">Created At</p>
                  <p>{viewingManager.createdAt}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 mb-1">Last Login</p>
                  <p>{viewingManager.lastLogin || "Never logged in"}</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewModalOpen(false)}>
              Close
            </Button>
            <Button
              onClick={() => {
                if (viewingManager) {
                  setIsViewModalOpen(false);
                  handleEditManager(viewingManager);
                }
              }}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Edit className="size-4 mr-2" />
              Edit Manager
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}