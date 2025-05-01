
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Pencil, Trash2, User } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { AnggotaKeluarga } from "@/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

interface KeluargaFormCardProps {
  keluarga: AnggotaKeluarga[];
  onKeluargaChange: (keluarga: AnggotaKeluarga[]) => void;
}

export function KeluargaFormCard({ keluarga, onKeluargaChange }: KeluargaFormCardProps) {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
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
  };

  const handleSelectChange = (value: string) => {
    setCurrentKeluarga(prev => ({
      ...prev,
      hubungan: value as "Anak" | "Suami" | "Istri" | "Orang Tua" | "Saudara Kandung" | "Kerabat"
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentKeluarga.nama || !currentKeluarga.hubungan || !currentKeluarga.alamat || !currentKeluarga.noHp) {
      toast({
        title: "Data tidak lengkap",
        description: "Harap lengkapi semua field yang diperlukan",
        variant: "destructive",
      });
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

  const handleDelete = (id: string) => {
    const updatedKeluarga = keluarga.filter(k => k.id !== id);
    onKeluargaChange(updatedKeluarga);
    
    toast({
      title: "Anggota keluarga berhasil dihapus",
    });
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
                <Label htmlFor="nama">Nama Lengkap</Label>
                <Input
                  id="nama"
                  name="nama"
                  value={currentKeluarga.nama}
                  onChange={handleInputChange}
                  placeholder="Masukkan nama lengkap"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="hubungan">Hubungan</Label>
                <Select
                  value={currentKeluarga.hubungan}
                  onValueChange={handleSelectChange}
                >
                  <SelectTrigger id="hubungan">
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
                <Label htmlFor="alamat">Alamat</Label>
                <Textarea
                  id="alamat"
                  name="alamat"
                  value={currentKeluarga.alamat}
                  onChange={handleInputChange}
                  placeholder="Masukkan alamat lengkap"
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="noHp">Nomor HP</Label>
                <Input
                  id="noHp"
                  name="noHp"
                  value={currentKeluarga.noHp}
                  onChange={handleInputChange}
                  placeholder="Contoh: 081234567890"
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
                  <TableCell>{k.hubungan}</TableCell>
                  <TableCell>{k.noHp}</TableCell>
                  <TableCell className="max-w-[200px] truncate">{k.alamat}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(k.id)}>
                        <Pencil size={16} /> Edit
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDelete(k.id)}>
                        <Trash2 size={16} /> Hapus
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
            <Dialog>
              <DialogTrigger asChild>
                <Button onClick={() => setIsDialogOpen(true)}>
                  <Plus size={16} className="mr-1" /> Tambah Anggota Keluarga
                </Button>
              </DialogTrigger>
            </Dialog>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
