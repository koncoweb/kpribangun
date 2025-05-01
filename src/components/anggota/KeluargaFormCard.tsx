
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Pencil, Trash2, User, AlertTriangle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { AnggotaKeluarga } from "@/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

interface KeluargaFormCardProps {
  keluarga: AnggotaKeluarga[];
  onKeluargaChange: (keluarga: AnggotaKeluarga[]) => void;
}

export function KeluargaFormCard({ keluarga, onKeluargaChange }: KeluargaFormCardProps) {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [keluargaToDelete, setKeluargaToDelete] = useState<string | null>(null);
  const [errors, setErrors] = useState<{
    nama?: string;
    hubungan?: string;
    alamat?: string;
    noHp?: string;
  }>({});
  
  const [currentKeluarga, setCurrentKeluarga] = useState<AnggotaKeluarga>({
    id: "",
    nama: "",
    hubungan: "Anak",
    alamat: "",
    noHp: "",
  });
  const [isEditing, setIsEditing] = useState(false);

  const resetForm = () => {
    setCurrentKeluarga({
      id: "",
      nama: "",
      hubungan: "Anak",
      alamat: "",
      noHp: "",
    });
    setIsEditing(false);
    setErrors({});
  };

  const handleDialogOpen = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      resetForm();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCurrentKeluarga(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field if user is typing
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSelectChange = (value: string) => {
    setCurrentKeluarga(prev => ({
      ...prev,
      hubungan: value as "Anak" | "Suami" | "Istri" | "Orang Tua" | "Saudara Kandung" | "Kerabat"
    }));
    
    // Clear error for hubungan if user selects a value
    if (errors.hubungan) {
      setErrors(prev => ({ ...prev, hubungan: undefined }));
    }
  };
  
  const validateForm = (): boolean => {
    const newErrors: {
      nama?: string;
      hubungan?: string;
      alamat?: string;
      noHp?: string;
    } = {};
    
    if (!currentKeluarga.nama.trim()) {
      newErrors.nama = "Nama tidak boleh kosong";
    }
    
    if (!currentKeluarga.hubungan) {
      newErrors.hubungan = "Hubungan harus dipilih";
    }
    
    if (!currentKeluarga.alamat.trim()) {
      newErrors.alamat = "Alamat tidak boleh kosong";
    }
    
    if (!currentKeluarga.noHp.trim()) {
      newErrors.noHp = "Nomor HP tidak boleh kosong";
    } else if (!/^[0-9]{10,13}$/.test(currentKeluarga.noHp.replace(/\s/g, ''))) {
      newErrors.noHp = "Nomor HP harus berisi 10-13 digit angka";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    if (isEditing) {
      // Update existing
      const updatedKeluarga = keluarga.map(k => 
        k.id === currentKeluarga.id ? currentKeluarga : k
      );
      onKeluargaChange(updatedKeluarga);
      
      toast({
        title: "Data keluarga berhasil diperbarui",
      });
    } else {
      // Add new
      const newKeluarga = {
        ...currentKeluarga,
        id: `keluarga-${Date.now()}`
      };
      
      onKeluargaChange([...keluarga, newKeluarga]);
      
      toast({
        title: "Anggota keluarga berhasil ditambahkan",
      });
    }
    
    setIsDialogOpen(false);
    resetForm();
  };

  const handleEdit = (id: string) => {
    const keluargaToEdit = keluarga.find(k => k.id === id);
    if (keluargaToEdit) {
      setCurrentKeluarga(keluargaToEdit);
      setIsEditing(true);
      setIsDialogOpen(true);
    }
  };

  const confirmDelete = (id: string) => {
    setKeluargaToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirmed = () => {
    if (keluargaToDelete) {
      const updatedKeluarga = keluarga.filter(k => k.id !== keluargaToDelete);
      onKeluargaChange(updatedKeluarga);
      
      toast({
        title: "Anggota keluarga berhasil dihapus",
      });
      
      setKeluargaToDelete(null);
      setIsDeleteDialogOpen(false);
    }
  };

  const handleCancelDelete = () => {
    setKeluargaToDelete(null);
    setIsDeleteDialogOpen(false);
  };

  const getBadgeVariantByRelationship = (hubungan: string): "default" | "secondary" | "outline" | "destructive" | "primary" => {
    switch (hubungan) {
      case "Suami":
      case "Istri":
        return "primary";
      case "Anak":
        return "default";
      case "Orang Tua":
        return "secondary";
      case "Saudara Kandung":
        return "outline";
      default:
        return "outline";
    }
  };

  return (
    <Card className="col-span-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Data Anggota Keluarga</CardTitle>
        <Dialog open={isDialogOpen} onOpenChange={handleDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus size={16} className="mr-1" /> Tambah Anggota Keluarga
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{isEditing ? "Edit Anggota Keluarga" : "Tambah Anggota Keluarga"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-2">
              <div className="space-y-2">
                <Label htmlFor="nama" className={errors.nama ? "text-destructive" : ""}>
                  Nama Lengkap {errors.nama && <span className="text-xs ml-1">({errors.nama})</span>}
                </Label>
                <Input
                  id="nama"
                  name="nama"
                  value={currentKeluarga.nama}
                  onChange={handleInputChange}
                  placeholder="Masukkan nama lengkap"
                  className={errors.nama ? "border-destructive" : ""}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="hubungan" className={errors.hubungan ? "text-destructive" : ""}>
                  Hubungan {errors.hubungan && <span className="text-xs ml-1">({errors.hubungan})</span>}
                </Label>
                <Select
                  value={currentKeluarga.hubungan}
                  onValueChange={handleSelectChange}
                >
                  <SelectTrigger id="hubungan" className={errors.hubungan ? "border-destructive" : ""}>
                    <SelectValue placeholder="Pilih hubungan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Anak">Anak</SelectItem>
                    <SelectItem value="Suami">Suami</SelectItem>
                    <SelectItem value="Istri">Istri</SelectItem>
                    <SelectItem value="Orang Tua">Orang Tua</SelectItem>
                    <SelectItem value="Saudara Kandung">Saudara Kandung</SelectItem>
                    <SelectItem value="Kerabat">Kerabat</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="alamat" className={errors.alamat ? "text-destructive" : ""}>
                  Alamat {errors.alamat && <span className="text-xs ml-1">({errors.alamat})</span>}
                </Label>
                <Textarea
                  id="alamat"
                  name="alamat"
                  value={currentKeluarga.alamat}
                  onChange={handleInputChange}
                  placeholder="Masukkan alamat lengkap"
                  rows={3}
                  className={errors.alamat ? "border-destructive" : ""}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="noHp" className={errors.noHp ? "text-destructive" : ""}>
                  Nomor HP {errors.noHp && <span className="text-xs ml-1">({errors.noHp})</span>}
                </Label>
                <Input
                  id="noHp"
                  name="noHp"
                  value={currentKeluarga.noHp}
                  onChange={handleInputChange}
                  placeholder="Contoh: 081234567890"
                  className={errors.noHp ? "border-destructive" : ""}
                />
              </div>
              
              <DialogFooter className="mt-4">
                <DialogClose asChild>
                  <Button type="button" variant="outline">Batal</Button>
                </DialogClose>
                <Button type="submit">{isEditing ? "Perbarui" : "Simpan"}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent className="p-6">
        {keluarga.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama</TableHead>
                <TableHead>Hubungan</TableHead>
                <TableHead>No. HP</TableHead>
                <TableHead>Alamat</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {keluarga.map((k) => (
                <TableRow key={k.id}>
                  <TableCell className="font-medium">{k.nama}</TableCell>
                  <TableCell>
                    <Badge variant={getBadgeVariantByRelationship(k.hubungan)}>
                      {k.hubungan}
                    </Badge>
                  </TableCell>
                  <TableCell>{k.noHp}</TableCell>
                  <TableCell className="max-w-[200px] truncate">{k.alamat}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(k.id)}>
                        <Pencil size={16} className="mr-1" /> Edit
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => confirmDelete(k.id)}>
                        <Trash2 size={16} className="mr-1" /> Hapus
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
              <User className="h-6 w-6 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium mb-1">Belum Ada Data Keluarga</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Klik tombol "Tambah Anggota Keluarga" untuk menambahkan data
            </p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus size={16} className="mr-1" /> Tambah Anggota Keluarga
            </Button>
          </div>
        )}

        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                Konfirmasi Hapus
              </AlertDialogTitle>
              <AlertDialogDescription>
                Data anggota keluarga yang dihapus tidak dapat dipulihkan.
                Apakah Anda yakin ingin menghapus data ini?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={handleCancelDelete}>Batal</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteConfirmed} className="bg-destructive hover:bg-destructive/90">
                Hapus
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
}
