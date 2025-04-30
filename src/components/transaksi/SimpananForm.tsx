
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Anggota } from "@/types";
import { createTransaksi } from "@/services/transaksiService";
import { FormActions } from "@/components/anggota/FormActions";

interface SimpananFormProps {
  anggotaList: Anggota[];
}

export function SimpananForm({ anggotaList }: SimpananFormProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [simpananForm, setSimpananForm] = useState({
    tanggal: new Date().toISOString().split('T')[0],
    anggotaId: "",
    jenisSimpanan: "",
    jumlah: 0,
    keterangan: ""
  });
  
  const handleSimpananChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setSimpananForm(prev => ({ ...prev, [id]: id === "jumlah" ? Number(value) : value }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setSimpananForm(prev => ({ ...prev, [name]: value }));
  };
  
  const validateSimpananForm = () => {
    if (!simpananForm.tanggal) {
      toast({
        title: "Tanggal wajib diisi",
        variant: "destructive",
      });
      return false;
    }
    
    if (!simpananForm.anggotaId) {
      toast({
        title: "Anggota wajib dipilih",
        variant: "destructive",
      });
      return false;
    }
    
    if (!simpananForm.jenisSimpanan) {
      toast({
        title: "Jenis simpanan wajib dipilih",
        variant: "destructive",
      });
      return false;
    }
    
    if (!simpananForm.jumlah || simpananForm.jumlah <= 0) {
      toast({
        title: "Jumlah harus lebih dari 0",
        variant: "destructive",
      });
      return false;
    }
    
    return true;
  };
  
  const handleSubmitSimpanan = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateSimpananForm()) return;
    
    setIsSubmitting(true);
    
    try {
      const newTransaksi = createTransaksi({
        tanggal: simpananForm.tanggal,
        anggotaId: simpananForm.anggotaId,
        jenis: "Simpan",
        jumlah: simpananForm.jumlah,
        keterangan: `${simpananForm.jenisSimpanan} - ${simpananForm.keterangan || ""}`.trim(),
        status: "Sukses"
      });
      
      if (newTransaksi) {
        toast({
          title: "Transaksi simpanan berhasil",
          description: `Transaksi simpanan dengan ID ${newTransaksi.id} telah berhasil disimpan`,
        });
        navigate("/transaksi");
      } else {
        throw new Error("Gagal membuat transaksi simpanan");
      }
    } catch (error) {
      toast({
        title: "Terjadi kesalahan",
        description: "Gagal menyimpan transaksi simpanan. Silakan coba lagi.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmitSimpanan}>
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="tanggal" className="required">Tanggal</Label>
            <Input 
              id="tanggal" 
              type="date"
              value={simpananForm.tanggal}
              onChange={handleSimpananChange}
              required 
            />
          </div>
          
          <div>
            <Label htmlFor="idTransaksi">ID Transaksi</Label>
            <Input id="idTransaksi" placeholder="ID akan digenerate otomatis" disabled />
          </div>
        </div>
        
        <div>
          <Label htmlFor="anggota" className="required">Pilih Anggota</Label>
          <Select 
            value={simpananForm.anggotaId}
            onValueChange={(value) => handleSelectChange("anggotaId", value)}
            required
          >
            <SelectTrigger id="anggota">
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
            <Label htmlFor="jenisSimpanan" className="required">Jenis Simpanan</Label>
            <Select 
              value={simpananForm.jenisSimpanan}
              onValueChange={(value) => handleSelectChange("jenisSimpanan", value)}
              required
            >
              <SelectTrigger id="jenisSimpanan">
                <SelectValue placeholder="Pilih jenis simpanan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Simpanan Pokok">Simpanan Pokok</SelectItem>
                <SelectItem value="Simpanan Wajib">Simpanan Wajib</SelectItem>
                <SelectItem value="Simpanan Sukarela">Simpanan Sukarela</SelectItem>
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
              value={simpananForm.jumlah || ""}
              onChange={handleSimpananChange}
              required 
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor="keterangan">Keterangan</Label>
          <Textarea 
            id="keterangan" 
            placeholder="Masukkan keterangan (opsional)" 
            rows={3}
            value={simpananForm.keterangan}
            onChange={handleSimpananChange}
          />
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
