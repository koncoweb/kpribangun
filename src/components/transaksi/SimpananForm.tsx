
import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { useToast } from "@/components/ui/use-toast";
import { Anggota } from "@/types";
import { createTransaksi } from "@/services/transaksi";
import { getSimpananCategories, SimpananCategory } from "@/services/transaksi/categories";

interface SimpananFormProps {
  anggotaList: Anggota[];
}

export function SimpananForm({ anggotaList }: SimpananFormProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const simpananCategories = getSimpananCategories();
  
  const [formData, setFormData] = useState({
    tanggal: new Date().toISOString().split('T')[0],
    anggotaId: "",
    jumlah: 0,
    kategori: SimpananCategory.WAJIB, // Default to WAJIB
    keterangan: ""
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: id === "jumlah" ? Number(value) : value
    }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
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
    
    if (!formData.kategori) {
      toast({
        title: "Kategori simpanan wajib dipilih",
        variant: "destructive",
      });
      return false;
    }
    
    return true;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      const newTransaksi = createTransaksi({
        tanggal: formData.tanggal,
        anggotaId: formData.anggotaId,
        jenis: "Simpan",
        kategori: formData.kategori,
        jumlah: formData.jumlah,
        keterangan: formData.keterangan,
        status: "Sukses"
      });
      
      if (newTransaksi) {
        toast({
          title: "Simpanan berhasil disimpan",
          description: `Simpanan dengan ID ${newTransaksi.id} telah berhasil disimpan`,
        });
        navigate("/transaksi/simpan");
      } else {
        throw new Error("Gagal menyimpan simpanan");
      }
    } catch (error) {
      toast({
        title: "Terjadi kesalahan",
        description: "Gagal menyimpan simpanan. Silakan coba lagi.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
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
            <Label htmlFor="idTransaksi">ID Transaksi</Label>
            <Input id="idTransaksi" placeholder="ID akan digenerate otomatis" disabled />
          </div>
        </div>
        
        <div>
          <Label htmlFor="anggotaId" className="required">Anggota</Label>
          <Select 
            value={formData.anggotaId}
            onValueChange={(value) => handleSelectChange("anggotaId", value)}
            required
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
        
        <div>
          <Label htmlFor="kategori" className="required">Kategori Simpanan</Label>
          <Select 
            value={formData.kategori}
            onValueChange={(value) => handleSelectChange("kategori", value)}
            required
          >
            <SelectTrigger id="kategori">
              <SelectValue placeholder="Pilih kategori simpanan" />
            </SelectTrigger>
            <SelectContent>
              {simpananCategories.map((category) => (
                <SelectItem key={category} value={category}>
                  Simpanan {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="jumlah" className="required">Jumlah (Rp)</Label>
          <Input 
            id="jumlah" 
            placeholder="Contoh: 500000" 
            type="number" 
            min="0" 
            value={formData.jumlah || ""}
            onChange={handleInputChange}
            required 
          />
          <p className="text-muted-foreground text-xs mt-1">
            Masukkan jumlah tanpa titik atau koma. Contoh: 500000 untuk Rp 500,000
          </p>
        </div>
        
        <div>
          <Label htmlFor="keterangan">Keterangan</Label>
          <Textarea 
            id="keterangan" 
            placeholder="Masukkan keterangan (opsional)" 
            rows={3}
            value={formData.keterangan}
            onChange={handleInputChange}
          />
        </div>
        
        <div className="flex justify-end space-x-2 pt-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => navigate("/transaksi/simpan")}
            disabled={isSubmitting}
          >
            Batalkan
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Menyimpan..." : "Simpan"}
          </Button>
        </div>
      </div>
    </form>
  );
}
