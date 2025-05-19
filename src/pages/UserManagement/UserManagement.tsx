
import { useState, useEffect } from "react";
import { User } from "@/types/user";
import Layout from "@/components/layout/Layout";
import { UserTable } from "@/components/user-management/UserTable";
import { UserGrid } from "@/components/user-management/UserGrid";
import { UserForm } from "@/components/user-management/UserForm";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Search, UserPlus, Grid, Table as TableIcon } from "lucide-react";
import { 
  getAllUsers, 
  getUserById, 
  createUser, 
  updateUser, 
  deleteUser 
} from "@/services/user-management/supabaseUserService";

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentUser, setCurrentUser] = useState<User | undefined>(undefined);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Fetch users data from Supabase
  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const fetchedUsers = await getAllUsers();
      setUsers(fetchedUsers);
      setFilteredUsers(fetchedUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast({
        title: "Error",
        description: "Gagal memuat data pengguna",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchUsers();
  }, []);

  // Filter users based on search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredUsers(users);
      return;
    }

    const lowercasedQuery = searchQuery.toLowerCase();
    const filtered = users.filter((user) => 
      user.nama.toLowerCase().includes(lowercasedQuery) || 
      user.username.toLowerCase().includes(lowercasedQuery) ||
      user.email.toLowerCase().includes(lowercasedQuery) ||
      (user.roleName && user.roleName.toLowerCase().includes(lowercasedQuery))
    );

    setFilteredUsers(filtered);
  }, [searchQuery, users]);

  const handleAddUser = () => {
    setCurrentUser(undefined);
    setIsFormOpen(true);
  };

  const handleEditUser = (user: User) => {
    setCurrentUser(user);
    setIsFormOpen(true);
  };

  const handleDeletePrompt = (userId: string) => {
    setUserToDelete(userId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (userToDelete) {
      try {
        const success = await deleteUser(userToDelete);
        
        if (success) {
          toast({
            title: "Pengguna berhasil dihapus",
            description: "Pengguna telah dihapus dari sistem.",
          });
          
          // Refresh the list
          fetchUsers();
        } else {
          throw new Error("Failed to delete user");
        }
      } catch (error) {
        console.error("Error deleting user:", error);
        toast({
          title: "Gagal menghapus pengguna",
          description: "Terjadi kesalahan saat menghapus pengguna.",
          variant: "destructive",
        });
      } finally {
        setDeleteDialogOpen(false);
        setUserToDelete(null);
      }
    }
  };

  const handleSubmitUser = async (userData: any) => {
    try {
      if (currentUser) {
        // Editing existing user
        const { password, ...userDataWithoutPassword } = userData;
        const result = await updateUser(currentUser.id, userDataWithoutPassword);
        
        if (result) {
          toast({
            title: "Pengguna berhasil diperbarui",
            description: `Data pengguna ${userData.nama} telah diperbarui.`,
          });
        } else {
          throw new Error("Failed to update user");
        }
      } else {
        // Creating new user
        // For new users, we need the password to register them with Supabase Auth
        if (!userData.password) {
          toast({
            title: "Password diperlukan",
            description: "Password harus diisi untuk membuat pengguna baru.",
            variant: "destructive",
          });
          return;
        }
        
        const result = await createUser(userData);
        
        if (result) {
          toast({
            title: "Pengguna berhasil ditambahkan",
            description: `Pengguna baru ${userData.nama} telah ditambahkan.`,
          });
        } else {
          throw new Error("Failed to create user");
        }
      }
      setIsFormOpen(false);
      fetchUsers();
    } catch (error) {
      console.error("Error saving user:", error);
      toast({
        title: "Terjadi kesalahan",
        description: "Gagal menyimpan data pengguna.",
        variant: "destructive",
      });
    }
  };

  return (
    <Layout pageTitle="Manajemen Pengguna">
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Manajemen Pengguna</h1>
          <Button onClick={handleAddUser} className="flex items-center gap-1">
            <UserPlus size={16} />
            <span>Tambah Pengguna</span>
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow mb-6 p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input 
                placeholder="Cari berdasarkan nama, username, email..." 
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as 'table' | 'grid')}>
                <TabsList>
                  <TabsTrigger value="table" className="flex items-center gap-1">
                    <TableIcon size={16} />
                    <span>Tabel</span>
                  </TabsTrigger>
                  <TabsTrigger value="grid" className="flex items-center gap-1">
                    <Grid size={16} />
                    <span>Grid</span>
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p>Memuat data pengguna...</p>
          </div>
        ) : viewMode === 'table' ? (
          <UserTable users={filteredUsers} onEdit={handleEditUser} onDelete={handleDeletePrompt} />
        ) : (
          <UserGrid users={filteredUsers} onEdit={handleEditUser} onDelete={handleDeletePrompt} />
        )}

        {/* User Form Dialog */}
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{currentUser ? 'Edit Pengguna' : 'Tambah Pengguna'}</DialogTitle>
            </DialogHeader>
            <UserForm user={currentUser} onSubmit={handleSubmitUser} onCancel={() => setIsFormOpen(false)} />
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Hapus Pengguna</AlertDialogTitle>
              <AlertDialogDescription>
                Apakah Anda yakin ingin menghapus pengguna ini? Tindakan ini tidak dapat dibatalkan.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Batal</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive text-destructive-foreground">
                Hapus
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </Layout>
  );
}
