
import { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableHead, 
  TableRow, 
  TableCell 
} from "@/components/ui/table";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import {
  Card,
  CardContent
} from "@/components/ui/card";
import { toast } from "@/components/ui/sonner";
import { 
  Plus, 
  FileEdit, 
  Trash2, 
  Search
} from "lucide-react";
import { Pemasok } from "@/types";
import { 
  getAllPemasok, 
  createPemasok, 
  updatePemasok, 
  deletePemasok 
} from "@/services/pembelianService";

export default function PemasokPage() {
  const [pemasokList, setPemasokList] = useState<Pemasok[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentPemasok, setCurrentPemasok] = useState<Pemasok | null>(null);
  const [selectedPemasokId, setSelectedPemasokId] = useState<string | null>(null);
  
  // Form state
  const [formData, setFormData] = useState<Partial<Pemasok>>({
    nama: "",
    alamat: "",
    telepon: "",
    email: "",
    kontak: ""
  });
  
  useEffect(() => {
    loadPemasok();
  }, []);
  
  const loadPemasok = () => {
    setPemasokList(getAllPemasok());
  };
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  const filteredPemasok = pemasokList.filter(item => 
    item.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.kontak && item.kontak.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (item.telepon && item.telepon.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
  const openNewForm = () => {
    setFormData({
      nama: "",
      alamat: "",
      telepon: "",
      email: "",
      kontak: ""
    });
    setCurrentPemasok(null);
    setIsFormOpen(true);
  };
  
  const openEditForm = (id: string) => {
    const pemasok = pemasokList.find(item => item.id === id);
    if (pemasok) {
      setFormData({
        nama: pemasok.nama,
        alamat: pemasok.alamat || "",
        telepon: pemasok.telepon || "",
        email: pemasok.email || "",
        kontak: pemasok.kontak || ""
      });
      setCurrentPemasok(pemasok);
      setIsFormOpen(true);
    }
  };
  
  const openDeleteDialog = (id: string) => {
    setSelectedPemasokId(id);
    setIsDeleteDialogOpen(true);
  };
  
  const handleDelete = () => {
    if (selectedPemasokId) {
      const result = deletePemasok(selectedPemasokId);
      if (result) {
        toast.success("Data pemasok berhasil dihapus");
        loadPemasok();
      } else {
        toast.error("Gagal menghapus data pemasok");
      }
      setIsDeleteDialogOpen(false);
    }
  };
  
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleSave = () => {
    if (!formData.nama) {
      toast.error("Nama pemasok harus diisi");
      return;
    }
    
    if (currentPemasok) {
      // Update existing supplier
      const updatedPemasok = updatePemasok(currentPemasok.id, formData);
      if (updatedPemasok) {
        toast.success("Data pemasok berhasil diperbarui");
        loadPemasok();
        setIsFormOpen(false);
      } else {
        toast.error("Gagal memperbarui data pemasok");
      }
    } else {
      // Create new supplier
      createPemasok(formData as Omit<Pemasok, "id" | "createdAt">);
      toast.success("Data pemasok baru berhasil ditambahkan");
      loadPemasok();
      setIsFormOpen(false);
    }
  };
  
  return (
    <Layout pageTitle="Manajemen Pemasok">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manajemen Pemasok</h1>
        <Button onClick={openNewForm} className="flex items-center gap-1">
          <Plus className="h-4 w-4" /> Tambah Pemasok
        </Button>
      </div>
      
      <div className="mb-6">
        <Input
          placeholder="Cari pemasok berdasarkan nama, kontak, atau telepon..."
          value={searchQuery}
          onChange={handleSearch}
          className="max-w-md"
        />
      </div>
      
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama Pemasok</TableHead>
                <TableHead>Kontak Person</TableHead>
                <TableHead>Telepon</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Alamat</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPemasok.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6 text-gray-500">
                    Tidak ada data pemasok
                  </TableCell>
                </TableRow>
              ) : (
                filteredPemasok.map((pemasok) => (
                  <TableRow key={pemasok.id}>
                    <TableCell className="font-medium">{pemasok.nama}</TableCell>
                    <TableCell>{pemasok.kontak || "-"}</TableCell>
                    <TableCell>{pemasok.telepon || "-"}</TableCell>
                    <TableCell>{pemasok.email || "-"}</TableCell>
                    <TableCell className="max-w-xs truncate">{pemasok.alamat || "-"}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => openEditForm(pemasok.id)}
                      >
                        <FileEdit className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="text-red-500 hover:text-red-700" 
                        onClick={() => openDeleteDialog(pemasok.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {/* Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {currentPemasok ? "Edit Pemasok" : "Tambah Pemasok Baru"}
            </DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="nama" className="text-sm font-medium">
                Nama Pemasok <span className="text-red-500">*</span>
              </label>
              <Input
                id="nama"
                name="nama"
                placeholder="Nama pemasok"
                value={formData.nama}
                onChange={handleFormChange}
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="kontak" className="text-sm font-medium">
                Kontak Person
              </label>
              <Input
                id="kontak"
                name="kontak"
                placeholder="Nama kontak"
                value={formData.kontak || ""}
                onChange={handleFormChange}
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="telepon" className="text-sm font-medium">
                Nomor Telepon
              </label>
              <Input
                id="telepon"
                name="telepon"
                placeholder="Nomor telepon"
                value={formData.telepon || ""}
                onChange={handleFormChange}
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Email pemasok"
                value={formData.email || ""}
                onChange={handleFormChange}
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="alamat" className="text-sm font-medium">
                Alamat
              </label>
              <Input
                id="alamat"
                name="alamat"
                placeholder="Alamat pemasok"
                value={formData.alamat || ""}
                onChange={handleFormChange}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsFormOpen(false)}>
              Batal
            </Button>
            <Button onClick={handleSave}>
              Simpan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Konfirmasi Hapus</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus data pemasok ini? 
              Tindakan ini tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Batal
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Hapus
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
