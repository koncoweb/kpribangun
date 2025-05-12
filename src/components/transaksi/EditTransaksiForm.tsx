
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Transaksi, Anggota } from "@/types";
import { updateTransaksi } from "@/services/transaksi/updateTransaksi";
import { getAllAnggota } from "@/services/anggotaService";
import { getSimpananCategories, getPinjamanCategories } from "@/services/transaksi/categories";

interface EditTransaksiFormProps {
  transaksi: Transaksi;
  onSuccess: () => void;
  onCancel: () => void;
}

export function EditTransaksiForm({ 
  transaksi, 
  onSuccess, 
  onCancel 
}: EditTransaksiFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [anggotaList, setAnggotaList] = useState<Anggota[]>([]);
  
  const [formData, setFormData] = useState({
    tanggal: transaksi.tanggal,
    anggotaId: transaksi.anggotaId,
    jumlah: transaksi.jumlah,
    kategori: transaksi.kategori || "",
    keterangan: transaksi.keterangan || "",
    status: transaksi.status
  });
  
  // Load anggota data
  useEffect(() => {
    const loadAnggota = async () => {
      const data = getAllAnggota();
      setAnggotaList(data);
    };
    
    loadAnggota();
  }, []);
  
  // Get categories based on transaction type
  const getCategories = () => {
    switch (transaksi.jenis) {
      case "Simpan":
        return getSimpananCategories();
      case "Pinjam":
        return getPinjamanCategories();
      default:
        return [];
    }
  };
  
  const categories = getCategories();
  
  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: id === "jumlah" ? Number(value) : value
    }));
  };
  
  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Form submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      const updated = updateTransaksi(transaksi.id, {
        tanggal: formData.tanggal,
        anggotaId: formData.anggotaId,
        jumlah: formData.jumlah,
        kategori: formData.kategori,
        keterangan: formData.keterangan,
        status: formData.status as "Sukses" | "Pending" | "Gagal"
      });
      
      if (updated) {
        toast({
          title: "Transaksi berhasil diperbarui",
          description: `Transaksi dengan ID ${transaksi.id} telah diperbarui`,
        });
        onSuccess();
      } else {
        throw new Error("Gagal memperbarui transaksi");
      }
    } catch (error) {
      console.error("Error updating transaction:", error);
      toast({
        title: "Terjadi kesalahan",
        description: "Gagal memperbarui transaksi. Silakan coba lagi.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Form validation
  const validateForm = () => {
    if (!formData.tanggal) {
      toast({
        title: "Tanggal wajib diisi",
        variant: "destructive",
      });
      return false;
    }
    
    if (!formData.anggotaId) {
      toast({
        title: "Anggota wajib dipilih",
        variant: "destructive",
      });
      return false;
    }
    
    if (!formData.jumlah || formData.jumlah <= 0) {
      toast({
        title: "Jumlah harus lebih dari 0",
        variant: "destructive",
      });
      return false;
    }
    
    return true;
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="tanggal" className="required">Tanggal</Label>
          <Input 
            id="tanggal" 
            type="date"
            value={formData.tanggal}
            onChange={handleInputChange}
            required 
          />
        </div>
        
        <div>
          <Label htmlFor="status">Status</Label>
          <Select 
            value={formData.status}
            onValueChange={(value) => handleSelectChange("status", value)}
          >
            <SelectTrigger id="status">
              <SelectValue placeholder="Pilih status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Sukses">Sukses</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Gagal">Gagal</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div>
        <Label htmlFor="anggotaId" className="required">Anggota</Label>
        <Select 
          value={formData.anggotaId}
          onValueChange={(value) => handleSelectChange("anggotaId", value)}
          disabled={transaksi.jenis === "Angsuran"} // Disable for Angsuran type
        >
          <SelectTrigger id="anggotaId">
            <SelectValue placeholder="Pilih anggota" />
          </SelectTrigger>
          <SelectContent>
            {anggotaList.map((anggota) => (
              <SelectItem key={anggota.id} value={anggota.id}>
                {anggota.nama} ({anggota.id})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {categories.length > 0 && (
        <div>
          <Label htmlFor="kategori">Kategori</Label>
          <Select 
            value={formData.kategori || ""}
            onValueChange={(value) => handleSelectChange("kategori", value)}
          >
            <SelectTrigger id="kategori">
              <SelectValue placeholder="Pilih kategori" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {transaksi.jenis === "Simpan" ? "Simpanan" : "Pinjaman"} {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
      
      <div>
        <Label htmlFor="jumlah" className="required">Jumlah (Rp)</Label>
        <Input 
          id="jumlah" 
          placeholder="Contoh: 500000" 
          type="number" 
          min="0" 
          value={formData.jumlah}
          onChange={handleInputChange}
          required 
        />
      </div>
      
      <div>
        <Label htmlFor="keterangan">Keterangan</Label>
        <Textarea 
          id="keterangan" 
          placeholder="Masukkan keterangan (opsional)" 
          rows={3}
          value={formData.keterangan || ""}
          onChange={handleInputChange}
        />
      </div>
      
      <div className="flex justify-end space-x-2 pt-4">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Batal
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
        </Button>
      </div>
    </form>
  );
}
