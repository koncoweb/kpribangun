
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createPengajuan } from "@/services/pengajuanService";
import { getPinjamanCategories } from "@/services/transaksi/categories";
import { getPengaturan } from "@/services/pengaturanService";

interface PengajuanPinjamanButtonProps {
  anggotaId: string;
  anggotaNama: string;
}

export function PengajuanPinjamanButton({ anggotaId, anggotaNama }: PengajuanPinjamanButtonProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const pinjamanCategories = getPinjamanCategories();
  const pengaturan = getPengaturan();
  
  const [formData, setFormData] = useState({
    jumlah: '',
    keterangan: '',
    kategori: pinjamanCategories[0]
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (kategori: string) => {
    setFormData(prev => ({ ...prev, kategori }));
  };

  // Helper function to display interest rate for pinjaman categories
  const getInterestRateForCategory = (category: string): string => {
    if (pengaturan.sukuBunga.pinjamanByCategory && 
        category in pengaturan.sukuBunga.pinjamanByCategory) {
      return `${pengaturan.sukuBunga.pinjamanByCategory[category]}%`;
    }
    return `${pengaturan.sukuBunga.pinjaman}%`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Validate input
      if (!formData.jumlah || isNaN(Number(formData.jumlah)) || Number(formData.jumlah) <= 0) {
        throw new Error("Jumlah pinjaman harus diisi dengan angka yang valid");
      }
      
      if (!formData.kategori) {
        throw new Error("Kategori pinjaman harus dipilih");
      }
      
      // Create pengajuan
      const result = await createPengajuan({
        anggotaId: anggotaId,
        jenis: "Pinjam",
        kategori: formData.kategori,
        jumlah: Number(formData.jumlah),
        tanggal: new Date().toISOString().split('T')[0],
        status: "Menunggu",
        keterangan: formData.keterangan || "Pengajuan pinjaman baru",
      });
      
      if (result) {
        toast({
          title: "Pengajuan berhasil",
          description: "Pengajuan pinjaman Anda telah berhasil dikirim dan sedang menunggu persetujuan",
        });
        setIsDialogOpen(false);
        setFormData({ 
          jumlah: '', 
          keterangan: '', 
          kategori: pinjamanCategories[0] 
        });
      } else {
        throw new Error("Gagal membuat pengajuan");
      }
    } catch (error: any) {
      toast({
        title: "Pengajuan gagal",
        description: error.message || "Terjadi kesalahan saat membuat pengajuan",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Button 
        onClick={() => setIsDialogOpen(true)} 
        variant="outline" 
        className="flex items-center gap-2"
      >
        Ajukan Pinjaman Baru
      </Button>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Pengajuan Pinjaman Baru</DialogTitle>
            <DialogDescription>
              Silakan isi form pengajuan pinjaman di bawah ini
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="grid w-full items-center gap-2">
              <Label htmlFor="anggota">Nama Anggota</Label>
              <Input id="anggota" value={anggotaNama} disabled />
            </div>
            
            <div className="grid w-full items-center gap-2">
              <Label htmlFor="kategori" className="required">Kategori Pinjaman</Label>
              <Select
                value={formData.kategori}
                onValueChange={handleCategoryChange}
                required
              >
                <SelectTrigger id="kategori">
                  <SelectValue placeholder="Pilih kategori pinjaman" />
                </SelectTrigger>
                <SelectContent>
                  {pinjamanCategories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat} - Bunga {getInterestRateForCategory(cat)} per bulan
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-1">
                Suku bunga untuk kategori ini: {getInterestRateForCategory(formData.kategori)} per bulan
              </p>
            </div>
            
            <div className="grid w-full items-center gap-2">
              <Label htmlFor="jumlah" className="required">Jumlah Pinjaman (Rp)</Label>
              <Input
                id="jumlah"
                name="jumlah"
                placeholder="Contoh: 5000000"
                value={formData.jumlah}
                onChange={handleInputChange}
                type="number"
                min="0"
                required
              />
            </div>
            
            <div className="grid w-full items-center gap-2">
              <Label htmlFor="keterangan">Keterangan</Label>
              <Textarea
                id="keterangan"
                name="keterangan"
                placeholder="Tujuan pinjaman (opsional)"
                value={formData.keterangan}
                onChange={handleInputChange}
                rows={3}
              />
            </div>
            
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsDialogOpen(false)}
                disabled={isSubmitting}
              >
                Batal
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Mengirim..." : "Kirim Pengajuan"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
