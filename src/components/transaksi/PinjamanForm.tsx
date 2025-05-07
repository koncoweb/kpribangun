
import { useState, useEffect } from "react";
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
import { getPengaturan } from "@/services/pengaturanService";
import { Anggota } from "@/types";
import { createTransaksi } from "@/services/transaksi";
import { getPinjamanCategories, PinjamanCategory } from "@/services/transaksi/categories";

interface PinjamanFormProps {
  anggotaList: Anggota[];
}

export function PinjamanForm({ anggotaList }: PinjamanFormProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const pinjamanCategories = getPinjamanCategories();
  
  // Get pengaturan for bunga options
  const pengaturan = getPengaturan();
  const tenorOptions = pengaturan?.tenor?.tenorOptions || [3, 6, 12, 24, 36];
  const defaultCategory = PinjamanCategory.REGULER;
  
  // Get category-specific interest rates
  const sukuBungaByCategory = pengaturan?.sukuBunga?.pinjamanByCategory || {};
  const defaultBunga = pengaturan?.sukuBunga?.pinjaman || 1.5;
  
  const [formData, setFormData] = useState({
    tanggal: new Date().toISOString().split('T')[0],
    anggotaId: "",
    jumlah: 0,
    tenor: 12, // Default tenor
    kategori: defaultCategory,
    bunga: sukuBungaByCategory[defaultCategory] || defaultBunga,
    angsuran: 0,
    keterangan: ""
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    
    let newFormData = {
      ...formData,
      [id]: id === "jumlah" || id === "bunga" || id === "tenor" ? Number(value) : value
    };
    
    // If jumlah, tenor, or bunga changes, recalculate angsuran
    if (id === "jumlah" || id === "tenor" || id === "bunga") {
      const calculatedAngsuran = calculateAngsuran(
        id === "jumlah" ? Number(value) : formData.jumlah,
        id === "tenor" ? Number(value) : formData.tenor,
        id === "bunga" ? Number(value) : formData.bunga
      );
      
      newFormData.angsuran = calculatedAngsuran;
    }
    
    setFormData(newFormData);
  };
  
  const handleSelectChange = (name: string, value: string | number) => {
    let newFormData = { ...formData, [name]: value };
    
    // If kategori changes, update the bunga
    if (name === "kategori") {
      const categoryBunga = sukuBungaByCategory[value as string] || defaultBunga;
      newFormData = {
        ...newFormData,
        bunga: categoryBunga
      };
    }
    
    // If anggotaId, tenor, or kategori changes, recalculate angsuran
    if (name === "tenor" || name === "kategori") {
      const calculatedAngsuran = calculateAngsuran(
        formData.jumlah, 
        name === "tenor" ? Number(value) : formData.tenor,
        name === "kategori" ? (sukuBungaByCategory[value as string] || defaultBunga) : formData.bunga
      );
      newFormData.angsuran = calculatedAngsuran;
    }
    
    setFormData(newFormData);
  };
  
  // Calculate angsuran bulanan (monthly payment)
  const calculateAngsuran = (pokok: number, tenor: number, bunga: number) => {
    if (!pokok || !tenor || tenor <= 0) return 0;
    
    // Simple flat rate calculation
    const bungaPerBulan = (pokok * bunga / 100);
    const totalBunga = bungaPerBulan * tenor;
    const totalBayar = pokok + totalBunga;
    return Math.ceil(totalBayar / tenor);
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
        title: "Jumlah pinjaman harus lebih dari 0",
        variant: "destructive",
      });
      return false;
    }
    
    if (!formData.kategori) {
      toast({
        title: "Kategori pinjaman wajib dipilih",
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
      // Create keterangan with loan details
      const totalBunga = formData.angsuran * formData.tenor - formData.jumlah;
      const detailKeterangan = 
        `Pinjaman ${formData.kategori}, ${formData.tenor} bulan dengan bunga ${formData.bunga}%. ` +
        `Tenor: ${formData.tenor} bulan. ` +
        `Angsuran per bulan: Rp ${formData.angsuran.toLocaleString("id-ID")}. ` +
        `Total bunga: Rp ${totalBunga.toLocaleString("id-ID")}. ` +
        (formData.keterangan ? `Catatan: ${formData.keterangan}` : "");
      
      const newTransaksi = createTransaksi({
        tanggal: formData.tanggal,
        anggotaId: formData.anggotaId,
        jenis: "Pinjam",
        kategori: formData.kategori,
        jumlah: formData.jumlah,
        keterangan: detailKeterangan,
        status: "Sukses"
      });
      
      if (newTransaksi) {
        toast({
          title: "Pinjaman berhasil disimpan",
          description: `Pinjaman dengan ID ${newTransaksi.id} telah berhasil disimpan`,
        });
        navigate("/transaksi/pinjam");
      } else {
        throw new Error("Gagal menyimpan pinjaman");
      }
    } catch (error) {
      toast({
        title: "Terjadi kesalahan",
        description: "Gagal menyimpan pinjaman. Silakan coba lagi.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Format currency for display
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
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
          <Label htmlFor="kategori" className="required">Kategori Pinjaman</Label>
          <Select 
            value={formData.kategori}
            onValueChange={(value) => handleSelectChange("kategori", value)}
            required
          >
            <SelectTrigger id="kategori">
              <SelectValue placeholder="Pilih kategori pinjaman" />
            </SelectTrigger>
            <SelectContent>
              {pinjamanCategories.map((category) => (
                <SelectItem key={category} value={category}>
                  Pinjaman {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-muted-foreground text-xs mt-1">
            Setiap kategori memiliki suku bunga yang berbeda
          </p>
        </div>
        
        <div>
          <Label htmlFor="jumlah" className="required">Jumlah Pinjaman (Rp)</Label>
          <Input 
            id="jumlah" 
            placeholder="Contoh: 5000000" 
            type="number" 
            min="0" 
            value={formData.jumlah || ""}
            onChange={handleInputChange}
            required 
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="tenor" className="required">Tenor (Bulan)</Label>
            <Select 
              value={String(formData.tenor)}
              onValueChange={(value) => handleSelectChange("tenor", parseInt(value))}
              required
            >
              <SelectTrigger id="tenor">
                <SelectValue placeholder="Pilih tenor" />
              </SelectTrigger>
              <SelectContent>
                {tenorOptions.map((option) => (
                  <SelectItem key={option} value={String(option)}>
                    {option} Bulan
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="bunga" className="required">Suku Bunga (%)</Label>
            <Input 
              id="bunga" 
              type="number" 
              min="0" 
              step="0.01"
              value={formData.bunga}
              onChange={handleInputChange}
              required 
            />
            <p className="text-muted-foreground text-xs mt-1">
              Bunga default untuk {formData.kategori}: {sukuBungaByCategory[formData.kategori] || defaultBunga}%
            </p>
          </div>
          
          <div>
            <Label htmlFor="angsuran">Angsuran per Bulan</Label>
            <Input 
              id="angsuran" 
              value={formatCurrency(formData.angsuran)}
              disabled
            />
          </div>
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
        
        <div className="bg-amber-50 p-4 rounded-md">
          <div className="mb-2 font-semibold">Ringkasan Pinjaman</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Kategori Pinjaman:</p>
              <p className="font-medium">Pinjaman {formData.kategori}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Pokok Pinjaman:</p>
              <p className="font-medium">{formatCurrency(formData.jumlah)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Bunga:</p>
              <p className="font-medium">{formData.bunga}% (Flat)</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Tenor:</p>
              <p className="font-medium">{formData.tenor} bulan</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Angsuran per Bulan:</p>
              <p className="font-medium">{formatCurrency(formData.angsuran)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Pembayaran:</p>
              <p className="font-medium">{formatCurrency(formData.angsuran * formData.tenor)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Bunga:</p>
              <p className="font-medium">{formatCurrency(formData.angsuran * formData.tenor - formData.jumlah)}</p>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end space-x-2 pt-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => navigate("/transaksi/pinjam")}
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
