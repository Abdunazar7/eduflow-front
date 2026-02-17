import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Building2, Plus, Search, Users, Edit, Trash2, Eye } from "lucide-react";
import { Input } from "../ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "../ui/dialog";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import { toast } from "sonner";
import { tenants, tenantSubscriptions, subscriptionPlans, getUsersByTenantId, Tenant } from "../../data/mockData";

export default function TenantsPage() {
  const [tenantsList, setTenantsList] = useState<Tenant[]>(tenants);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
  const [formData, setFormData] = useState<Partial<Tenant>>({
    isActive: true
  });

  const handleCreate = () => {
    if (!formData.name || !formData.subdomain || !formData.contactPhone) {
      toast.error("Iltimos, barcha majburiy maydonlarni to'ldiring");
      return;
    }

    const newTenant: Tenant = {
      id: Math.max(...tenantsList.map(t => t.id)) + 1,
      name: formData.name,
      subdomain: formData.subdomain,
      contactPhone: formData.contactPhone,
      logoUrl: formData.logoUrl,
      isActive: formData.isActive ?? true,
      createdAt: new Date()
    };

    setTenantsList([...tenantsList, newTenant]);
    setIsCreateModalOpen(false);
    setFormData({ isActive: true });
    toast.success("Tenant muvaffaqiyatli qo'shildi");
  };

  const handleEdit = () => {
    if (!selectedTenant || !formData.name || !formData.subdomain || !formData.contactPhone) {
      toast.error("Iltimos, barcha majburiy maydonlarni to'ldiring");
      return;
    }

    setTenantsList(tenantsList.map(t => 
      t.id === selectedTenant.id 
        ? {
            ...t,
            name: formData.name!,
            subdomain: formData.subdomain!,
            contactPhone: formData.contactPhone!,
            logoUrl: formData.logoUrl,
            isActive: formData.isActive ?? t.isActive
          }
        : t
    ));
    setIsEditModalOpen(false);
    setSelectedTenant(null);
    setFormData({ isActive: true });
    toast.success("Tenant ma'lumotlari yangilandi");
  };

  const handleDelete = (tenant: Tenant) => {
    if (window.confirm(`${tenant.name} tenantini o'chirmoqchimisiz?`)) {
      setTenantsList(tenantsList.filter(t => t.id !== tenant.id));
      toast.success("Tenant o'chirildi");
    }
  };

  const openCreateModal = () => {
    setFormData({ isActive: true });
    setIsCreateModalOpen(true);
  };

  const openEditModal = (tenant: Tenant) => {
    setSelectedTenant(tenant);
    setFormData({
      name: tenant.name,
      subdomain: tenant.subdomain,
      contactPhone: tenant.contactPhone,
      logoUrl: tenant.logoUrl,
      isActive: tenant.isActive
    });
    setIsEditModalOpen(true);
  };

  const openViewModal = (tenant: Tenant) => {
    setSelectedTenant(tenant);
    setIsViewModalOpen(true);
  };

  const filteredTenants = tenantsList.filter(tenant =>
    tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tenant.subdomain.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl mb-2">Tenants Management</h2>
          <p className="text-slate-600">Manage all educational centers on the platform</p>
        </div>
        <Button onClick={openCreateModal} className="bg-purple-600 hover:bg-purple-700">
          <Plus className="size-4 mr-2" />
          Add New Tenant
        </Button>
      </div>

      {/* Search */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
            <Input
              placeholder="Search tenants by name, subdomain..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Tenants Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Tenants ({filteredTenants.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tenant</TableHead>
                <TableHead>Subdomain</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Users</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTenants.map((tenant) => {
                const subscription = tenantSubscriptions.find((s) => s.tenantId === tenant.id);
                const plan = subscription
                  ? subscriptionPlans.find((p) => p.id === subscription.planId)
                  : null;
                const userCount = getUsersByTenantId(tenant.id).length;

                return (
                  <TableRow key={tenant.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="size-10 rounded-lg bg-purple-100 flex items-center justify-center">
                          <Building2 className="size-5 text-purple-600" />
                        </div>
                        <div>
                          <p>{tenant.name}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <code className="text-sm bg-slate-100 px-2 py-1 rounded">
                        {tenant.subdomain}
                      </code>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm">{tenant.contactPhone || "N/A"}</p>
                    </TableCell>
                    <TableCell>
                      {plan ? (
                        <div>
                          <p className="text-sm">{plan.name}</p>
                          <p className="text-xs text-slate-500">
                            ${plan.monthlyPrice}/mo
                          </p>
                        </div>
                      ) : (
                        <span className="text-slate-400">No plan</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Users className="size-4 text-slate-400" />
                        <span className="text-sm">{userCount}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {tenant.isActive ? (
                        <Badge className="bg-green-100 text-green-800">Active</Badge>
                      ) : (
                        <Badge className="bg-red-100 text-red-800">Inactive</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <p className="text-sm">
                        {new Date(tenant.createdAt).toLocaleDateString()}
                      </p>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openViewModal(tenant)}
                        >
                          <Eye className="size-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditModal(tenant)}
                        >
                          <Edit className="size-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(tenant)}
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
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Tenant</DialogTitle>
            <DialogDescription>Create a new educational center on the platform</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="col-span-2 space-y-2">
              <Label htmlFor="name">Organization Name *</Label>
              <Input
                id="name"
                value={formData.name || ""}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="English Excellence Academy"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="subdomain">Subdomain *</Label>
              <Input
                id="subdomain"
                value={formData.subdomain || ""}
                onChange={(e) => setFormData({ ...formData, subdomain: e.target.value })}
                placeholder="excellence"
              />
              <p className="text-xs text-slate-500">Will be: {formData.subdomain || "subdomain"}.yourdomain.com</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Contact Phone *</Label>
              <Input
                id="phone"
                value={formData.contactPhone || ""}
                onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                placeholder="+998 90 123 45 67"
              />
            </div>

            <div className="col-span-2 space-y-2">
              <Label htmlFor="logo">Logo URL</Label>
              <Input
                id="logo"
                value={formData.logoUrl || ""}
                onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                placeholder="https://example.com/logo.png"
              />
            </div>

            <div className="col-span-2 flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div>
                <Label htmlFor="active">Active Status</Label>
                <p className="text-sm text-slate-600">Enable or disable tenant access</p>
              </div>
              <Switch
                id="active"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreate} className="bg-purple-600 hover:bg-purple-700">
              Create Tenant
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Tenant</DialogTitle>
            <DialogDescription>Update tenant information</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="col-span-2 space-y-2">
              <Label htmlFor="edit-name">Organization Name *</Label>
              <Input
                id="edit-name"
                value={formData.name || ""}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-subdomain">Subdomain *</Label>
              <Input
                id="edit-subdomain"
                value={formData.subdomain || ""}
                onChange={(e) => setFormData({ ...formData, subdomain: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-phone">Contact Phone *</Label>
              <Input
                id="edit-phone"
                value={formData.contactPhone || ""}
                onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
              />
            </div>

            <div className="col-span-2 space-y-2">
              <Label htmlFor="edit-logo">Logo URL</Label>
              <Input
                id="edit-logo"
                value={formData.logoUrl || ""}
                onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
              />
            </div>

            <div className="col-span-2 flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div>
                <Label htmlFor="edit-active">Active Status</Label>
                <p className="text-sm text-slate-600">Enable or disable tenant access</p>
              </div>
              <Switch
                id="edit-active"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEdit} className="bg-purple-600 hover:bg-purple-700">
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Tenant Details</DialogTitle>
            <DialogDescription>View complete tenant information</DialogDescription>
          </DialogHeader>
          {selectedTenant && (
            <div className="space-y-6 py-4">
              <div className="flex items-center gap-4">
                <div className="size-16 rounded-lg bg-purple-100 flex items-center justify-center">
                  <Building2 className="size-8 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-xl">{selectedTenant.name}</h3>
                  <code className="text-sm bg-slate-100 px-2 py-1 rounded">
                    {selectedTenant.subdomain}.yourdomain.com
                  </code>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Contact Phone</p>
                  <p className="font-medium">{selectedTenant.contactPhone}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 mb-1">Status</p>
                  {selectedTenant.isActive ? (
                    <Badge className="bg-green-100 text-green-800">Active</Badge>
                  ) : (
                    <Badge className="bg-red-100 text-red-800">Inactive</Badge>
                  )}
                </div>
                <div>
                  <p className="text-sm text-slate-600 mb-1">Created At</p>
                  <p>{new Date(selectedTenant.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 mb-1">Total Users</p>
                  <p className="font-semibold">{getUsersByTenantId(selectedTenant.id).length}</p>
                </div>
                {(() => {
                  const subscription = tenantSubscriptions.find((s) => s.tenantId === selectedTenant.id);
                  const plan = subscription ? subscriptionPlans.find((p) => p.id === subscription.planId) : null;
                  return plan ? (
                    <>
                      <div>
                        <p className="text-sm text-slate-600 mb-1">Subscription Plan</p>
                        <p className="font-medium">{plan.name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-600 mb-1">Monthly Price</p>
                        <p className="font-semibold text-green-600">${plan.monthlyPrice}</p>
                      </div>
                    </>
                  ) : null;
                })()}
              </div>

              {selectedTenant.logoUrl && (
                <div>
                  <p className="text-sm text-slate-600 mb-2">Logo</p>
                  <img 
                    src={selectedTenant.logoUrl} 
                    alt="Logo" 
                    className="h-16 object-contain bg-slate-100 p-2 rounded"
                  />
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
                if (selectedTenant) {
                  setIsViewModalOpen(false);
                  openEditModal(selectedTenant);
                }
              }}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Edit className="size-4 mr-2" />
              Edit Tenant
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
