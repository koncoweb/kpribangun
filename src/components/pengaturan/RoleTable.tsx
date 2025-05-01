
import { useState } from 'react';
import { Role, Permission } from '@/types';
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash, Save, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";

interface RoleTableProps {
  roles: Role[];
  onEdit: (role: Role) => void;
  onDelete: (roleId: string) => void;
  permissions?: Permission[]; // Make permissions optional
}

export function RoleTable({ roles, onEdit, onDelete, permissions = [] }: RoleTableProps) {
  const [editingRoleId, setEditingRoleId] = useState<string | null>(null);
  const [editName, setEditName] = useState<string>("");
  const [editDescription, setEditDescription] = useState<string>("");
  const [editPermissions, setEditPermissions] = useState<string[]>([]);
  
  // Group permissions by module
  const permissionsByModule: Record<string, Permission[]> = {};
  permissions.forEach(permission => {
    if (!permissionsByModule[permission.module]) {
      permissionsByModule[permission.module] = [];
    }
    permissionsByModule[permission.module].push(permission);
  });

  // Convert module name to display name
  const getModuleDisplayName = (module: string) => {
    const moduleMap: Record<string, string> = {
      'anggota': 'Data Anggota',
      'transaksi': 'Transaksi',
      'laporan': 'Laporan',
      'pos': 'Point of Sales',
      'users': 'Manajemen Pengguna',
      'roles': 'Manajemen Peran',
      'pengaturan': 'Pengaturan',
    };
    return moduleMap[module] || module.charAt(0).toUpperCase() + module.slice(1);
  };

  // Get badge variant for action type
  const getActionBadgeVariant = (action: string) => {
    const variantMap: Record<string, "default" | "secondary" | "destructive" | "outline" | "success" | "warning" | "info"> = {
      'read': 'info',
      'create': 'success',
      'update': 'warning',
      'delete': 'destructive',
      'all': 'secondary',
    };
    return variantMap[action] || 'default';
  };

  const startEdit = (role: Role) => {
    setEditingRoleId(role.id);
    setEditName(role.name);
    setEditDescription(role.description);
    setEditPermissions(role.permissions);
  };

  const cancelEdit = () => {
    setEditingRoleId(null);
  };

  const saveEdit = (role: Role) => {
    if (editName.trim() !== "") {
      const updatedRole = { 
        ...role, 
        name: editName, 
        description: editDescription,
        permissions: editPermissions
      };
      onEdit(updatedRole);
      setEditingRoleId(null);
    }
  };

  const handlePermissionToggle = (permissionId: string, checked: boolean) => {
    if (checked) {
      setEditPermissions(prev => [...prev, permissionId]);
    } else {
      setEditPermissions(prev => prev.filter(id => id !== permissionId));
    }
  };

  return (
    <div className="w-full overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nama Peran</TableHead>
            <TableHead>Deskripsi</TableHead>
            <TableHead>Izin Akses</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {roles.map((role) => (
            <TableRow key={role.id} className={editingRoleId === role.id ? 'bg-muted/30' : ''}>
              <TableCell className="font-medium">
                {editingRoleId === role.id ? (
                  <Input 
                    value={editName} 
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full"
                  />
                ) : (
                  role.name
                )}
              </TableCell>
              <TableCell>
                {editingRoleId === role.id ? (
                  <Textarea 
                    value={editDescription} 
                    onChange={(e) => setEditDescription(e.target.value)}
                    className="w-full"
                    rows={2}
                  />
                ) : (
                  role.description
                )}
              </TableCell>
              <TableCell>
                {editingRoleId === role.id ? (
                  <ScrollArea className="h-80 pr-4 border rounded-md p-2">
                    {Object.entries(permissionsByModule).map(([module, modulePermissions]) => (
                      <div key={module} className="mb-4">
                        <h4 className="font-medium text-sm mb-1">{getModuleDisplayName(module)}</h4>
                        <Separator className="mb-2" />
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                          {modulePermissions.map((permission) => (
                            <div
                              key={permission.id}
                              className="flex flex-row items-start space-x-2 space-y-0"
                            >
                              <Checkbox
                                checked={editPermissions.includes(permission.id)}
                                onCheckedChange={(checked) => 
                                  handlePermissionToggle(permission.id, checked as boolean)
                                }
                              />
                              <div className="space-y-1 leading-none">
                                <div className="flex items-center gap-1 flex-wrap">
                                  <label className="text-sm cursor-pointer">
                                    {permission.name}
                                  </label>
                                  <Badge 
                                    variant={getActionBadgeVariant(permission.action)} 
                                    className="text-xs"
                                  >
                                    {permission.action}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </ScrollArea>
                ) : (
                  <div className="flex flex-wrap gap-1">
                    <Badge variant="info">{role.permissions.length} izin</Badge>
                  </div>
                )}
              </TableCell>
              <TableCell>
                {editingRoleId === role.id ? (
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => saveEdit(role)}
                      title="Simpan"
                    >
                      <Save size={16} />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={cancelEdit}
                      title="Batal"
                    >
                      <X size={16} />
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => startEdit(role)}
                    >
                      <Edit size={16} />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => onDelete(role.id)}
                    >
                      <Trash size={16} />
                    </Button>
                  </div>
                )}
              </TableCell>
            </TableRow>
          ))}
          {roles.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-6">
                Tidak ada data peran
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
