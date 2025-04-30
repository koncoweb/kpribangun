
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { User, Role } from "@/types";
import { 
  getUsers, 
  getRoles, 
  getPermissions,
  createUser, 
  updateUser, 
  deleteUser,
  createRole,
  updateRole,
  deleteRole,
} from "@/services/userManagementService";
import { Button } from "@/components/ui/button";
import { UserTable } from "./UserTable";
import { UserForm } from "./UserForm";
import { RoleTable } from "./RoleTable";
import { RoleForm } from "./RoleForm";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { UserPlus, ShieldPlus } from "lucide-react";

interface UserManagementSettingsProps {
  settings: any;
  setSettings: (settings: any) => void;
}

export function UserManagementSettings({ settings, setSettings }: UserManagementSettingsProps) {
  // State for users
  const [users, setUsers] = useState<User[]>(getUsers());
  const [roles, setRoles] = useState<Role[]>(getRoles());
  const [currentUser, setCurrentUser] = useState<User | undefined>(undefined);
  const [currentRole, setCurrentRole] = useState<Role | undefined>(undefined);
  
  // Dialog states
  const [userDialogOpen, setUserDialogOpen] = useState(false);
  const [roleDialogOpen, setRoleDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ id: string; type: 'user' | 'role' } | null>(null);
  
  // Handlers for User Management
  const handleAddUser = () => {
    setCurrentUser(undefined);
    setUserDialogOpen(true);
  };

  const handleEditUser = (user: User) => {
    setCurrentUser(user);
    setUserDialogOpen(true);
  };

  const handleDeleteUser = (userId: string) => {
    setItemToDelete({ id: userId, type: 'user' });
    setDeleteDialogOpen(true);
  };

  const handleToggleUserStatus = (userId: string, isActive: boolean) => {
    const result = updateUser(userId, { aktif: isActive });
    if (result) {
      setUsers(getUsers());
      toast({
        title: `Pengguna berhasil ${isActive ? 'diaktifkan' : 'dinonaktifkan'}`,
        description: `Status pengguna telah diperbarui.`,
      });
    } else {
      toast({
        title: "Gagal mengubah status pengguna",
        description: "Terjadi kesalahan saat mengubah status pengguna.",
        variant: "destructive",
      });
    }
  };

  const handleSubmitUser = (data: Omit<User, "id" | "createdAt" | "updatedAt" | "lastLogin">) => {
    if (currentUser) {
      // Update existing user
      const result = updateUser(currentUser.id, data);
      if (result) {
        setUsers(getUsers());
        setUserDialogOpen(false);
        toast({
          title: "Pengguna berhasil diperbarui",
          description: `Data pengguna ${data.nama} telah diperbarui.`,
        });
      }
    } else {
      // Create new user
      try {
        createUser(data);
        setUsers(getUsers());
        setUserDialogOpen(false);
        toast({
          title: "Pengguna berhasil ditambahkan",
          description: `Pengguna baru ${data.nama} telah ditambahkan.`,
        });
      } catch (error) {
        toast({
          title: "Gagal menambahkan pengguna",
          description: "Terjadi kesalahan saat menambahkan pengguna baru.",
          variant: "destructive",
        });
      }
    }
  };

  // Handlers for Role Management
  const handleAddRole = () => {
    setCurrentRole(undefined);
    setRoleDialogOpen(true);
  };

  const handleEditRole = (role: Role) => {
    setCurrentRole(role);
    setRoleDialogOpen(true);
  };

  const handleDeleteRole = (roleId: string) => {
    setItemToDelete({ id: roleId, type: 'role' });
    setDeleteDialogOpen(true);
  };

  const handleSubmitRole = (data: Omit<Role, "id" | "createdAt" | "updatedAt">) => {
    if (currentRole) {
      // Update existing role
      const result = updateRole(currentRole.id, data);
      if (result) {
        setRoles(getRoles());
        setRoleDialogOpen(false);
        toast({
          title: "Peran berhasil diperbarui",
          description: `Peran ${data.name} telah diperbarui.`,
        });
      }
    } else {
      // Create new role
      try {
        createRole(data);
        setRoles(getRoles());
        setRoleDialogOpen(false);
        toast({
          title: "Peran berhasil ditambahkan",
          description: `Peran baru ${data.name} telah ditambahkan.`,
        });
      } catch (error) {
        toast({
          title: "Gagal menambahkan peran",
          description: "Terjadi kesalahan saat menambahkan peran baru.",
          variant: "destructive",
        });
      }
    }
  };

  // Handle Delete Confirmation
  const handleConfirmDelete = () => {
    if (!itemToDelete) return;
    
    if (itemToDelete.type === 'user') {
      const success = deleteUser(itemToDelete.id);
      if (success) {
        setUsers(getUsers());
        toast({
          title: "Pengguna berhasil dihapus",
          description: "Pengguna telah dihapus dari sistem.",
        });
      } else {
        toast({
          title: "Gagal menghapus pengguna",
          description: "Terjadi kesalahan saat menghapus pengguna.",
          variant: "destructive",
        });
      }
    } else {
      const success = deleteRole(itemToDelete.id);
      if (success) {
        setRoles(getRoles());
        toast({
          title: "Peran berhasil dihapus",
          description: "Peran telah dihapus dari sistem.",
        });
      } else {
        toast({
          title: "Gagal menghapus peran",
          description: "Peran ini sedang digunakan oleh beberapa pengguna dan tidak dapat dihapus.",
          variant: "destructive",
        });
      }
    }
    
    setDeleteDialogOpen(false);
    setItemToDelete(null);
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="users" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="users">Manajemen Pengguna</TabsTrigger>
          <TabsTrigger value="roles">Manajemen Peran</TabsTrigger>
        </TabsList>
        
        <TabsContent value="users" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Daftar Pengguna</h2>
            <Dialog open={userDialogOpen} onOpenChange={setUserDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={handleAddUser}>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Tambah Pengguna
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>{currentUser ? "Edit Pengguna" : "Tambah Pengguna Baru"}</DialogTitle>
                  <DialogDescription>
                    {currentUser 
                      ? "Perbarui detail pengguna yang ada" 
                      : "Isi formulir berikut untuk menambahkan pengguna baru"}
                  </DialogDescription>
                </DialogHeader>
                <UserForm 
                  user={currentUser} 
                  roles={roles} 
                  onSubmit={handleSubmitUser} 
                  onCancel={() => setUserDialogOpen(false)} 
                />
              </DialogContent>
            </Dialog>
          </div>
          
          <Card>
            <UserTable 
              users={users} 
              onEdit={handleEditUser} 
              onDelete={handleDeleteUser}
              onToggleStatus={handleToggleUserStatus}
            />
          </Card>
        </TabsContent>
        
        <TabsContent value="roles" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Daftar Peran</h2>
            <Dialog open={roleDialogOpen} onOpenChange={setRoleDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={handleAddRole}>
                  <ShieldPlus className="w-4 h-4 mr-2" />
                  Tambah Peran
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh]">
                <DialogHeader>
                  <DialogTitle>{currentRole ? "Edit Peran" : "Tambah Peran Baru"}</DialogTitle>
                  <DialogDescription>
                    {currentRole 
                      ? "Perbarui detail dan izin peran yang ada" 
                      : "Buat peran baru dan atur izin akses"}
                  </DialogDescription>
                </DialogHeader>
                <RoleForm 
                  role={currentRole} 
                  permissions={getPermissions()} 
                  onSubmit={handleSubmitRole} 
                  onCancel={() => setRoleDialogOpen(false)} 
                />
              </DialogContent>
            </Dialog>
          </div>
          
          <Card>
            <RoleTable 
              roles={roles} 
              onEdit={handleEditRole} 
              onDelete={handleDeleteRole}
            />
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {itemToDelete?.type === 'user' 
                ? 'Hapus Pengguna' 
                : 'Hapus Peran'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {itemToDelete?.type === 'user' 
                ? 'Apakah Anda yakin ingin menghapus pengguna ini? Tindakan ini tidak dapat dibatalkan.'
                : 'Apakah Anda yakin ingin menghapus peran ini? Peran yang sedang digunakan oleh pengguna tidak dapat dihapus.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete}>
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
