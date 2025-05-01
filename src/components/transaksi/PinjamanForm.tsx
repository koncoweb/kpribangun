import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Anggota, Pengaturan } from "@/types"; // Fixed type import
import { createTransaksi } from "@/services/transaksi"; // Fixed import
import { calculateAngsuran, getPengaturan } from "@/services/pengaturanService";
import { FormActions } from "@/components/anggota/FormActions";

interface PinjamanFormProps {
  anggotaList: Anggota[];
}

export function PinjamanForm({ anggotaList }: PinjamanFormProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pengaturan, setPengaturan] = useState(getPengaturan());
  
  const [pinjamanForm, setPinjamanForm] = useState({
    tanggal: new Date().toISOString().split('T')[0],
    anggotaId: "",
    jumlah: 0,
    tenor: pengaturan.tenor.defaultTenor.toString(),
    sukuBunga: pengaturan.sukuBunga.pinjaman,
    tujuanPinjaman: "",
    keterangan: ""
  });
  
  // Calculated values for pinjaman preview
  const [pinjamanPreview, setPinjamanPreview] = useState({
    angsuranPerBulan: 0,
    totalBayar: 0
  });
  
  useEffect(() => {
    // Load pengaturan
    const loadedPengaturan = getPengaturan();
    setPengaturan(loadedPengaturan);
    
    // Set default tenor
    setPinjamanForm(prev => ({
      ...prev,
      tenor: loadedPengaturan.tenor.defaultTenor.toString(),
      sukuBunga: loadedPengaturan.sukuBunga.pinjaman
    }));
  }, []);
  
  // Calculate pinjaman preview when amount or tenor changes
  useEffect(() => {
    if (pinjamanForm.jumlah > 0 && pinjamanForm.tenor) {
      const result = calculateAngsuran(
        pinjamanForm.jumlah, 
        parseInt(pinjamanForm.tenor)
      );
      setPinjamanPreview(result);
    }
  }, [pinjamanForm.jumlah, pinjamanForm.tenor]);
  
  const handlePinjamanChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setPinjamanForm(prev => ({ ...prev, [id]: id === "jumlah" ? Number(value) : value }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setPinjamanForm(prev => ({ ...prev, [name]: value }));
  };
  
  const validatePinjamanForm = () => {
    if (!pinjamanForm.tanggal) {
      toast({
        title: "Tanggal wajib diisi",
        variant: "destructive",
      });
      return false;
    }
    
    if (!pinjamanForm.anggotaId) {
      toast({
        title: "Anggota wajib dipilih",
        variant: "destructive",
      });
      return false;
    }
    
    if (!pinjamanForm.jumlah || pinjamanForm.jumlah <= 0) {
      toast({
        title: "Jumlah pinjaman harus lebih dari 0",
        variant: "destructive",
      });
      return false;
    }
    
    if (!pinjamanForm.tenor) {
      toast({
        title: "Tenor wajib dipilih",
        variant: "destructive",
      });
      return false;
    }
    
    if (!pinjamanForm.tujuanPinjaman) {
      toast({
        title: "Tujuan pinjaman wajib dipilih",
        variant: "destructive",
      });
      return false;
    }
    
    return true;
  };
  
  const handleSubmitPinjaman = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validatePinjamanForm()) return;
    
    setIsSubmitting(true);
    
    try {
      const newTransaksi = createTransaksi({
        tanggal: pinjamanForm.tanggal,
        anggotaId: pinjamanForm.anggotaId,
        jenis: "Pinjam",
        jumlah: pinjamanForm.jumlah,
        keterangan: `Tenor: ${pinjamanForm.tenor} bulan, Bunga: ${pinjamanForm.sukuBunga}%, Tujuan: ${pinjamanForm.tujuanPinjaman}${pinjamanForm.keterangan ? `, ${pinjamanForm.keterangan}` : ''}`,
        status: "Sukses"
      });
      
      if (newTransaksi) {
        toast({
          title: "Transaksi pinjaman berhasil",
          description: `Transaksi pinjaman dengan ID ${newTransaksi.id} telah berhasil disimpan`,
        });
        navigate("/transaksi");
      } else {
        throw new Error("Gagal membuat transaksi pinjaman");
      }
    } catch (error) {
      toast({
        title: "Terjadi kesalahan",
        description: "Gagal menyimpan transaksi pinjaman. Silakan coba lagi.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmitPinjaman}>
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="tanggal" className="required">Tanggal</Label>
            <Input 
              id="tanggal" 
              type="date"
              value={pinjamanForm.tanggal}
              onChange={handlePinjamanChange}
              required 
            />
          </div>
          
          <div>
            <Label htmlFor="idTransaksi">ID Transaksi</Label>
            <Input id="idTransaksi" placeholder="ID akan digenerate otomatis" disabled />
          </div>
        </div>
        
        <div>
          <Label htmlFor="anggotaId" className="required">Pilih Anggota</Label>
          <Select 
            value={pinjamanForm.anggotaId}
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
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="jumlah" className="required">Jumlah Pinjaman (Rp)</Label>
            <Input 
              id="jumlah" 
              placeholder="Contoh: 5000000" 
              type="number" 
              min="0"
              value={pinjamanForm.jumlah || ""}
              onChange={handlePinjamanChange}
              required 
            />
          </div>
          
          <div>
            <Label htmlFor="tenor" className="required">Tenor (Bulan)</Label>
            <Select 
              value={pinjamanForm.tenor}
              onValueChange={(value) => handleSelectChange("tenor", value)}
              required
            >
              <SelectTrigger id="tenor">
                <SelectValue placeholder="Pilih tenor" />
              </SelectTrigger>
              <SelectContent>
                {pengaturan.tenor.tenorOptions.map((option) => (
                  <SelectItem key={option} value={option.toString()}>
                    {option} Bulan
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="sukuBunga">Suku Bunga (%)</Label>
            <Input 
              id="sukuBunga" 
              type="number" 
              step="0.1" 
              disabled 
              value={pinjamanForm.sukuBunga}
            />
            <p className="text-xs text-muted-foreground mt-1">
              *Suku bunga mengikuti pengaturan sistem
            </p>
          </div>
          
          <div>
            <Label htmlFor="tujuanPinjaman" className="required">Tujuan Pinjaman</Label>
            <Select 
              value={pinjamanForm.tujuanPinjaman}
              onValueChange={(value) => handleSelectChange("tujuanPinjaman", value)}
              required
            >
              <SelectTrigger id="tujuanPinjaman">
                <SelectValue placeholder="Pilih tujuan pinjaman" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Modal Usaha">Modal Usaha</SelectItem>
                <SelectItem value="Pendidikan">Pendidikan</SelectItem>
                <SelectItem value="Renovasi Rumah">Renovasi Rumah</SelectItem>
                <SelectItem value="Biaya Kesehatan">Biaya Kesehatan</SelectItem>
                <SelectItem value="Lainnya">Lainnya</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div>
          <Label htmlFor="keterangan">Keterangan</Label>
          <Textarea 
            id="keterangan" 
            placeholder="Masukkan keterangan (opsional)" 
            rows={3}
            value={pinjamanForm.keterangan}
            onChange={handlePinjamanChange}
          />
        </div>
        
        <div className="bg-muted/50 p-4 rounded-lg">
          <h3 className="font-medium text-sm mb-2">Informasi Angsuran</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Angsuran per bulan</p>
              <p className="font-medium">
                Rp {pinjamanPreview.angsuranPerBulan.toLocaleString("id-ID", { maximumFractionDigits: 0 })}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total yang harus dibayar</p>
              <p className="font-medium">
                Rp {pinjamanPreview.totalBayar.toLocaleString("id-ID", { maximumFractionDigits: 0 })}
              </p>
            </div>
          </div>
        </div>
        
        <FormActions 
          isSubmitting={isSubmitting} 
          isEditMode={false} 
          cancelHref="/transaksi" 
        />
      </div>
    </form>
  );
}
